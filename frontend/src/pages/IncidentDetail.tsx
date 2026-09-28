import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Clock, 
  FileCheck2, 
  Server,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button, CodeBlock } from '../components/ui';

interface IncidentDetailProps {
  incidentId: string;
  onBack: () => void;
  onStartInvestigation: (id: string) => void;
  onNavigateToResolve: (id: string) => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({
  incidentId,
  onBack,
  onStartInvestigation,
  onNavigateToResolve
}) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'symptoms' | 'investigation' | 'resolution'>('timeline');

  useEffect(() => {
    loadIncident();
  }, [incidentId]);

  const loadIncident = async () => {
    try {
      setLoading(true);
      const data = await api.getIncident(incidentId);
      setIncident(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#64748B] font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <span>Loading incident war room dossier {incidentId}...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-[#64748B]">
        Incident not found. <button onClick={onBack} className="text-[#4F46E5] underline cursor-pointer">Return to Feed</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back and Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents Feed
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartInvestigation(incident.id)}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#4F46E5] mr-1.5" />
            Launch AI Studio
          </Button>

          {incident.status !== 'Resolved' && (
            <Button
              variant="hindsight"
              size="sm"
              onClick={() => onNavigateToResolve(incident.id)}
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
              Verify & Resolve Postmortem
            </Button>
          )}
        </div>
      </div>

      {/* Incident Header Card */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#4F46E5] text-sm px-2 py-0.5 rounded-lg bg-[#EEF2FF] border border-indigo-100">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-[#64748B] flex items-center gap-1">
                <Server className="w-3 h-3 text-[#94A3B8]" />
                [{incident.service}]
              </span>
              <span className="text-[#64748B]">• env: {incident.environment}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#172033] tracking-tight leading-snug">
              {incident.title}
            </h1>
            <p className="text-xs text-[#64748B] leading-relaxed font-sans max-w-2xl">
              {incident.description}
            </p>
          </div>

          {/* Quick Meta Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#64748B] space-y-2 self-start min-w-[220px] shadow-xs">
            <div className="flex items-center justify-between">
              <span>Declared:</span>
              <span className="text-[#172033]">{new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service:</span>
              <span className="text-[#172033] font-semibold">{incident.service}</span>
            </div>
            <div className="pt-1 border-t border-[#E2E8F0] flex items-center justify-between">
              <span>Hindsight:</span>
              <span className={incident.resolution?.retained_in_hindsight ? 'text-[#4F46E5] font-bold' : 'text-[#94A3B8]'}>
                {incident.resolution?.retained_in_hindsight ? 'RETAINED' : 'PENDING POSTMORTEM'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pt-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Lifecycle Stepper
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'symptoms'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Symptoms & Raw Logs
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'investigation'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Investigation Findings
          </button>
          <button
            onClick={() => setActiveTab('resolution')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'resolution'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Confirmed Postmortem
          </button>
        </div>
      </Card>

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-semibold text-[#172033]">Incident Lifecycle Progression</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-700">
                <span>1. TRIGGERED</span>
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033]">Automated monitor tripped on {incident.service}</div>
              <div className="text-[10px] text-[#64748B] font-mono">{new Date(incident.created_at).toLocaleTimeString()}</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.investigation ? 'bg-indigo-50 border-indigo-200' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.investigation ? 'text-[#4F46E5]' : 'text-[#64748B]'
              }`}>
                <span>2. INVESTIGATING</span>
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033]">AI Agent querying Hindsight memory bank</div>
              <div className="text-[10px] text-[#64748B] font-mono">
                {incident.investigation ? 'Diagnosis synthesized' : 'Awaiting triage'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.status === 'Mitigated' || incident.status === 'Resolved' ? 'bg-blue-50 border-blue-200' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.status === 'Mitigated' || incident.status === 'Resolved' ? 'text-blue-700' : 'text-[#64748B]'
              }`}>
                <span>3. MITIGATED</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033]">Initial mitigation steps executed</div>
              <div className="text-[10px] text-[#64748B] font-mono">
                {incident.resolution ? 'Applied' : 'Pending action'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.status === 'Resolved' ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F8FAFC] border-[#E2E8F0]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.status === 'Resolved' ? 'text-emerald-700' : 'text-[#64748B]'
              }`}>
                <span>4. RESOLVED</span>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033]">Root cause confirmed & retained in Hindsight</div>
              <div className="text-[10px] text-[#64748B] font-mono">
                {incident.resolved_at ? new Date(incident.resolved_at).toLocaleTimeString() : 'In Progress'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Symptoms & Logs */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#172033]">Observed Symptoms & Anomalies</h3>
            <div className="space-y-2">
              {incident.symptoms.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#172033] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-[#172033] pt-2">Captured Error Messages</h3>
            <div className="space-y-2">
              {incident.error_messages.map((e, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-red-50 border border-red-200 font-mono text-xs text-red-700">
                  {e}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#172033]">Sanitized Diagnostic Telemetry Log Stream</h3>
            {incident.logs_excerpt ? (
              <CodeBlock code={incident.logs_excerpt} language="log" />
            ) : (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
                No raw telemetry traces attached to this incident.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 3: Investigation Findings */}
      {activeTab === 'investigation' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033]">Hindsight AI Synthesis & Hypotheses</h3>
            <Button size="sm" variant="primary" onClick={() => onStartInvestigation(incident.id)}>
              Open Full AI Studio
            </Button>
          </div>

          {incident.investigation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-[#172033] leading-relaxed">
                <span className="font-bold text-[#4F46E5] block mb-1">Executive AI Summary:</span>
                {incident.investigation.summary}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-[#172033]">Ranked Hypotheses:</h4>
                {incident.investigation.hypotheses.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172033]">{h.cause}</span>
                      <Badge variant={h.status === 'Confirmed' ? 'success' : 'high'}>{h.status}</Badge>
                    </div>
                    <ul className="list-disc list-inside text-xs text-[#64748B] space-y-1">
                      {h.evidence_supporting.map((ev, ei) => (
                        <li key={ei}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] text-xs space-y-3">
              <p>No automated investigation results generated yet.</p>
              <Button size="sm" variant="primary" onClick={() => onStartInvestigation(incident.id)}>
                Run Hindsight Investigation Now
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Postmortem Resolution */}
      {activeTab === 'resolution' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033]">Confirmed Root Cause & Resolution Record</h3>
            {incident.status !== 'Resolved' && (
              <Button size="sm" variant="primary" onClick={() => onNavigateToResolve(incident.id)}>
                Edit & Resolve
              </Button>
            )}
          </div>

          {incident.resolution ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 text-sm">Verified Root Cause:</span>
                  <HindsightBadge label="Retained in Hindsight" />
                </div>
                <p className="text-emerald-950 font-medium leading-relaxed">
                  {incident.resolution.verified_root_cause}
                </p>
                <div className="text-[11px] text-emerald-700">
                  Verified by: <span className="font-semibold">{incident.resolution.verified_by_user}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                  <span className="font-semibold text-[#172033]">Mitigation Applied:</span>
                  <p className="text-[#64748B]">{incident.resolution.mitigation_applied}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                  <span className="font-semibold text-[#172033]">Permanent Architectural Fix:</span>
                  <p className="text-[#64748B]">{incident.resolution.permanent_fix}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] text-xs space-y-3">
              <p>This incident is still open and has not yet been resolved or retained.</p>
              <Button size="sm" variant="primary" onClick={() => onNavigateToResolve(incident.id)}>
                Verify & Submit Postmortem
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
