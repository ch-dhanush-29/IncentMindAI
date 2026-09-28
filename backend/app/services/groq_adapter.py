import logging
import json
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.models.incident import (
    Incident, InvestigationResult, RootCauseHypothesis, 
    DiagnosticStep, MemoryEvidence, HypothesisStatus
)

logger = logging.getLogger(__name__)

class GroqLLMAdapter:
    """
    Groq LLM integration adapter.
    Uses Groq's high-speed inference for OpenAI/Qwen/Llama models with strict JSON output,
    uncertainty awareness, and verifiable grounding in retrieved Hindsight memory.
    """
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.is_connected = bool(self.api_key and self.api_key != "your_groq_api_key_here")

    async def investigate_incident(
        self,
        incident: Incident,
        recalled_memories: List[Dict[str, Any]],
        use_memory: bool = True
    ) -> InvestigationResult:
        """
        Produce a grounded, structured investigation.
        """
        # Format memories for the prompt
        memory_context = ""
        evidence_list: List[MemoryEvidence] = []
        
        if use_memory and recalled_memories:
            memory_context = "HISTORICAL INCIDENTS RECALLED FROM HINDSIGHT:\n"
            for idx, m in enumerate(recalled_memories, 1):
                ev = MemoryEvidence(
                    memory_id=m["memory_id"],
                    source_incident_id=m.get("source_incident_id"),
                    service=m.get("service"),
                    summary=m["summary"],
                    verified_root_cause=m.get("verified_root_cause"),
                    resolution_applied=m.get("resolution_applied"),
                    relevance_explanation=m.get("relevance_explanation", "Historical resolution pattern"),
                    similarity_score=m.get("similarity_score"),
                    retained_at=m.get("retained_at")
                )
                evidence_list.append(ev)
                memory_context += f"[{idx}] Source ID: {ev.source_incident_id or 'Unknown'}\n"
                memory_context += f"    Service: {ev.service}\n"
                memory_context += f"    Summary: {ev.summary}\n"
                memory_context += f"    Verified Root Cause: {ev.verified_root_cause or 'Not documented'}\n"
                memory_context += f"    Verified Resolution: {ev.resolution_applied or 'Not documented'}\n\n"
        elif use_memory and not recalled_memories:
            memory_context = "NO SIMILAR HISTORICAL INCIDENTS FOUND IN HINDSIGHT MEMORY.\n"
        else:
            memory_context = "MEMORY CONTEXT DISABLED (NO-MEMORY BASELINE MODE).\n"

        prompt = f"""
You are an expert SRE and incident investigator.
Analyze the following active incident and provide a rigorous, grounded investigation.

CRITICAL RULES:
1. Do not invent prior incidents or historical fixes not present in the recalled memories.
2. If memory is disabled or no memories are present, explicitly state that you are analyzing without prior incident knowledge.
3. Categorize root causes strictly into Confirmed (only if verified by direct proof), Suspected, or Unknown.
4. Recommend only safe, reversible diagnostic steps before suggesting disruptive actions.
5. All actions must require human approval.

CURRENT INCIDENT:
- ID: {incident.id}
- Title: {incident.title}
- Service: {incident.service}
- Severity: {incident.severity.value}
- Environment: {incident.environment}
- Symptoms: {', '.join(incident.symptoms)}
- Error Messages: {', '.join(incident.error_messages)}
- Affected Components: {', '.join(incident.affected_components)}
- Log Excerpt:
{incident.logs_excerpt or 'No raw logs provided'}

{memory_context}

Respond ONLY with a valid JSON object matching this exact schema:
{{
  "summary": "Concise summary of the incident and operational impact",
  "insufficient_evidence_warning": "Warning string if evidence is weak, else null",
  "confidence_rationale": "Clear qualitative explanation of certainty based on symptoms and available historical evidence",
  "hypotheses": [
    {{
      "cause": "Specific potential root cause",
      "status": "Confirmed | Suspected | Unknown",
      "evidence_supporting": ["Evidence bullet 1", "Evidence bullet 2"],
      "risk_level": "High | Medium | Low",
      "notes": "Contextual notes linking to past incidents if applicable"
    }}
  ],
  "diagnostic_steps": [
    {{
      "step_number": 1,
      "action": "Safe diagnostic step description",
      "rationale": "Why this step verifies the hypothesis",
      "is_reversible": true,
      "risk": "Low",
      "command_or_query": "kubectl / psql / curl query if helpful"
    }}
  ],
  "suggested_runbooks": [
    {{
      "title": "Runbook Title",
      "url_or_ref": "docs/runbooks/service-name.md"
    }}
  ],
  "recommended_actions": [
    "Recommended human-approved mitigation 1",
    "Recommended permanent fix action 2"
  ]
}}
"""

        # Call Groq if configured
        if self.is_connected:
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    headers = {
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    }
                    payload = {
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": "You are IncidentMind AI, an SRE incident investigation copilot. Output JSON only."},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.2
                    }
                    resp = await client.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers)
                    if resp.is_success:
                        data = resp.json()
                        content = data["choices"][0]["message"]["content"]
                        parsed = json.loads(content)
                        return self._build_investigation_result(incident.id, parsed, evidence_list, use_memory)
            except Exception as e:
                logger.error(f"Groq API call failed: {e}. Falling back to rule-based engine.")

        # Deterministic / Sandbox generation (used when Groq key is absent or fallback)
        return self._generate_sandbox_investigation(incident, evidence_list, use_memory)

    def _build_investigation_result(
        self,
        incident_id: str,
        parsed: Dict[str, Any],
        evidence_list: List[MemoryEvidence],
        use_memory: bool
    ) -> InvestigationResult:
        hypotheses = []
        for h in parsed.get("hypotheses", []):
            st = HypothesisStatus.SUSPECTED
            if h.get("status") == "Confirmed":
                st = HypothesisStatus.CONFIRMED
            elif h.get("status") == "Unknown":
                st = HypothesisStatus.UNKNOWN
            hypotheses.append(RootCauseHypothesis(
                cause=h.get("cause", "Unknown Root Cause"),
                status=st,
                evidence_supporting=h.get("evidence_supporting", []),
                risk_level=h.get("risk_level", "Medium"),
                notes=h.get("notes")
            ))

        steps = []
        for idx, s in enumerate(parsed.get("diagnostic_steps", []), 1):
            steps.append(DiagnosticStep(
                step_number=s.get("step_number", idx),
                action=s.get("action", ""),
                rationale=s.get("rationale", ""),
                is_reversible=s.get("is_reversible", True),
                risk=s.get("risk", "Low"),
                command_or_query=s.get("command_or_query")
            ))

        return InvestigationResult(
            incident_id=incident_id,
            summary=parsed.get("summary", "Automated incident investigation completed."),
            is_memory_enabled=use_memory,
            insufficient_evidence_warning=parsed.get("insufficient_evidence_warning"),
            confidence_rationale=parsed.get("confidence_rationale", "Synthesized from telemetry and Hindsight memory."),
            recalled_memories=evidence_list,
            hypotheses=hypotheses,
            diagnostic_steps=steps,
            suggested_runbooks=parsed.get("suggested_runbooks", []),
            recommended_actions=parsed.get("recommended_actions", [])
        )

    def _generate_sandbox_investigation(
        self,
        incident: Incident,
        evidence_list: List[MemoryEvidence],
        use_memory: bool
    ) -> InvestigationResult:
        """High-fidelity sandbox investigation engine when live LLM key is pending."""
        has_memory = use_memory and len(evidence_list) > 0
        
        if has_memory:
            top_mem = evidence_list[0]
            summary = (
                f"Incident '{incident.title}' on service '{incident.service}' shows patterns matching historical "
                f"incident {top_mem.source_incident_id or 'Hindsight-Knowledge-Base'}. Persistent memory indicates "
                f"this symptom was previously resolved by addressing: {top_mem.verified_root_cause or 'known service configuration'}."
            )
            confidence = (
                f"High confidence based on {len(evidence_list)} historical match(es) retrieved from Hindsight. "
                f"Identical symptoms ({', '.join(incident.symptoms[:2])}) previously confirmed on {top_mem.service or incident.service}."
            )
            warning = None
            hypotheses = [
                RootCauseHypothesis(
                    cause=top_mem.verified_root_cause or f"Configuration drift in {incident.service}",
                    status=HypothesisStatus.CONFIRMED if "pool" in incident.title.lower() or "timeout" in incident.title.lower() else HypothesisStatus.SUSPECTED,
                    evidence_supporting=[
                        f"Matches historical incident {top_mem.source_incident_id or 'retained memory'} with {int((top_mem.similarity_score or 0.85)*100)}% match",
                        f"Symptoms align with prior resolution: {top_mem.resolution_applied or 'runtime adjustment'}",
                        f"Current error: {incident.error_messages[0] if incident.error_messages else 'Elevated error rate'}"
                    ],
                    risk_level="High",
                    notes="Directly informed by verified Hindsight incident memory."
                ),
                RootCauseHypothesis(
                    cause=f"Downstream dependency latency or traffic surge in {incident.environment}",
                    status=HypothesisStatus.SUSPECTED,
                    evidence_supporting=["Secondary symptom check across service boundaries"],
                    risk_level="Medium",
                    notes="Alternative hypothesis to rule out before applying fix."
                )
            ]
            steps = [
                DiagnosticStep(
                    step_number=1,
                    action=f"Inspect active connections and telemetry on {incident.service}",
                    rationale="Confirm whether resource thresholds match historical incident signature.",
                    is_reversible=True,
                    risk="Low",
                    command_or_query=f"curl -s http://{incident.service}.internal/metrics | grep active_connections"
                ),
                DiagnosticStep(
                    step_number=2,
                    action="Check thread dump and connection pool leak traces",
                    rationale="Verify unreleased handles as demonstrated in prior postmortem.",
                    is_reversible=True,
                    risk="Low",
                    command_or_query=f"kubectl exec -it deployment/{incident.service} -- jcmd 1 Thread.print"
                ),
                DiagnosticStep(
                    step_number=3,
                    action=f"Apply verified mitigation: {top_mem.resolution_applied or 'Adjust max connection settings'}",
                    rationale="Execute proven resolution protocol with on-call approval.",
                    is_reversible=True,
                    risk="Medium",
                    command_or_query=f"# Require human confirmation before updating config map"
                )
            ]
            actions = [
                f"Verify match against past incident {top_mem.source_incident_id or 'Hindsight Record'}",
                f"Apply proven resolution: {top_mem.resolution_applied or 'Update connection pool limits'}",
                "Monitor error rate for 5 minutes post-adjustment"
            ]
        else:
            summary = (
                f"Analyzing incident '{incident.title}' without historical Hindsight memory. "
                f"Diagnosing strictly from provided symptoms ({', '.join(incident.symptoms)}) and error logs."
            )
            confidence = "Low to Moderate certainty. No prior postmortem or incident runbook was recalled from memory."
            warning = "No historical incident memory available. Analysis is exploring generic fault paths."
            hypotheses = [
                RootCauseHypothesis(
                    cause=f"Generic resource exhaustion or timeout in {incident.service}",
                    status=HypothesisStatus.SUSPECTED,
                    evidence_supporting=[incident.error_messages[0] if incident.error_messages else "Symptom logs"],
                    risk_level="Medium",
                    notes="Exploratory hypothesis (no historical grounding available)."
                ),
                RootCauseHypothesis(
                    cause="Transient network partition or infrastructure degradation",
                    status=HypothesisStatus.UNKNOWN,
                    evidence_supporting=["Intermittent error spikes reported in telemetry"],
                    risk_level="Low"
                )
            ]
            steps = [
                DiagnosticStep(
                    step_number=1,
                    action="Review raw container logs and recent commit log",
                    rationale="Establish baseline since no prior incident history exists.",
                    is_reversible=True,
                    risk="Low",
                    command_or_query=f"kubectl logs -l app={incident.service} --tail=200"
                ),
                DiagnosticStep(
                    step_number=2,
                    action="Run health check probe on database/dependency",
                    rationale="Isolate fault domain without historical runbooks.",
                    is_reversible=True,
                    risk="Low"
                )
            ]
            actions = [
                "Gather additional telemetry logs",
                "Escalate to service owner for domain guidance",
                "Record findings to Hindsight memory once root cause is confirmed"
            ]

        return InvestigationResult(
            incident_id=incident.id,
            summary=summary,
            is_memory_enabled=use_memory,
            insufficient_evidence_warning=warning,
            confidence_rationale=confidence,
            recalled_memories=evidence_list,
            hypotheses=hypotheses,
            diagnostic_steps=steps,
            suggested_runbooks=[
                {"title": f"{incident.service} Operational Runbook", "url_or_ref": f"runbooks/{incident.service}.md"}
            ],
            recommended_actions=actions
        )

groq_adapter = GroqLLMAdapter()
