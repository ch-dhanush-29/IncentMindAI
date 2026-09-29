import asyncio
import json
import logging
from datetime import datetime
from typing import AsyncGenerator, Dict, Any, List

logger = logging.getLogger(__name__)

class EventHub:
    """
    Real-time Server-Sent Events (SSE) broadcast hub.
    Delivers genuine backend event updates (incident creation, status changes,
    notes, AI investigations, and Hindsight retentions) to connected browser clients.
    """
    def __init__(self):
        self._subscribers: List[asyncio.Queue] = []

    async def subscribe(self) -> AsyncGenerator[str, None]:
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        self._subscribers.append(queue)
        logger.info(f"SSE client connected. Active subscribers: {len(self._subscribers)}")
        
        # Send initial connection handshake event
        initial_event = {
            "event": "CONNECTED",
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "message": "Connected to IncidentMind AI real-time event stream",
                "subscribers_count": len(self._subscribers)
            }
        }
        yield f"data: {json.dumps(initial_event)}\n\n"

        try:
            while True:
                # Wait for next genuine backend event
                payload = await queue.get()
                yield f"data: {json.dumps(payload)}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            if queue in self._subscribers:
                self._subscribers.remove(queue)
            logger.info(f"SSE client disconnected. Active subscribers: {len(self._subscribers)}")

    async def broadcast(self, event_type: str, data: Dict[str, Any]):
        """
        Broadcasts a genuine backend state change to all active subscribers.
        """
        payload = {
            "event": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        logger.debug(f"Broadcasting SSE event: {event_type} to {len(self._subscribers)} subscribers")
        for q in list(self._subscribers):
            try:
                q.put_nowait(payload)
            except asyncio.QueueFull:
                logger.warning("Subscriber queue full; dropping event to preserve real-time latency")

event_hub = EventHub()
