import logging
from fastapi import APIRouter, Request, Header, HTTPException, BackgroundTasks, Form
from typing import Optional, Dict, Any
from app.services.slack_service import slack_service
from app.repositories.incident_repo import incident_repo
from app.models.incident import Incident, Severity, IncidentStatus
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["External Integrations & Webhooks"])

@router.post("/slack/events")
async def slack_events(request: Request):
    """
    Handle Slack Event Subscriptions.
    Handles the initial URL verification challenge and incoming events.
    """
    body_bytes = await request.body()
    timestamp = request.headers.get("X-Slack-Request-Timestamp", "")
    signature = request.headers.get("X-Slack-Signature", "")

    # Verify signature
    if not slack_service.verify_signature(timestamp, signature, body_bytes):
        raise HTTPException(status_code=401, detail="Invalid Slack signature")

    data = await request.json()
    
    # Slack URL Verification Challenge
    if data.get("type") == "url_verification":
        return {"challenge": data.get("challenge")}

    event = data.get("event", {})
    event_type = event.get("type")

    logger.info(f"Received Slack Event: {event_type}")
    return {"status": "ok", "received": event_type}

@router.post("/slack/command")
async def slack_command(
    request: Request,
    command: str = Form(""),
    text: str = Form(""),
    user_name: str = Form("sre-user"),
    channel_name: str = Form("incidents"),
    response_url: str = Form("")
):
    """
    Handle Slack slash command: /incident [title]
    Declares a new production incident from Slack and notifies the channel.
    """
    body_bytes = await request.body()
    timestamp = request.headers.get("X-Slack-Request-Timestamp", "")
    signature = request.headers.get("X-Slack-Signature", "")

    if not slack_service.verify_signature(timestamp, signature, body_bytes):
        raise HTTPException(status_code=401, detail="Invalid Slack signature")

    incident_title = text.strip() if text.strip() else f"Manual Incident declared by @{user_name}"
    
    # Create incident in IncidentMind AI
    inc_count = len(await incident_repo.list_all()) + 1
    new_id = f"INC-SLK-{inc_count:03d}"
    
    incident = Incident(
        id=new_id,
        title=incident_title,
        severity=Severity.HIGH,
        status=IncidentStatus.INVESTIGATING,
        service="slack-reported-service",
        environment="production",
        symptoms=[f"Declared via Slack command: {command} {text}"],
        metrics={},
        logs=[f"[{datetime.utcnow().isoformat()}] Incident created via Slack by @{user_name}"],
        notes=[],
        declared_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    await incident_repo.save(incident)
    await slack_service.notify_incident_declared(incident)

    return {
        "response_type": "in_channel",
        "text": f"🚨 *Incident {new_id} Declared!*\nTitle: *{incident_title}*\nStatus: Investigating with Hindsight Memory.\nAccess War Room: http://localhost:8000/"
    }

@router.post("/slack/test")
async def test_slack_alert():
    """
    Test endpoint to verify Slack bot dispatch and message formatting.
    """
    incidents = await incident_repo.list_all()
    target_incident = incidents[0] if incidents else None
    
    if not target_incident:
        target_incident = Incident(
            id="INC-TEST-001",
            title="Redis Cluster Latency Spike & Pool Exhaustion",
            severity=Severity.CRITICAL,
            service="redis-cache-tier",
            environment="production",
            symptoms=["504 Gateway Timeout", "Max client connections reached"],
            created_at=datetime.utcnow(),
            declared_at=datetime.utcnow()
        )

    res = await slack_service.notify_incident_declared(target_incident)
    return {"status": "dispatched", "result": res}

@router.get("/slack/status")
async def get_slack_status():
    """
    Return current Slack Bot configuration and buffered message count.
    """
    return {
        "is_connected": slack_service.is_connected,
        "default_channel": slack_service.default_channel,
        "has_token": bool(slack_service.bot_token),
        "has_webhook": bool(slack_service.webhook_url),
        "has_signing_secret": bool(slack_service.signing_secret),
        "total_messages_sent": len(slack_service._sent_messages),
        "recent_messages": slack_service._sent_messages[-5:]
    }
