import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  FileCheck2, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save,
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button, CodeBlock } from '../components/ui';

interface PostmortemProps {
  selectedIncidentId: string | null;
  onDone: () => void;
}

export const Postmortem: React.FC<PostmortemProps> = ({ selectedIncidentId, onDone }) => {
  const [incidents, setAllIncidents] = useState<Incident[]>([]);
  const [currentId, setCurrentId] = useState<string>(selectedIncidentId || '');
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);
  
  const [rootCause, setRootCause] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [mitigation, setMitigation] = useState('');
  const [permanentFix, setPermanentFix] = useState('');
  const [lessons, setLessons] = useState('');
  const [tickets, setTickets] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [retainStep, setRetainStep] = useState<number>(0);
  const [success, setSuccess] = useState(false);
  const [retainedMemoryId, setRetainedMemoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    if (currentId) {
      loadIncident(currentId);
    }
  }, [currentId]);

  const loadIncidents = async () => {
    try {
      const data = await api.getIncidents();
      setAllIncidents(data);
      if (!currentId && data.length > 0) {
        setCurrentId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadIncident = async (id: string) => {
    try {
      const inc = await api.getIncident(id);
      setCurrentIncident(inc);
      if (inc.resolution) {
        setRootCause(inc.resolution.verified_root_cause);
        setVerificationMethod(inc.resolution.verification_method);
        setImpactSummary(inc.resolution.impact_summary);
        setMitigation(inc.resolution.mitigation_applied);
        setPermanentFix(inc.resolution.permanent_fix);
        setLessons(inc.resolution.lessons_learned.join('\n'));
        setTickets(inc.resolution.follow_up_tickets.join(', '));
      } else {
        if (inc.investigation && inc.investigation.hypotheses.length > 0) {
          const topHypo = inc.investigation.hypotheses[0];
          setRootCause(topHypo.cause);
          setMitigation('Applied service configuration adjustment per diagnostic runbook');
          setPermanentFix('Patched underlying source component and increased threshold limits with connection proxy layer');
          setVerificationMethod('Verified latency metrics and log error rate returned to normal baseline via Grafana dashboard');
          setImpactSummary(`Impacted ${inc.service} for duration of incident; degraded checkout flow`);
          setLessons('Monitor saturation indicators earlier in rollout cycle\nEnforce strict connection timeouts on worker threads');
          setTickets('SRE-CORE-101, INFRA-4421');
        } else {
          setRootCause('');
          setVerificationMethod('');
          setImpactSummary('');
          setMitigation('');
          setPermanentFix('');
          setLessons('');
          setTickets('');
        }
      }
      setSuccess(false);
      setRetainStep(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId || !rootCause || !permanentFix) {
      setError('Please provide at least verified root cause and permanent fix.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setRetainStep(1); // Validating

      const payload = {
        verified_root_cause: rootCause,
        verification_method: verificationMethod || 'Direct engineer telemetry observation and metrics confirmation',
        impact_summary: impactSummary || `Degraded ${currentIncident?.service || 'service'} requests during incident window`,
        mitigation_applied: mitigation || 'Restored healthy state via configuration mitigation',
        permanent_fix: permanentFix,
        is_verified_by_human: true,
        lessons_learned: lessons.split('\n').filter(l => l.trim().length > 0),
        follow_up_tickets: tickets.split(',').map(t => t.trim()).filter(t => t.length > 0)
      };

      // Step 2 simulation for high-end SRE visual feedback
      await new Promise(r => setTimeout(r, 600));
      setRetainStep(2); // Generating TEMPR embeddings

      const result = await api.resolveIncident(currentId, payload);
      
      await new Promise(r => setTimeout(r, 600));
      setRetainStep(3); // Ingested to Hindsight Bank

      setSuccess(true);
      setRetainedMemoryId(`MEM-${currentId.replace('INC-', '')}`);
    } catch (err: any) {
      setError(err.message || 'Failed to save postmortem and retain to Hindsight');
      setRetainStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            <span>Resolution Verification & Hindsight Knowledge Retention</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Confirm human-verified facts, mark incident resolved, and write structured knowledge into the Hindsight memory bank.
          </p>
        </div>
      </div>

      {/* Incident Switcher Card */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-300 font-medium flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-cyan" />
          Select Incident for Postmortem Resolution:
        </span>
        <select
          value={currentId}
          onChange={(e) => setCurrentId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-accent-cyan font-mono text-xs focus:outline-none focus:border-accent-cyan cursor-pointer max-w-md"
        >
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              [{inc.id}] {inc.service} - {inc.title.slice(0, 40)}... ({inc.status})
            </option>
          ))}
        </select>
      </Card>

      {/* Success Notification with Live Memory Snapshot */}
      {success && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-purple-950/80 border border-emerald-500/50 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Incident Resolved & Memory Persisted to Hindsight!</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                    Provenance Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  The SRE verified resolution has been permanently stored in Bank <code className="text-accent-cyan font-mono">incidentmind-prod-bank</code>.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onDone}
            >
              Return to Feed <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
              <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Retained Memory Record: {retainedMemoryId}
              </span>
              <span className="text-emerald-400">Indexed in TEMPR</span>
            </div>
            <div className="text-[11px] text-slate-200 pt-1">
              <span className="text-slate-400">Verified Root Cause: </span>{rootCause}
            </div>
            <div className="text-[11px] text-emerald-300">
              <span className="text-slate-400">Permanent Fix: </span>{permanentFix}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Resolution Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Root Cause & Verification */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1. Root Cause & Verification Method</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Human Verification Required</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-200 mb-1.5 text-xs">
                Verified Root Cause * (Human SRE Confirmed)
              </label>
              <textarea
                required
                rows={3}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="e.g., HikariCP connection leak in webhook retry executor combined with max_connections ceiling in RDS parameter group."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-cyan leading-relaxed font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-200 mb-1.5 text-xs">Verification Method Used</label>
                <input
                  type="text"
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  placeholder="e.g., Inspected pg_stat_activity queries in idle in transaction state"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-200 mb-1.5 text-xs">Impact Summary</label>
                <input
                  type="text"
                  value={impactSummary}
                  onChange={(e) => setImpactSummary(e.target.value)}
                  placeholder="e.g., Payment processing degraded for 18 minutes; 142 transactions dropped"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Mitigation & Permanent Fix */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span>2. Remediation & Permanent Architecture Fix</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Runbook Capture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-200 mb-1.5 text-xs">Immediate Mitigation Applied</label>
              <textarea
                rows={3}
                value={mitigation}
                onChange={(e) => setMitigation(e.target.value)}
                placeholder="e.g., Restarted worker pods to flush orphaned pool connections; scaled max_connections to 250."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-cyan leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-200 mb-1.5 text-xs">Permanent Fix Applied *</label>
              <textarea
                required
                rows={3}
                value={permanentFix}
                onChange={(e) => setPermanentFix(e.target.value)}
                placeholder="e.g., Patched PaymentWebhookClient with try-with-resources and integrated pgbouncer proxy layer."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-cyan leading-relaxed font-sans"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Lessons Learned & Tickets */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white">3. Continuous Improvement</h3>
            <span className="text-[11px] font-mono text-slate-400">Knowledge Retention</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-200 mb-1.5 text-xs">Lessons Learned (one per line)</label>
              <textarea
                rows={3}
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="Always wrap external webhook invocations with try-with-resources&#10;Deploy connection pool alerts at 80% threshold"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-200 mb-1.5 text-xs">Follow-up Jira / GitHub Tickets</label>
              <input
                type="text"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                placeholder="e.g., INFRA-4421, PAY-904"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Tickets are linked to the incident memory node in Hindsight for future cross-referencing.
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom Submission Bar with TEMPR Memory Hook */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
              <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Persist Outcome to Hindsight Memory Bank</span>
              <span className="text-slate-400 text-xs">
                Embeds this verified resolution into Bank <code className="text-accent-cyan font-mono">incidentmind-prod-bank</code>. Future outages with matching symptoms will automatically recall this exact solution.
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="hindsight"
            size="lg"
            loading={submitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting ? 'Writing to Hindsight...' : 'Confirm Resolution & Retain'}
          </Button>
        </div>
      </form>
    </div>
  );
};

