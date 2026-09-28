from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.models.incident import (
    Incident, IncidentCreate, IncidentUpdate, 
    InvestigationResult, QuestionRequest, ResolutionRequest
)
from app.repositories.incident_repo import incident_repo
from app.services.incident_service import incident_service
from app.services.hindsight_adapter import hindsight_adapter

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[Incident])
async def list_incidents(
    service: Optional[str] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    q: Optional[str] = None
):
    return await incident_repo.list_all(service=service, severity=severity, status=status, query=q)

@router.post("", response_model=Incident, status_code=201)
async def create_incident(incident_in: IncidentCreate):
    return await incident_repo.create(incident_in)

@router.get("/{incident_id}", response_model=Incident)
async def get_incident(incident_id: str):
    incident = await incident_repo.get_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.patch("/{incident_id}", response_model=Incident)
async def update_incident(incident_id: str, update_in: IncidentUpdate):
    incident = await incident_repo.update(incident_id, update_in)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("/{incident_id}/analyze", response_model=InvestigationResult)
async def analyze_incident(incident_id: str, use_memory: bool = True):
    try:
        return await incident_service.investigate(incident_id, use_memory=use_memory)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{incident_id}/questions")
async def ask_question(incident_id: str, req: QuestionRequest):
    try:
        return await incident_service.answer_question(incident_id, req.question)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{incident_id}/memories")
async def get_incident_memories(incident_id: str):
    incident = await incident_repo.get_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    query = f"{incident.service} {' '.join(incident.symptoms)}"
    return await hindsight_adapter.recall(query=query, limit=5, service=incident.service)

@router.post("/{incident_id}/resolve", response_model=Incident)
async def resolve_incident(incident_id: str, req: ResolutionRequest):
    try:
        return await incident_service.resolve_and_retain(incident_id, req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
