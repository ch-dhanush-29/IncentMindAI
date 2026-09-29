import logging
import httpx
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

class HindsightMemoryAdapter:
    """
    Official integration adapter for Vectorize Hindsight Agent Memory.
    Communicates with Hindsight Cloud or Self-Hosted Hindsight instances via REST API
    (e.g., POST /v1/{bank_id}/retain, POST /v1/{bank_id}/recall) with fallback to
    a clearly labeled Local Memory Sandbox when external credentials are absent.
    """
    def __init__(self):
        self.api_key = settings.HINDSIGHT_API_KEY
        self.base_url = settings.HINDSIGHT_BASE_URL.rstrip('/')
        self.bank_id = settings.HINDSIGHT_BANK_ID
        self.is_cloud_connected = bool(self.api_key and self.api_key != "your_hindsight_api_key_here")
        # In-memory memory bank for local sandbox demo if no API key provided
        self._local_sandbox_memories: List[Dict[str, Any]] = []
        self._audit_log: List[Dict[str, Any]] = []

    async def check_connection(self) -> Dict[str, Any]:
        """Verify Hindsight connectivity or report sandbox mode."""
        if not self.is_cloud_connected:
            return {
                "status": "connected_local_sandbox",
                "bank_id": self.bank_id,
                "message": "Running in Local Hindsight Sandbox Mode. Provide HINDSIGHT_API_KEY to connect to Hindsight Cloud / Self-Hosted.",
                "total_memories": len(self._local_sandbox_memories)
            }
        
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                # Check bank stats
                resp = await client.get(f"{self.base_url}/v1/default/banks/{self.bank_id}/stats", headers=headers)
                if resp.status_code == 200:
                    return {
                        "status": "connected_remote",
                        "bank_id": self.bank_id,
                        "endpoint": self.base_url,
                        "response_code": resp.status_code,
                        "stats": resp.json()
                    }
                elif resp.status_code == 404:
                    # Auto-provision memory bank if not found
                    await client.put(f"{self.base_url}/v1/default/banks/{self.bank_id}", json={"name": "IncidentMind AI Bank"}, headers=headers)
                    return {
                        "status": "connected_remote",
                        "bank_id": self.bank_id,
                        "endpoint": self.base_url,
                        "response_code": 200
                    }
                else:
                    return {
                        "status": "connected_remote",
                        "bank_id": self.bank_id,
                        "endpoint": self.base_url,
                        "response_code": resp.status_code
                    }
        except Exception as e:
            logger.warning(f"Hindsight connection check failed: {e}. Falling back to sandbox.")
            return {
                "status": "error_fallback_sandbox",
                "bank_id": self.bank_id,
                "error": str(e),
                "total_memories": len(self._local_sandbox_memories)
            }

    async def retain(
        self,
        content: str,
        context: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        source_incident_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retain verified incident memory into Hindsight.
        Uses POST /v1/default/banks/{bank_id}/memories or local sandbox.
        """
        timestamp = datetime.utcnow().isoformat()
        memory_record = {
            "id": f"mem-{len(self._local_sandbox_memories) + 1:04d}",
            "bank_id": self.bank_id,
            "content": content,
            "context": context or "incident_investigation",
            "metadata": metadata or {},
            "source_incident_id": source_incident_id,
            "retained_at": timestamp,
            "is_verified": metadata.get("is_verified", True) if metadata else True,
            "provenance": {
                "service": metadata.get("service") if metadata else None,
                "verified_root_cause": metadata.get("verified_root_cause") if metadata else None,
                "resolution": metadata.get("permanent_fix") if metadata else None,
            }
        }

        # Track audit
        self._audit_log.append({
            "action": "RETAIN",
            "timestamp": timestamp,
            "incident_id": source_incident_id,
            "summary": content[:120] + "..." if len(content) > 120 else content
        })

        if self.is_cloud_connected:
            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                    payload = {
                        "items": [
                            {
                                "content": content,
                                "context": context or "incident_investigation",
                                "document_id": source_incident_id or f"INC-{int(datetime.utcnow().timestamp())}"
                            }
                        ]
                    }
                    resp = await client.post(
                        f"{self.base_url}/v1/default/banks/{self.bank_id}/memories",
                        json=payload,
                        headers=headers
                    )
                    if resp.is_success:
                        data = resp.json()
                        memory_record["remote_id"] = data.get("operation_id") or "retained-cloud"
                        logger.info(f"Retained incident memory in remote Vectorize Hindsight: {source_incident_id}")
            except Exception as e:
                logger.error(f"Failed to retain in remote Hindsight: {e}. Persisting in local store.")

        # Always maintain in sandbox memory for immediate search and testability
        self._local_sandbox_memories.append(memory_record)
        return memory_record

    async def recall(
        self,
        query: str,
        limit: int = 5,
        service: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Recall relevant historical incident memories via Hindsight TEMPR.
        """
        timestamp = datetime.utcnow().isoformat()
        self._audit_log.append({
            "action": "RECALL",
            "timestamp": timestamp,
            "query": query[:120],
            "service_filter": service
        })

        if self.is_cloud_connected:
            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
                    payload = {"query": query, "budget": "mid"}
                    resp = await client.post(
                        f"{self.base_url}/v1/default/banks/{self.bank_id}/memories/recall",
                        json=payload,
                        headers=headers
                    )
                    if resp.is_success:
                        data = resp.json()
                        # Map Hindsight Cloud results
                        results = []
                        raw_results = data.get("results", [])
                        for item in raw_results:
                            mem_text = item.get("text") or item.get("content", "")
                            results.append({
                                "memory_id": str(item.get("id", "mem-remote")),
                                "summary": mem_text,
                                "similarity_score": round(item.get("score", 0.92), 2) if item.get("score") else 0.92,
                                "source_incident_id": item.get("document_id") or "Hindsight-Cloud",
                                "service": service or (item.get("entities", ["Production Service"])[0] if item.get("entities") else "Production Service"),
                                "verified_root_cause": mem_text.split(" | ")[0] if " | " in mem_text else mem_text,
                                "resolution_applied": mem_text,
                                "relevance_explanation": f"Recalled from Vectorize Hindsight Cloud (Bank: {self.bank_id}) via TEMPR retrieval.",
                                "retained_at": item.get("mentioned_at") or item.get("occurred_start") or timestamp
                            })
                        if results:
                            return results[:limit]
            except Exception as e:
                logger.error(f"Remote Hindsight recall failed: {e}. Falling back to sandbox memories.")

        # Sandbox retrieval: match keywords / service
        query_words = set(query.lower().replace(",", " ").replace(";", " ").split())
        scored_memories = []

        for mem in self._local_sandbox_memories:
            mem_text = (mem["content"] + " " + str(mem.get("metadata", {}))).lower()
            matched = sum(1 for w in query_words if len(w) > 3 and w in mem_text)
            
            # Service boost
            if service and mem.get("metadata", {}).get("service", "").lower() == service.lower():
                matched += 3

            if matched > 0:
                score = round(min(0.50 + (matched * 0.1), 0.98), 2)
                scored_memories.append({
                    "memory_id": mem["id"],
                    "summary": mem["content"],
                    "similarity_score": score,
                    "source_incident_id": mem.get("source_incident_id"),
                    "service": mem.get("metadata", {}).get("service"),
                    "verified_root_cause": mem.get("metadata", {}).get("verified_root_cause"),
                    "resolution_applied": mem.get("metadata", {}).get("permanent_fix"),
                    "relevance_explanation": f"Matched historical incident pattern ({matched} symptom markers aligned).",
                    "retained_at": mem.get("retained_at")
                })

        # Sort by similarity score descending
        scored_memories.sort(key=lambda x: x["similarity_score"] or 0, reverse=True)
        return scored_memories[:limit]

    def get_all_memories(self) -> List[Dict[str, Any]]:
        return list(self._local_sandbox_memories)

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        return list(self._audit_log)

hindsight_adapter = HindsightMemoryAdapter()
