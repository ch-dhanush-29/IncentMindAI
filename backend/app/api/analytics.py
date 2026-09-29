from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict
from app.repositories.incident_repo import incident_repo
from app.services.hindsight_adapter import hindsight_adapter

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
async def get_analytics_summary():
    incidents = await incident_repo.list_all()
    
    by_status = {"New": 0, "Investigating": 0, "Mitigated": 0, "Resolved": 0, "Closed": 0}
    by_severity = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    by_service: Dict[str, int] = {}
    
    resolved_count = 0
    total_duration_minutes = 0.0

    for inc in incidents:
        by_status[inc.status.value] = by_status.get(inc.status.value, 0) + 1
        by_severity[inc.severity.value] = by_severity.get(inc.severity.value, 0) + 1
        by_service[inc.service] = by_service.get(inc.service, 0) + 1

        if inc.resolved_at and inc.created_at:
            resolved_count += 1
            duration = (inc.resolved_at - inc.created_at).total_seconds() / 60.0
            total_duration_minutes += duration

    # Real MTTR: None if no incidents have been resolved yet
    mttr_minutes = round(total_duration_minutes / resolved_count, 1) if resolved_count > 0 else None

    # Fetch live Hindsight memory count
    memories = await hindsight_adapter.get_all_memories_async()

    return {
        "total_incidents": len(incidents),
        "open_incidents": len(incidents) - by_status.get("Resolved", 0) - by_status.get("Closed", 0),
        "resolved_incidents": resolved_count,
        "mean_time_to_resolve_minutes": mttr_minutes,
        "by_status": by_status,
        "by_severity": by_severity,
        "by_service": by_service,
        "total_hindsight_memories": len(memories),
        "provenance": {
            "source": "persisted_database_records",
            "calculated_at": datetime.utcnow().isoformat(),
            "has_data": len(incidents) > 0
        }
    }

@router.get("/trends")
async def get_analytics_trends():
    incidents = await incident_repo.list_all()
    memories = await hindsight_adapter.get_all_memories_async()

    now = datetime.utcnow()
    day_counts = defaultdict(lambda: {"incidents": 0, "recalled_assists": 0})
    
    # Rolling 5 calendar days
    date_keys = [(now - timedelta(days=i)).strftime("%b %d") for i in range(4, -1, -1)]
    for dk in date_keys:
        day_counts[dk] = {"incidents": 0, "recalled_assists": 0}

    for inc in incidents:
        dk = inc.created_at.strftime("%b %d")
        if dk in day_counts:
            day_counts[dk]["incidents"] += 1
            if inc.investigation and inc.investigation.recalled_memories:
                day_counts[dk]["recalled_assists"] += 1

    daily_volume = [
        {
            "date": dk,
            "incidents": day_counts[dk]["incidents"],
            "recalled_assists": day_counts[dk]["recalled_assists"]
        }
        for dk in date_keys
    ]

    # Genuine recurring failure signatures derived from real incidents and verified memories
    recurring = []
    service_patterns = defaultdict(lambda: {"occurrences": 0, "pattern": "", "status": "Knowledge Retained"})
    
    # From memories
    for m in memories:
        svc = m.get("service") or m.get("metadata", {}).get("service") or "system"
        root_cause = m.get("verified_root_cause") or m.get("metadata", {}).get("verified_root_cause") or m.get("summary") or m.get("content")
        if root_cause:
            service_patterns[svc]["occurrences"] += 1
            service_patterns[svc]["pattern"] = str(root_cause)[:70]
            service_patterns[svc]["status"] = "Retained in Hindsight"

    # From incidents
    for inc in incidents:
        svc = inc.service
        service_patterns[svc]["occurrences"] += 1
        if not service_patterns[svc]["pattern"]:
            service_patterns[svc]["pattern"] = inc.title[:70]
        if inc.status.value == "Resolved":
            service_patterns[svc]["status"] = "Remediated with Hindsight"
        elif inc.status.value == "Investigating":
            service_patterns[svc]["status"] = "Active Investigation"

    for svc, info in list(service_patterns.items())[:5]:
        recurring.append({
            "service": svc,
            "pattern": info["pattern"],
            "occurrences": info["occurrences"],
            "status": info["status"]
        })

    return {
        "daily_volume": daily_volume,
        "recurring_signatures": recurring,
        "provenance": {
            "source": "live_persisted_incidents_and_hindsight_cloud",
            "calculated_at": datetime.utcnow().isoformat(),
            "total_incidents_analyzed": len(incidents),
            "total_memories_analyzed": len(memories),
            "has_data": len(incidents) > 0 or len(memories) > 0
        }
    }


