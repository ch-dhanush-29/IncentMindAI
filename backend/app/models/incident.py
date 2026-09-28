from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class Severity(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class IncidentStatus(str, Enum):
    NEW = "New"
    INVESTIGATING = "Investigating"
    MITIGATED = "Mitigated"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class HypothesisStatus(str, Enum):
    CONFIRMED = "Confirmed"
    SUSPECTED = "Suspected"
    UNKNOWN = "Unknown"
    REJECTED = "Rejected"

class RootCauseHypothesis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cause: str
    status: HypothesisStatus = HypothesisStatus.SUSPECTED
    evidence_supporting: List[str] = Field(default_factory=list)
    risk_level: str = "Medium"
    notes: Optional[str] = None

class DiagnosticStep(BaseModel):
    step_number: int
    action: str
    rationale: str
    is_reversible: bool = True
    risk: str = "Low"
    command_or_query: Optional[str] = None

class MemoryEvidence(BaseModel):
    memory_id: str
    source_incident_id: Optional[str] = None
    service: Optional[str] = None
    summary: str
    verified_root_cause: Optional[str] = None
    resolution_applied: Optional[str] = None
    relevance_explanation: str
    similarity_score: Optional[float] = None
    retained_at: Optional[str] = None

class InvestigationResult(BaseModel):
    incident_id: str
    summary: str
    is_memory_enabled: bool = True
    insufficient_evidence_warning: Optional[str] = None
    confidence_rationale: str
    recalled_memories: List[MemoryEvidence] = Field(default_factory=list)
    hypotheses: List[RootCauseHypothesis] = Field(default_factory=list)
    diagnostic_steps: List[DiagnosticStep] = Field(default_factory=list)
    suggested_runbooks: List[Dict[str, str]] = Field(default_factory=list)
    recommended_actions: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ResolutionRecord(BaseModel):
    verified_root_cause: str
    verification_method: str
    impact_summary: str
    mitigation_applied: str
    permanent_fix: str
    is_verified_by_human: bool = True
    verified_by_user: str = "sre-engineer"
    lessons_learned: List[str] = Field(default_factory=list)
    follow_up_tickets: List[str] = Field(default_factory=list)
    resolved_at: datetime = Field(default_factory=datetime.utcnow)
    retained_in_hindsight: bool = False

class Incident(BaseModel):
    id: str = Field(default_factory=lambda: f"INC-{uuid.uuid4().hex[:6].upper()}")
    title: str
    description: str
    service: str
    severity: Severity = Severity.MEDIUM
    status: IncidentStatus = IncidentStatus.NEW
    environment: str = "production"
    symptoms: List[str] = Field(default_factory=list)
    error_messages: List[str] = Field(default_factory=list)
    affected_components: List[str] = Field(default_factory=list)
    logs_excerpt: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    
    investigation: Optional[InvestigationResult] = None
    resolution: Optional[ResolutionRecord] = None
    notes: List[Dict[str, Any]] = Field(default_factory=list)
    audit_trail: List[Dict[str, Any]] = Field(default_factory=list)

class IncidentCreate(BaseModel):
    title: str
    description: str
    service: str
    severity: Severity = Severity.MEDIUM
    environment: str = "production"
    symptoms: List[str] = Field(default_factory=list)
    error_messages: List[str] = Field(default_factory=list)
    affected_components: List[str] = Field(default_factory=list)
    logs_excerpt: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IncidentStatus] = None
    severity: Optional[Severity] = None
    environment: Optional[str] = None
    symptoms: Optional[List[str]] = None
    error_messages: Optional[List[str]] = None
    logs_excerpt: Optional[str] = None

class QuestionRequest(BaseModel):
    question: str

class ResolutionRequest(BaseModel):
    verified_root_cause: str
    verification_method: str
    impact_summary: str
    mitigation_applied: str
    permanent_fix: str
    is_verified_by_human: bool = True
    lessons_learned: List[str] = Field(default_factory=list)
    follow_up_tickets: List[str] = Field(default_factory=list)
