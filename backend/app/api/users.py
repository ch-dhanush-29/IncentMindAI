import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from app.models.incident import UserActivity, UserActivityCreate
from app.repositories.incident_repo import incident_repo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/user", tags=["User Activity"])

@router.post("/activity", response_model=Dict[str, Any], status_code=201)
async def record_activity(activity_in: UserActivityCreate):
    """
    Record an explicit user activity (e.g. login session start, dashboard interaction).
    """
    try:
        record = await incident_repo.record_user_activity(
            user_id=activity_in.user_id,
            user_email=activity_in.user_email,
            user_name=activity_in.user_name,
            action_type=activity_in.action_type,
            details=activity_in.details,
            incident_id=activity_in.incident_id,
            incident_title=activity_in.incident_title,
            metadata=activity_in.metadata
        )
        return record
    except Exception as e:
        logger.error(f"Failed to record user activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to persist user activity")

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_user_history(
    user_email: Optional[str] = Query(None, description="Clerk primary email address"),
    user_id: Optional[str] = Query(None, description="Clerk user ID"),
    action_type: Optional[str] = Query(None, description="Filter by action type (ALL, INCIDENT_DECLARED, INVESTIGATION_RUN, NOTE_ADDED, POSTMORTEM_RETAINED, COPILOT_QUERY)"),
    limit: int = Query(100, ge=1, le=500)
):
    """
    Retrieve lifetime chronological activity history for the authenticated user.
    """
    return await incident_repo.get_user_history(
        user_email=user_email,
        user_id=user_id,
        action_type=action_type,
        limit=limit
    )

@router.get("/summary", response_model=Dict[str, Any])
async def get_user_summary(
    user_email: Optional[str] = Query(None, description="Clerk primary email address"),
    user_id: Optional[str] = Query(None, description="Clerk user ID")
):
    """
    Retrieve lifetime summary statistics for the user (incidents, investigations, notes, postmortems).
    """
    return await incident_repo.get_user_summary(
        user_email=user_email,
        user_id=user_id
    )
