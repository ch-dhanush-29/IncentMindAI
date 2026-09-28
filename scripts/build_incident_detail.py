detail_code = """import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  FileCheck2, 
  Share2, 
  Activity,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';

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
    return <div className="p-8 text-gray-400 font-mono text-xs">Loading incident dossier {incidentId}...</div>;
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-gray-400">
        Incident not found. <button onClick={onBack} className="text-accent-cyan underline">Return to Feed</button>
      </div>
    );
  }

  const getSeverityVariant = (sev: string): any => {
    switch (sev) {
      case 'Critical': return 'critical';
      case 'High': return 'high';
      case 'Medium': return 'medium';
      default: return 'low';
    }
  };

  const getStatusVariant = (st: string): any => {
    switch (st) {
      case 'Resolved': return 'success';
      case 'Investigating': return 'info';
      case 'Mitigated': return 'purple';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back and Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents Feed
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartInvestigation(incident.id)}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-accent-cyan mr-1.5" /> Open in AI Investigation Studio
          </Button>

          {incident.status !== 'Resolved' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onNavigateToResolve(incident.id)}
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" /> Verify & Resolve Postmortem
            </Button>
          )}
        </div>
      </div>

      {/* Incident Header Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="font-bold text-accent-cyan text-sm">{incident.id}</span>
              <Badge variant={getSeverityVariant(incident.severity)}>{incident.severity}</Badge>
              <Badge variant={getStatusVariant(incident.status)}>{incident.status}</Badge>
              <span className="text-gray-400">[{incident.service}]</span>
              <span className="text-gray-500">• {incident.environment}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{incident.title}</h1>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">{incident.description}</p>
          </div>

          {/* Quick Meta Badge */}
          <div className="p-3.5 rounded-lg bg-background border border-border/80 text-xs font-mono text-gray-400 space-y-1.5 self-start min-w-[200px]">
            <div>Created: <span className="text-gray-200">{new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div>Updated: <span className="text-gray-200">{new Date(incident.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            <div>Hindsight Memory: <span className={incident.resolution?.retained_in_hindsight ? 'text-purple-400 font-semibold' : 'text-gray-500'}>
              {incident.resolution?.retained_in_hindsight ? 'RETAINED' : 'PENDING POSTMORTEM'}
            </span></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-t border-border pt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'timeline' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Incident Timeline & Events
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'symptoms' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Symptoms & Error Logs ({incident.symptoms.length})
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'investigation' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            AI Investigation Dossier {incident.investigation ? '✓' : ''}
          </button>
          <button
            onClick={() => setActiveTab('resolution')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'resolution' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Postmortem & Verified Fix
          </button>
        </div>
      </Card>

      {/* Tab Panels */}
      {activeTab === 'timeline' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-cyan" /> Chronological Event Timeline
          </h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border text-xs">
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-400 ring-4 ring-card" />
              <div className="font-mono text-gray-500 text-[11px]">{new Date(incident.created_at).toLocaleString()}</div>
              <div className="font-bold text-white">Incident Declared (P1 Alert Triggered)</div>
              <p className="text-gray-400">Automated monitor detected threshold breach on service {incident.service}.</p>
            </div>

            {incident.investigation && (
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-accent-cyan ring-4 ring-card" />
                <div className="font-mono text-gray-500 text-[11px]">{new Date(incident.investigation.created_at).toLocaleString()}</div>
                <div className="font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-accent-cyan" />
                  AI Investigation Completed via Hindsight
                </div>
                <p className="text-gray-400">{incident.investigation.summary}</p>
              </div>
            )}

            {incident.resolution && (
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-card" />
                <div className="font-mono text-gray-500 text-[11px]">{new Date(incident.resolution.resolved_at).toLocaleString()}</div>
                <div className="font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Incident Resolved & Retained to Hindsight
                </div>
                <p className="text-gray-300 font-mono text-[11px]">{incident.resolution.verified_root_cause}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Observed Symptoms & Error Signatures</h3>
            <div className="space-y-2">
              {incident.symptoms.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-background border border-border text-xs font-mono text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {s}
                </div>
              ))}
            </div>

            {incident.error_messages.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-gray-400">Captured Error Messages:</div>
                {incident.error_messages.map((err, i) => (
                  <div key={i} className="p-2.5 rounded bg-black/60 border border-border font-mono text-[11px] text-red-400">
                    {err}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Sanitized Telemetry Log Stream</h3>
            {incident.logs_excerpt ? (
              <pre className="p-3.5 rounded bg-black/80 border border-border text-[11px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-96">
                {incident.logs_excerpt}
              </pre>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 font-mono">No raw logs attached.</div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'investigation' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" /> Latest Agent Investigation
            </h3>
            <Button size="sm" variant="outline" onClick={() => onStartInvestigation(incident.id)}>
              Open Full Studio
            </Button>
          </div>

          {incident.investigation ? (
            <div className="space-y-4 text-xs font-sans">
              <p className="text-gray-300 leading-relaxed">{incident.investigation.summary}</p>
              
              <div className="p-3.5 rounded-lg bg-background border border-border space-y-2">
                <div className="font-semibold text-gray-200">Grounded Hypotheses:</div>
                {incident.investigation.hypotheses.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-gray-300 font-mono text-[11px]">
                    <span>• {h.cause}</span>
                    <Badge variant={h.status === 'Confirmed' ? 'success' : 'high'}>{h.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-gray-400">No investigation record stored on this incident yet.</p>
              <Button size="sm" onClick={() => onStartInvestigation(incident.id)}>
                <BrainCircuit className="w-4 h-4 mr-1.5" /> Run Hindsight Investigation Now
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'resolution' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" /> Verified Resolution Record
          </h3>

          {incident.resolution ? (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-gray-500 block mb-1">Human-Verified Root Cause:</span>
                  <span className="text-emerald-300 font-bold">{incident.resolution.verified_root_cause}</span>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <span className="text-gray-500 block mb-1">Permanent Fix Applied:</span>
                  <span className="text-gray-200">{incident.resolution.permanent_fix}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 text-[11px] font-mono text-purple-300">
                ✓ Stored in Hindsight Memory Bank. Provenance linked to {incident.id}.
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-gray-400">Incident is still active or waiting for human resolution confirmation.</p>
              <Button size="sm" variant="success" onClick={() => onNavigateToResolve(incident.id)}>
                Verify & Retain Resolution
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
"""

with open(r"d:\IncidentMind AI\frontend\src\pages\IncidentDetail.tsx", "w", encoding="utf-8") as f:
    f.write(detail_code)
print("Created IncidentDetail.tsx successfully")
