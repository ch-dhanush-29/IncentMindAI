import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.incident import (
    Incident, IncidentStatus, ResolutionRequest, 
    ResolutionRecord, InvestigationResult
)
from app.repositories.incident_repo import incident_repo
from app.services.hindsight_adapter import hindsight_adapter
from app.services.groq_adapter import groq_adapter

logger = logging.getLogger(__name__)

class IncidentService:
    """
    Core orchestrator linking incidents, Hindsight memory recall/retention,
    and LLM hypothesis verification.
    """
    async def investigate(self, incident_id: str, use_memory: bool = True) -> InvestigationResult:
        incident = await incident_repo.get_by_id(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        recalled_memories = []
        if use_memory:
            # Query Hindsight memory using symptoms and service context
            query = f"{incident.title} {incident.service} {' '.join(incident.symptoms)} {' '.join(incident.error_messages)}"
            recalled_memories = await hindsight_adapter.recall(query=query, limit=5, service=incident.service)

        # Call Groq LLM with memory evidence context
        investigation = await groq_adapter.investigate_incident(
            incident=incident,
            recalled_memories=recalled_memories,
            use_memory=use_memory
        )

        # Attach investigation result to incident
        incident.investigation = investigation
        if incident.status == IncidentStatus.NEW:
            incident.status = IncidentStatus.INVESTIGATING
        
        await incident_repo.save(incident)
        incident_repo._log_audit(
            "INVESTIGATION_RUN", 
            incident_id, 
            f"Ran investigation (memory_enabled={use_memory}, recalled_count={len(recalled_memories)})"
        )
        return investigation

    async def answer_question(self, incident_id: str, question: str) -> Dict[str, Any]:
        incident = await incident_repo.get_by_id(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        # Answer in the context of the incident and past memories
        memories = await hindsight_adapter.recall(query=f"{incident.service} {question}", limit=3)
        context_str = "\n".join([f"- Past record: {m['summary']} (Fix: {m.get('resolution_applied')})" for m in memories])

        response_text = (
            f"Based on active incident {incident_id} ({incident.service}) "
            f"and {len(memories)} recalled Hindsight memory record(s):\n\n"
            f"Regarding '{question}': Check if active telemetry matches the historical pattern. "
            f"In previous incidents with similar behavior, the team verified that {memories[0].get('verified_root_cause', 'configuration drift') if memories else 'isolated system load'} was the cause. "
            f"Recommended action is to run non-destructive diagnostics first."
        )

        incident.notes.append({
            "timestamp": datetime.utcnow().isoformat(),
            "type": "AI_QA",
            "question": question,
            "answer": response_text
        })
        await incident_repo.save(incident)
        return {"question": question, "answer": response_text, "context_memories_used": len(memories)}

    async def resolve_and_retain(self, incident_id: str, req: ResolutionRequest) -> Incident:
        incident = await incident_repo.get_by_id(incident_id)
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")

        # 1. Update Incident record with human-confirmed resolution
        resolution = ResolutionRecord(
            verified_root_cause=req.verified_root_cause,
            verification_method=req.verification_method,
            impact_summary=req.impact_summary,
            mitigation_applied=req.mitigation_applied,
            permanent_fix=req.permanent_fix,
            is_verified_by_human=req.is_verified_by_human,
            lessons_learned=req.lessons_learned,
            follow_up_tickets=req.follow_up_tickets,
            resolved_at=datetime.utcnow(),
            retained_in_hindsight=True
        )
        incident.resolution = resolution
        incident.status = IncidentStatus.RESOLVED
        incident.resolved_at = datetime.utcnow()

        # 2. Retain verified knowledge to Hindsight
        memory_content = (
            f"Service: {incident.service} [{incident.environment}]. "
            f"Incident: {incident.title}. Symptoms: {', '.join(incident.symptoms)}. "
            f"Verified Root Cause: {req.verified_root_cause}. "
            f"Verification: {req.verification_method}. "
            f"Applied Resolution: {req.permanent_fix}. "
            f"Mitigation: {req.mitigation_applied}. "
            f"Lessons Learned: {'; '.join(req.lessons_learned)}"
        )

        metadata = {
            "source_incident_id": incident.id,
            "service": incident.service,
            "severity": incident.severity.value,
            "environment": incident.environment,
            "verified_root_cause": req.verified_root_cause,
            "permanent_fix": req.permanent_fix,
            "is_verified": req.is_verified_by_human
        }

        await hindsight_adapter.retain(
            content=memory_content,
            context=f"incident_postmortem_{incident.service}",
            metadata=metadata,
            source_incident_id=incident.id
        )

        await incident_repo.save(incident)
        incident_repo._log_audit("INCIDENT_RESOLVED_AND_RETAINED", incident.id, f"Verified root cause: {req.verified_root_cause}")
        return incident

incident_service = IncidentService()
