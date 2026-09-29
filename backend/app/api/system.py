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
        "groq_model": groq_adapter.model,
        "groq_configured": groq_adapter.is_connected,
        "slack_connected": slack_service.is_connected,
        "slack_channel": slack_service.default_channel,
        "clerk_auth_enabled": auth_manager.auth_enabled,
        "db_mode": "MongoDB" if incident_repo._is_mongo_connected else "In-Memory Store"
    }

@router.get("/audit")
async def get_system_audit():
    return incident_repo.get_audit_trail()
