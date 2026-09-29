import logging
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.incident import Incident, IncidentCreate, IncidentUpdate, IncidentStatus
from app.core.config import settings
from app.core.events import event_hub

logger = logging.getLogger(__name__)

class IncidentRepository:
    """
    Data repository handling MongoDB storage with automatic in-memory persistence fallback.
    Guarantees immediate zero-setup execution while supporting production MongoDB clusters.
    """
    def __init__(self):
        self._memory_store: Dict[str, Incident] = {}
        self._audit_store: List[Dict[str, Any]] = []
        self._user_activities: List[Dict[str, Any]] = []
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
        creator_email = (incident_in.metadata.get("creator_email") if incident_in.metadata else None) or "commander@incidentmind.ai"
        creator_name = (incident_in.metadata.get("creator_name") if incident_in.metadata else None) or incident.assignee or "Incident Commander"
        creator_id = (incident_in.metadata.get("creator_id") if incident_in.metadata else None) or "unknown"
        self._log_audit("INCIDENT_CREATED", incident.id, f"Created incident {incident.title}", user=creator_name)

        # Record persistent user activity
        await self.record_user_activity(
            user_id=creator_id,
            user_email=creator_email,
            user_name=creator_name,
            action_type="INCIDENT_DECLARED",
            details=f"Declared {incident.severity.value} incident for {incident.service}: {incident.title}",
            incident_id=incident.id,
            incident_title=incident.title,
            metadata={"severity": incident.severity.value, "service": incident.service}
        )

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.insert_one(incident.model_dump())
            except Exception as e:
                logger.error(f"MongoDB insert failed: {e}")

        # Real-time event broadcast
        await event_hub.broadcast("INCIDENT_CREATED", {
            "incident_id": incident.id,
            "title": incident.title,
            "service": incident.service,
            "severity": incident.severity.value,
            "status": incident.status.value,
            "created_at": incident.created_at.isoformat()
        })

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

        # Real-time event broadcast
        await event_hub.broadcast("INCIDENT_UPDATED", {
            "incident_id": incident_id,
            "fields": list(data.keys()),
            "status": incident.status.value,
            "severity": incident.severity.value,
            "assignee": incident.assignee,
            "updated_at": incident.updated_at.isoformat()
        })

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
        self._log_audit("NOTE_ADDED", incident_id, f"Added note by {note_entry['author']}: {note_entry['content'][:60]}", user=note_entry['author'])

        # Record persistent user activity
        author_email = note_data.get("author_email") or f"{note_entry['author'].lower().replace(' ', '.')}@incidentmind.ai"
        author_name = note_entry["author"]
        author_id = note_data.get("author_id") or "unknown"
        await self.record_user_activity(
            user_id=author_id,
            user_email=author_email,
            user_name=author_name,
            action_type="NOTE_ADDED",
            details=f"Added note to {incident.title}: {note_entry['content'][:80]}",
            incident_id=incident.id,
            incident_title=incident.title,
            metadata={"note_type": note_entry["note_type"]}
        )

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.incidents.update_one(
                    {"id": incident_id},
                    {"$set": {"notes": incident.notes, "updated_at": incident.updated_at}}
                )
            except Exception as e:
                logger.error(f"MongoDB note update failed: {e}")

        # Real-time event broadcast
        await event_hub.broadcast("NOTE_ADDED", {
            "incident_id": incident_id,
            "note": note_entry
        })

        return incident

    async def reopen(
        self, 
        incident_id: str, 
        reason: str = "Reopened for further investigation", 
        engineer: str = "sre-engineer",
        engineer_email: Optional[str] = None,
        engineer_id: Optional[str] = None
    ) -> Optional[Incident]:
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
        self._log_audit("INCIDENT_REOPENED", incident_id, f"Reopened by {engineer}: {reason}", user=engineer)

        # Record persistent user activity
        await self.record_user_activity(
            user_id=engineer_id or "unknown",
            user_email=engineer_email or f"{engineer.lower().replace(' ', '.')}@incidentmind.ai",
            user_name=engineer,
            action_type="INCIDENT_REOPENED",
            details=f"Reopened incident {incident.title}: {reason}",
            incident_id=incident.id,
            incident_title=incident.title,
            metadata={"reason": reason}
        )

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

        # Real-time event broadcast
        await event_hub.broadcast("INCIDENT_REOPENED", {
            "incident_id": incident_id,
            "status": "Investigating",
            "reason": reason,
            "engineer": engineer
        })

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

    def _log_audit(self, action: str, incident_id: str, details: str, user: str = "sre-engineer"):
        self._audit_store.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "incident_id": incident_id,
            "details": details,
            "user": user
        })

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        return list(reversed(self._audit_store))

    async def record_user_activity(
        self,
        user_id: Optional[str] = "unknown",
        user_email: str = "commander@incidentmind.ai",
        user_name: Optional[str] = "Incident Commander",
        action_type: str = "GENERAL",
        details: str = "",
        incident_id: Optional[str] = None,
        incident_title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Persist a user action to both in-memory store and MongoDB for lifetime history retrieval.
        """
        activity_record = {
            "id": f"ACT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}",
            "user_id": user_id or "unknown",
            "user_email": (user_email or "commander@incidentmind.ai").strip().lower(),
            "user_name": user_name or "Incident Commander",
            "action_type": action_type,
            "details": details,
            "incident_id": incident_id,
            "incident_title": incident_title,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        self._user_activities.append(activity_record)

        if self._is_mongo_connected and self._db is not None:
            try:
                await self._db.user_activities.insert_one(dict(activity_record))
            except Exception as e:
                logger.error(f"MongoDB user activity insert failed: {e}")

        return activity_record

    async def get_user_history(
        self,
        user_email: Optional[str] = None,
        user_id: Optional[str] = None,
        action_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Retrieve lifetime history of actions for a given user, with optional filter by action_type.
        """
        query_filter: Dict[str, Any] = {}
        if user_email:
            query_filter["user_email"] = user_email.strip().lower()
        elif user_id and user_id != "unknown":
            query_filter["user_id"] = user_id

        if action_type and action_type.upper() != "ALL":
            query_filter["action_type"] = action_type.upper()

        if self._is_mongo_connected and self._db is not None:
            try:
                cursor = self._db.user_activities.find(query_filter).sort("timestamp", -1).limit(limit)
                docs = await cursor.to_list(length=limit)
                for d in docs:
                    d.pop("_id", None)
                if docs:
                    return docs
            except Exception as e:
                logger.error(f"MongoDB get_user_history failed: {e}")

        # Fallback to in-memory store
        results = self._user_activities
        if user_email:
            clean_email = user_email.strip().lower()
            results = [a for a in results if a.get("user_email", "").strip().lower() == clean_email]
        elif user_id and user_id != "unknown":
            results = [a for a in results if a.get("user_id") == user_id]

        if action_type and action_type.upper() != "ALL":
            target_act = action_type.upper()
            results = [a for a in results if a.get("action_type") == target_act]

        return list(reversed(results))[:limit]

    async def get_user_summary(
        self,
        user_email: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Compute high-level engagement and incident resolution stats for the user's dashboard.
        """
        history = await self.get_user_history(user_email=user_email, user_id=user_id, limit=5000)

        incidents_declared = sum(1 for a in history if a.get("action_type") == "INCIDENT_DECLARED")
        investigations_run = sum(1 for a in history if a.get("action_type") == "INVESTIGATION_RUN")
        notes_added = sum(1 for a in history if a.get("action_type") == "NOTE_ADDED")
        postmortems_retained = sum(1 for a in history if a.get("action_type") == "POSTMORTEM_RETAINED")
        copilot_queries = sum(1 for a in history if a.get("action_type") == "COPILOT_QUERY")
        sessions_count = sum(1 for a in history if a.get("action_type") in ["LOGIN", "SESSION_START"])

        last_active = history[0].get("timestamp") if history else datetime.utcnow().isoformat()

        return {
            "user_email": (user_email or "commander@incidentmind.ai").strip().lower(),
            "user_id": user_id or "unknown",
            "total_actions": len(history),
            "incidents_declared": incidents_declared,
            "investigations_run": investigations_run,
            "notes_added": notes_added,
            "postmortems_retained": postmortems_retained,
            "copilot_queries": copilot_queries,
            "sessions_count": max(1, sessions_count),
            "last_active": last_active
        }

incident_repo = IncidentRepository()

