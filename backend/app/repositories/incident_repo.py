import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.incident import Incident, IncidentCreate, IncidentUpdate, IncidentStatus
from app.core.config import settings

logger = logging.getLogger(__name__)

class IncidentRepository:
    """
    Data repository handling MongoDB storage with automatic in-memory persistence fallback.
    Guarantees immediate zero-setup execution while supporting production MongoDB clusters.
    """
    def __init__(self):
        self._memory_store: Dict[str, Incident] = {}
        self._audit_store: List[Dict[str, Any]] = []
        self._mongo_client = None
        self._db = None
        self._is_mongo_connected = False

    async def connect(self):
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self._mongo_client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=1000)
            # test ping
            await self._mongo_client.admin.command('ping')
            self._db = self._mongo_client[settings.DATABASE_NAME]
            self._is_mongo_connected = True
            logger.info("Connected to MongoDB cluster.")
        except Exception as e:
            logger.info(f"MongoDB not reachable ({e}). Using In-Memory persistent repository with demo support.")
            self._is_mongo_connected = False

    async def create(self, incident_in: IncidentCreate) -> Incident:
        incident = Incident(**incident_in.model_dump())
        self._memory_store[incident.id] = incident
        
        # Audit log
        self._log_audit("INCIDENT_CREATED", incident.id, f"Created incident {incident.title}")

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.insert_one(incident.model_dump())
            except Exception as e:
                logger.error(f"MongoDB insert failed: {e}")

        return incident

    async def get_by_id(self, incident_id: str) -> Optional[Incident]:
        if self._is_mongo_connected and self._db is not None:
            try:
                doc = await self._db.incidents.find_one({"id": incident_id})
                if doc:
                    doc.pop("_id", None)
                    return Incident(**doc)
            except Exception as e:
                logger.error(f"MongoDB get failed: {e}")
        return self._memory_store.get(incident_id)

    async def list_all(
        self,
        service: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        assignee: Optional[str] = None,
        query: Optional[str] = None
    ) -> List[Incident]:
        incidents = list(self._memory_store.values())
        
        if service:
            incidents = [i for i in incidents if i.service.lower() == service.lower()]
        if severity:
            incidents = [i for i in incidents if i.severity.value.lower() == severity.lower()]
        if status:
            incidents = [i for i in incidents if i.status.value.lower() == status.lower()]
        if assignee:
            incidents = [i for i in incidents if (i.assignee or "").lower() == assignee.lower()]
        if query:
            q = query.lower()
            incidents = [
                i for i in incidents 
                if q in i.title.lower() or q in i.description.lower() or any(q in s.lower() for s in i.symptoms) or (i.assignee and q in i.assignee.lower())
            ]

        # Sort newest first
        incidents.sort(key=lambda x: x.created_at, reverse=True)
        return incidents

    async def update(self, incident_id: str, update_in: IncidentUpdate) -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if not incident:
            return None

        data = update_in.model_dump(exclude_unset=True)
        for key, val in data.items():
            setattr(incident, key, val)
        incident.updated_at = datetime.utcnow()

        self._memory_store[incident_id] = incident
        self._log_audit("INCIDENT_UPDATED", incident_id, f"Updated fields: {list(data.keys())}")

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.update_one(
                    {"id": incident_id},
                    {"$set": incident.model_dump()}
                )
            except Exception as e:
                logger.error(f"MongoDB update failed: {e}")

        return incident

    async def add_note(self, incident_id: str, note_data: Dict[str, Any]) -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if not incident:
            return None

        note_entry = {
            "id": f"NOTE-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            "content": note_data.get("content", ""),
            "author": note_data.get("author", "sre-engineer"),
            "note_type": note_data.get("note_type", "investigation_note")
        }
        incident.notes.append(note_entry)
        incident.updated_at = datetime.utcnow()

        self._memory_store[incident_id] = incident
        self._log_audit("NOTE_ADDED", incident_id, f"Added note by {note_entry['author']}: {note_entry['content'][:60]}")

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.update_one(
                    {"id": incident_id},
                    {"$set": {"notes": incident.notes, "updated_at": incident.updated_at}}
                )
            except Exception as e:
                logger.error(f"MongoDB note update failed: {e}")

        return incident

    async def reopen(self, incident_id: str, reason: str = "Reopened for further investigation", engineer: str = "sre-engineer") -> Optional[Incident]:
        incident = await self.get_by_id(incident_id)
        if not incident:
            return None

        incident.status = IncidentStatus.INVESTIGATING
        incident.resolved_at = None
        incident.updated_at = datetime.utcnow()
        reopen_note = {
            "id": f"NOTE-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            "content": f"[REOPENED]: {reason}",
            "author": engineer,
            "note_type": "reopen_event"
        }
        incident.notes.append(reopen_note)

        self._memory_store[incident_id] = incident
        self._log_audit("INCIDENT_REOPENED", incident_id, f"Reopened by {engineer}: {reason}")

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.update_one(
                    {"id": incident_id},
                    {"$set": {
                        "status": incident.status.value,
                        "resolved_at": None,
                        "notes": incident.notes,
                        "updated_at": incident.updated_at
                    }}
                )
            except Exception as e:
                logger.error(f"MongoDB reopen update failed: {e}")

        return incident

    async def save(self, incident: Incident) -> Incident:
        incident.updated_at = datetime.utcnow()
        self._memory_store[incident.id] = incident
        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.replace_one(
                    {"id": incident.id},
                    incident.model_dump(),
                    upsert=True
                )
            except Exception as e:
                logger.error(f"MongoDB replace failed: {e}")
        return incident

    def _log_audit(self, action: str, incident_id: str, details: str):
        self._audit_store.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "incident_id": incident_id,
            "details": details,
            "user": "sre-engineer"
        })

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        return list(reversed(self._audit_store))

incident_repo = IncidentRepository()

