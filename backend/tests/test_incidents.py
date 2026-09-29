import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.repositories.incident_repo import incident_repo
from app.services.hindsight_adapter import hindsight_adapter

def reset_data():
    incident_repo._memory_store.clear()
    hindsight_adapter._local_sandbox_memories.clear()
    hindsight_adapter._audit_log.clear()

@pytest.mark.asyncio
async def test_health_endpoints():
    reset_data()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"

        ready_res = await ac.get("/api/health/ready")
        assert ready_res.status_code == 200
        assert ready_res.json()["status"] == "ready"

@pytest.mark.asyncio
async def test_incident_lifecycle_and_hindsight_retention():
    reset_data()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create incident
        payload = {
            "title": "Database pool starvation on checkout",
            "description": "504 timeouts on checkout",
            "service": "checkout-svc",
            "severity": "Critical",
            "environment": "production",
            "symptoms": ["504 Gateway Timeout", "Max connections 100/100 reached"],
            "error_messages": ["HikariPool connection timeout"],
            "affected_components": ["checkout-svc", "rds-postgres"]
        }
        create_res = await ac.post("/api/incidents", json=payload)
        assert create_res.status_code == 201
        inc = create_res.json()
        inc_id = inc["id"]

        # 2. Investigate (No prior memory yet)
        investigate_res = await ac.post(f"/api/incidents/{inc_id}/analyze?use_memory=true")
        assert investigate_res.status_code == 200
        inv_data = investigate_res.json()
        assert inv_data["incident_id"] == inc_id
        assert len(inv_data["diagnostic_steps"]) > 0

        # 3. Resolve and retain verified outcome to Hindsight
        res_payload = {
            "verified_root_cause": "Unclosed JDBC statement in checkout webhook listener causing connection leak",
            "verification_method": "pg_stat_activity analysis",
            "impact_summary": "10m checkout degradation",
            "mitigation_applied": "Restarted pods and scaled pool",
            "permanent_fix": "Patched listener with try-with-resources",
            "is_verified_by_human": True,
            "lessons_learned": ["Always monitor unclosed statements"],
            "follow_up_tickets": ["JIRA-100"]
        }
        resolve_res = await ac.post(f"/api/incidents/{inc_id}/resolve", json=res_payload)
        assert resolve_res.status_code == 200
        assert resolve_res.json()["status"] == "Resolved"

        # 4. Check Hindsight memories list
        mem_res = await ac.get("/api/memory/records")
        assert mem_res.status_code == 200
        memories = mem_res.json()
        assert len(memories) >= 1
        assert "Unclosed JDBC statement" in memories[0]["content"]

        # 5. Create a SECOND similar incident and verify Hindsight recall!
        second_payload = {
            "title": "Recurrent 504 timeouts on checkout service",
            "description": "Checkout threads blocked waiting for db connection",
            "service": "checkout-svc",
            "severity": "High",
            "environment": "production",
            "symptoms": ["504 Gateway Timeout", "connection pool blocked"],
            "error_messages": ["HikariPool connection timeout"],
            "affected_components": ["checkout-svc"]
        }
        inc2_res = await ac.post("/api/incidents", json=second_payload)
        inc2_id = inc2_res.json()["id"]

        # 6. Investigate with memory enabled
        inv2_res = await ac.post(f"/api/incidents/{inc2_id}/analyze?use_memory=true")
        assert inv2_res.status_code == 200
        inv2_data = inv2_res.json()
        assert len(inv2_data["recalled_memories"]) >= 1
        recalled_ids = [r.get("source_incident_id") for r in inv2_data["recalled_memories"]]
        recalled_causes = [str(r.get("verified_root_cause", "")) for r in inv2_data["recalled_memories"]]
        assert inc_id in recalled_ids or any("JDBC" in c for c in recalled_causes)

        # 7. Test Notes addition
        note_payload = {
            "content": "Observed connection count dropping to 15 after pool resize.",
            "author": "Elena Rostova (Principal SRE)",
            "note_type": "evidence"
        }
        note_res = await ac.post(f"/api/incidents/{inc_id}/notes", json=note_payload)
        assert note_res.status_code == 200
        assert len(note_res.json()["notes"]) >= 1
        assert "Elena Rostova" in note_res.json()["notes"][-1]["author"]

        # 8. Test Assignee & Severity Update
        patch_res = await ac.patch(f"/api/incidents/{inc_id}", json={"assignee": "Carlos Ruiz (Infra Lead)", "severity": "Medium"})
        assert patch_res.status_code == 200
        assert patch_res.json()["assignee"] == "Carlos Ruiz (Infra Lead)"
        assert patch_res.json()["severity"] == "Medium"

        # 9. Test Reopen Incident
        reopen_payload = {
            "reason": "Intermittent timeouts observed after canary deploy",
            "engineer": "sre-oncall"
        }
        reopen_res = await ac.post(f"/api/incidents/{inc_id}/reopen", json=reopen_payload)
        assert reopen_res.status_code == 200
        assert reopen_res.json()["status"] == "Investigating"
        assert reopen_res.json()["resolved_at"] is None

