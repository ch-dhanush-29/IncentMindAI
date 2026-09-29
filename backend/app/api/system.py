from fastapi import APIRouter
from typing import Dict, Any
from app.services.hindsight_adapter import hindsight_adapter
from app.services.groq_adapter import groq_adapter
from app.services.slack_service import slack_service
from app.core.auth import auth_manager
from app.repositories.incident_repo import incident_repo

router = APIRouter(tags=["Health & Settings"])

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "IncidentMind AI API", "version": "1.0.0"}

@router.get("/health/ready")
async def readiness_check():
    hindsight_status = await hindsight_adapter.check_connection()
    return {
        "status": "ready",
        "hindsight": hindsight_status,
        "groq": {
            "is_configured": groq_adapter.is_connected,
            "model": groq_adapter.model
        },
        "slack": {
            "is_connected": slack_service.is_connected,
            "channel": slack_service.default_channel
        },
        "clerk_auth": {
            "is_enabled": auth_manager.auth_enabled,
            "mode": "Live Clerk Cloud" if auth_manager.auth_enabled else "Development SRE Sandbox"
        },
        "database": {
            "is_mongo_connected": incident_repo._is_mongo_connected,
            "mode": "MongoDB Cluster" if incident_repo._is_mongo_connected else "In-Memory Resilient Store"
        }
    }

@router.get("/settings")
async def get_settings():
    return {
        "hindsight_bank_id": hindsight_adapter.bank_id,
        "hindsight_base_url": hindsight_adapter.base_url,
        "hindsight_mode": "Vectorize Cloud" if hindsight_adapter.is_cloud_connected else "Local Resilient Sandbox",
        "hindsight_configured": hindsight_adapter.is_cloud_connected,
        "groq_model": groq_adapter.model,
        "groq_configured": groq_adapter.is_connected,
        "slack_connected": slack_service.is_connected,
        "slack_channel": slack_service.default_channel,
        "slack_is_live": slack_service.is_live_bot,
        "slack_configured": bool(slack_service.bot_token or slack_service.webhook_url),
        "clerk_auth_enabled": auth_manager.auth_enabled,
        "clerk_configured": bool(auth_manager.secret_key or auth_manager.publishable_key),
        "clerk_publishable_key": auth_manager.publishable_key,
        "db_mode": "MongoDB" if incident_repo._is_mongo_connected else "In-Memory Store"
    }

from fastapi.responses import StreamingResponse
from app.core.events import event_hub
from app.core.seed import seed_realistic_incidents

@router.get("/audit")
async def get_system_audit():
    return incident_repo.get_audit_trail()

@router.get("/events/stream")
async def stream_realtime_events():
    """
    Server-Sent Events (SSE) endpoint providing genuine real-time updates
    for new incidents, status updates, notes, and Hindsight knowledge writes.
    """
    return StreamingResponse(
        event_hub.subscribe(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/system/seed-demo")
async def explicit_seed_demo():
    """
    Explicit endpoint for intentionally loading synthetic demo records when needed for evaluation.
    Never called automatically in production.
    """
    await seed_realistic_incidents()
    await event_hub.broadcast("DEMO_SEEDED", {"message": "Synthetic demonstration records populated."})
    return {"status": "ok", "message": "Demo incidents loaded."}

