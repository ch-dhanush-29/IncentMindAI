import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Flame
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <span>Loading incident war room dossier {incidentId}...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-400">
        Incident not found. <button onClick={onBack} className="text-accent-cyan underline cursor-pointer">Return to Feed</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back and Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents Feed
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartInvestigation(incident.id)}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-accent-cyan mr-1.5 animate-pulse" />
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
              <span className="font-bold text-accent-cyan text-sm px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-slate-400 flex items-center gap-1">
                <Server className="w-3 h-3 text-slate-500" />
                [{incident.service}]
              </span>
              <span className="text-slate-400">• env: {incident.environment}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              {incident.title}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
              {incident.description}
            </p>
          </div>

          {/* Quick Meta Badge */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 space-y-2 self-start min-w-[220px] shadow-sm">
            <div className="flex items-center justify-between">
              <span>Declared:</span>
              <span className="text-slate-200">{new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service:</span>
              <span className="text-white font-semibold">{incident.service}</span>
            </div>
            <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>Hindsight:</span>
              <span className={incident.resolution?.retained_in_hindsight ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                {incident.resolution?.retained_in_hindsight ? 'RETAINED' : 'PENDING POSTMORTEM'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-t border-slate-800 pt-3 text-xs font-medium">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2 border-b-2 font-semibold transition-colors cursor-pointer ${
              activeTab === 'timeline' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Incident Timeline & Events
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`pb-2 border-b-2 font-semibold transition-colors cursor-pointer ${
              activeTab === 'symptoms' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Symptoms & Error Logs ({incident.symptoms.length})
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`pb-2 border-b-2 font-semibold transition-colors cursor-pointer ${
              activeTab === 'investigation' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            AI Investigation Dossier {incident.investigation ? '✓' : ''}
          </button>
          <button
            onClick={() => setActiveTab('resolution')}
            className={`pb-2 border-b-2 font-semibold transition-colors cursor-pointer ${
              activeTab === 'resolution' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Postmortem & Verified Fix
          </button>
        </div>
      </Card>

      {/* Tab Panels */}
      {activeTab === 'timeline' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-cyan" />
            <span>Chronological Incident Lifecycle</span>
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 text-xs">
            <div className="relative space-y-1">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-[#0F172A]" />
              <div className="font-mono text-slate-400 text-[11px]">{new Date(incident.created_at).toLocaleString()}</div>
              <div className="font-bold text-white text-xs">Incident Declared (Telemetry Alert Triggered)</div>
              <p className="text-slate-300">Automated monitor detected threshold breach on service <code className="text-accent-cyan font-mono">{incident.service}</code>.</p>
            </div>

            {incident.investigation && (
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-accent-cyan ring-4 ring-[#0F172A]" />
                <div className="font-mono text-slate-400 text-[11px]">{new Date(incident.investigation.created_at).toLocaleString()}</div>
                <div className="font-bold text-white flex items-center gap-2 text-xs">
                  <BrainCircuit className="w-3.5 h-3.5 text-accent-cyan" />
                  Hindsight Investigation Completed & Grounded in Memory
                </div>
                <p className="text-slate-300">{incident.investigation.summary}</p>
              </div>
            )}

            {incident.resolution && (
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-[#0F172A]" />
                <div className="font-mono text-slate-400 text-[11px]">{new Date(incident.resolution.resolved_at).toLocaleString()}</div>
                <div className="font-bold text-emerald-400 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Incident Resolved & Retained to Hindsight Bank
                </div>
                <p className="text-slate-300 font-mono text-[11px]">{incident.resolution.verified_root_cause}</p>
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
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {incident.error_messages.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Captured Error Traces:</div>
                {incident.error_messages.map((err, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 font-mono text-[11px] text-rose-300">
                    {err}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Sanitized Telemetry Log Stream</h3>
            {incident.logs_excerpt ? (
              <CodeBlock code={incident.logs_excerpt} language="sanitized-logs" />
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">No raw logs attached.</div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'investigation' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span>Latest Agent Investigation</span>
            </h3>
            <Button size="sm" variant="outline" onClick={() => onStartInvestigation(incident.id)}>
              Open Full Studio
            </Button>
          </div>

          {incident.investigation ? (
            <div className="space-y-4 text-xs font-sans">
              <p className="text-slate-200 leading-relaxed font-medium">{incident.investigation.summary}</p>
              
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="font-semibold text-white">Grounded Hypotheses:</div>
                {incident.investigation.hypotheses.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300 font-mono text-[11px] p-2 rounded bg-black/30 border border-slate-800/60">
                    <span>• {h.cause}</span>
                    <Badge variant={h.status === 'Confirmed' ? 'success' : 'high'}>{h.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-400">No investigation record stored on this incident yet.</p>
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
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Resolution Record</span>
          </h3>

          {incident.resolution ? (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Human-Verified Root Cause:</span>
                  <span className="text-emerald-300 font-bold leading-snug">{incident.resolution.verified_root_cause}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Permanent Fix Applied:</span>
                  <span className="text-slate-200 leading-snug">{incident.resolution.permanent_fix}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] font-mono text-purple-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Stored in Hindsight Memory Bank. Provenance permanently linked to {incident.id}.</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-400">Incident is still active or waiting for human resolution confirmation.</p>
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

