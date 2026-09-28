from fastapi import APIRouter
from typing import List, Dict, Any, Optional
from app.services.hindsight_adapter import hindsight_adapter

router = APIRouter(prefix="/memory", tags=["Hindsight Memory"])

@router.get("/status")
async def get_memory_status():
    return await hindsight_adapter.check_connection()

@router.get("/records")
async def list_memories():
    return hindsight_adapter.get_all_memories()

@router.get("/audit")
async def get_memory_audit():
    return hindsight_adapter.get_audit_trail()

@router.post("/query")
async def query_memory(q: str, service: Optional[str] = None, limit: int = 5):
    return await hindsight_adapter.recall(query=q, limit=limit, service=service)
