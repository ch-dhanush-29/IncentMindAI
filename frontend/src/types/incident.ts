export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'New' | 'Investigating' | 'Mitigated' | 'Resolved' | 'Closed';
export type HypothesisStatus = 'Confirmed' | 'Suspected' | 'Unknown' | 'Rejected';

export interface RootCauseHypothesis {
  id: string;
  cause: string;
  status: HypothesisStatus;
  evidence_supporting: string[];
  risk_level: string;
  notes?: string;
}

export interface DiagnosticStep {
  step_number: number;
  action: string;
  rationale: string;
  is_reversible: boolean;
  risk: string;
  command_or_query?: string;
}

export interface MemoryEvidence {
  memory_id: string;
  source_incident_id?: string;
  service?: string;
  summary: string;
  verified_root_cause?: string;
  resolution_applied?: string;
  relevance_explanation: string;
  similarity_score?: number;
  retained_at?: string;
}

export interface InvestigationResult {
  incident_id: string;
  summary: string;
  is_memory_enabled: boolean;
  insufficient_evidence_warning?: string;
  confidence_rationale: string;
  recalled_memories: MemoryEvidence[];
  hypotheses: RootCauseHypothesis[];
  diagnostic_steps: DiagnosticStep[];
  suggested_runbooks: { title: string; url_or_ref: string }[];
  recommended_actions: string[];
  created_at: string;
}

export interface ResolutionRecord {
  verified_root_cause: string;
  verification_method: string;
  impact_summary: string;
  mitigation_applied: string;
  permanent_fix: string;
  is_verified_by_human: boolean;
  verified_by_user: string;
  lessons_learned: string[];
  follow_up_tickets: string[];
  resolved_at: string;
  retained_in_hindsight: boolean;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  environment: string;
  symptoms: string[];
  error_messages: string[];
  affected_components: string[];
  logs_excerpt?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  investigation?: InvestigationResult;
  resolution?: ResolutionRecord;
  notes: any[];
  audit_trail: any[];
}
