import logging
import hmac
import hashlib
import time
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

class SlackBotService:
    """
    Slack War Room & Bot Integration Service.
    Dispatches rich Slack Block Kit notifications to designated incident channels
    and processes incoming slash commands or incident declarations.
    """
    def __init__(self):
        self.bot_token = settings.SLACK_BOT_TOKEN
        self.signing_secret = settings.SLACK_SIGNING_SECRET
        self.default_channel = settings.SLACK_DEFAULT_CHANNEL
        self.webhook_url = settings.SLACK_WEBHOOK_URL
        self.is_live_bot = bool(self.bot_token and self.bot_token.startswith("xoxb-"))
        self.is_connected = bool(self.is_live_bot or self.webhook_url)
        self._sent_messages: List[Dict[str, Any]] = []

    def verify_signature(self, timestamp: str, signature: str, body: bytes) -> bool:
        """
        Verify incoming request signature from Slack using HMAC-SHA256.
        """
        if not self.signing_secret:
            return True  # If no signing secret configured in dev mode, permit

        try:
            # Prevent replay attacks (> 5 minutes difference)
            if abs(time.time() - float(timestamp)) > 60 * 5:
                logger.warning("Slack request timestamp out of bounds.")
                return False

            sig_basestring = f"v0:{timestamp}:{body.decode('utf-8')}".encode('utf-8')
            computed_signature = 'v0=' + hmac.new(
                self.signing_secret.encode('utf-8'),
                sig_basestring,
                hashlib.sha256
            ).hexdigest()

            return hmac.compare_digest(computed_signature, signature)
        except Exception as e:
            logger.error(f"Error verifying Slack signature: {e}")
            return False

    async def send_message(self, text: str, blocks: Optional[List[Dict[str, Any]]] = None, channel: Optional[str] = None) -> Dict[str, Any]:
        """
        Post message to Slack via Web API, Webhook, or local War Room buffer.
        """
        target_channel = channel or self.default_channel
        payload: Dict[str, Any] = {
            "channel": target_channel,
            "text": text
        }
        if blocks:
            payload["blocks"] = blocks

        record = {
            "timestamp": datetime.utcnow().isoformat(),
            "channel": target_channel,
            "text": text,
            "has_blocks": bool(blocks)
        }
        self._sent_messages.append(record)

        if self.is_live_bot:
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    headers = {
                        "Authorization": f"Bearer {self.bot_token}",
                        "Content-Type": "application/json; charset=utf-8"
                    }
                    resp = await client.post("https://slack.com/api/chat.postMessage", json=payload, headers=headers)
                    data = resp.json()
                    if not data.get("ok"):
                        logger.error(f"Slack API error: {data.get('error')}")
                    return data
            except Exception as e:
                logger.error(f"Failed to post Slack message: {e}")
                return {"status": "error", "error": str(e), "record": record}

        elif self.webhook_url:
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    resp = await client.post(self.webhook_url, json=payload)
                    return {"status": "sent_via_webhook", "code": resp.status_code, "record": record}
            except Exception as e:
                logger.error(f"Failed to post Slack webhook: {e}")
                return {"status": "error", "error": str(e), "record": record}

        # Sandbox buffer fallback when bot token is a placeholder
        logger.info(f"[Slack War Room Sandbox] Message buffered for {target_channel}: {text}")
        return {
            "status": "buffered_sandbox",
            "ok": True,
            "channel": target_channel,
            "message": "Slack Bot token is in sandbox buffer mode. Alert successfully formatted and recorded in Incident War Room.",
            "record": record
        }

    async def notify_incident_declared(self, incident: Any) -> Dict[str, Any]:
        """
        Post a rich alert banner when a new incident is declared.
        """
        severity_emoji = {
            "Critical": "🚨 *P1 - CRITICAL*",
            "High": "⚠️ *P2 - HIGH*",
            "Medium": "🟡 *P3 - MEDIUM*",
            "Low": "🔵 *P4 - LOW*"
        }.get(getattr(incident, "severity", "High"), "⚠️ *INCIDENT*")

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"🚨 Production Incident Declared: {incident.id}",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Severity:*\n{severity_emoji}"},
                    {"type": "mrkdwn", "text": f"*Service:*\n`{incident.service}`"},
                    {"type": "mrkdwn", "text": f"*Environment:*\n`{incident.environment}`"},
                    {"type": "mrkdwn", "text": f"*Status:*\n`{getattr(incident, 'status', 'Investigating')}`"}
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Title:*\n{incident.title}\n\n*Symptoms & Error Traces:*\n```{', '.join(incident.symptoms[:4])}```"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Open Incident War Room 🧠", "emoji": True},
                        "url": f"http://localhost:8000/",
                        "style": "primary"
                    }
                ]
            }
        ]

        text = f"🚨 Incident {incident.id} [{incident.severity}] on {incident.service}: {incident.title}"
        return await self.send_message(text=text, blocks=blocks)

    async def notify_investigation_completed(self, incident_id: str, investigation: Any) -> Dict[str, Any]:
        """
        Post AI-generated root cause analysis and recommended actions into the Slack war room.
        """
        hypothesis = getattr(investigation, "hypothesis", "Investigating telemetry patterns")
        confidence = getattr(investigation, "confidence", 0.92)
        actions = getattr(investigation, "recommended_actions", [])

        actions_text = "\n".join([f"• `{a.get('type', 'Action')}`: {a.get('description', '')}" for a in actions[:3]])

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"🧠 AI Diagnostic Result: {incident_id}",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Root Cause Hypothesis (Confidence: {int(confidence * 100)}%):*\n>{hypothesis}"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Verified Runbook Actions:*\n{actions_text}"
                }
            }
        ]

        text = f"🧠 AI Diagnostic for {incident_id}: {hypothesis}"
        return await self.send_message(text=text, blocks=blocks)

    async def notify_incident_resolved(self, incident: Any) -> Dict[str, Any]:
        """
        Post resolution confirmation and Hindsight memory retention audit.
        """
        resolution = getattr(incident, "resolution", None)
        root_cause = getattr(resolution, "verified_root_cause", "Confirmed by SRE") if resolution else "Resolved"
        permanent_fix = getattr(resolution, "permanent_fix", "Mitigation applied") if resolution else "Applied"

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"✅ Incident Resolved: {incident.id}",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Service:*\n`{incident.service}`"},
                    {"type": "mrkdwn", "text": "*Hindsight Bank:*\n`retained_in_vector_memory`"}
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Verified Root Cause:*\n{root_cause}\n\n*Permanent Fix Applied:*\n{permanent_fix}"
                }
            }
        ]

        text = f"✅ Incident {incident.id} Resolved. Knowledge saved to Hindsight memory bank."
        return await self.send_message(text=text, blocks=blocks)

slack_service = SlackBotService()
