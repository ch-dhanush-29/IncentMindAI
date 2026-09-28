import os

postmortem_code = """import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Incident } from '../types/incident';
import { 
  FileCheck2, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save
} from 'lucide-react';

interface PostmortemProps {
  selectedIncidentId: string | null;
  onDone: () => void;
}

export const Postmortem: React.FC<PostmortemProps> = ({ selectedIncidentId, onDone }) => {
  const [incidents, setAllIncidents] = useState<Incident[]>([]);
  const [currentId, setCurrentId] = useState<string>(selectedIncidentId || '');
  const [incident, setIncident] = useState<Incident | null>(null);
  
  const [rootCause, setRootCause] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [mitigation, setMitigation] = useState('');
  const [permanentFix, setPermanentFix] = useState('');
  const [lessons, setLessons] = useState('');
  const [tickets, setTickets] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setIncident(inc);
      if (inc.resolution) {
        setRootCause(inc.resolution.verified_root_cause);
        setVerificationMethod(inc.resolution.verification_method);
        setImpactSummary(inc.resolution.impact_summary);
        setMitigation(inc.resolution.mitigation_applied);
        setPermanentFix(inc.resolution.permanent_fix);
        setLessons(inc.resolution.lessons_learned.join('\\n'));
        setTickets(inc.resolution.follow_up_tickets.join(', '));
      } else {
        if (inc.investigation && inc.investigation.hypotheses.length > 0) {
          const topHypo = inc.investigation.hypotheses[0];
          setRootCause(topHypo.cause);
          setMitigation('Applied service configuration adjustment per diagnostic runbook');
          setPermanentFix('Patched underlying source component and increased threshold limits');
          setVerificationMethod('Verified latency metrics and log error rate returned to normal baseline');
          setImpactSummary(`Impacted ${inc.service} for duration of incident`);
          setLessons('Monitor saturation indicators earlier in rollout cycle');
          setTickets('SRE-CORE-101');
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
      const payload = {
        verified_root_cause: rootCause,
        verification_method: verificationMethod || 'Direct engineer observation and telemetry confirmation',
        impact_summary: impactSummary || 'Degraded customer requests during incident window',
        mitigation_applied: mitigation || 'Restored healthy state via configuration mitigation',
        permanent_fix: permanentFix,
        is_verified_by_human: true,
        lessons_learned: lessons.split('\\n').filter(l => l.trim().length > 0),
        follow_up_tickets: tickets.split(',').map(t => t.trim()).filter(t => t.length > 0)
      };

      await api.resolveIncident(currentId, payload);
      setSuccess(true);
      setTimeout(() => {
        onDone();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save postmortem and retain to Hindsight');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            Resolution Verification & Hindsight Knowledge Retention
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Confirm human-verified facts, close the incident, and persist structured findings to Hindsight agent memory.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
        <span className="text-gray-400 font-medium">Select Incident to Resolve & Retain:</span>
        <select
          value={currentId}
          onChange={(e) => setCurrentId(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-accent-cyan font-mono focus:outline-none focus:border-accent-cyan"
        >
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              [{inc.id}] {inc.service} - {inc.title.slice(0, 45)}... ({inc.status})
            </option>
          ))}
        </select>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-bold block">Incident Resolved & Retained in Hindsight!</span>
            <span>Memory record persisted with provenance. Future investigations will recall this verified resolution.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-card border border-border space-y-4 text-xs">
        <div>
          <label className="block font-medium text-gray-200 mb-1">
            Verified Root Cause * (Human Confirmed)
          </label>
          <textarea
            required
            rows={2}
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="e.g., HikariCP connection leak in webhook retry executor combined with max_connections ceiling in RDS parameter group."
            className="w-full bg-background border border-border rounded-lg p-3 text-white focus:outline-none focus:border-accent-cyan"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-200 mb-1">Verification Method</label>
            <input
              type="text"
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              placeholder="e.g., Inspected pg_stat_activity queries in idle in transaction state"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-200 mb-1">Impact Summary</label>
            <input
              type="text"
              value={impactSummary}
              onChange={(e) => setImpactSummary(e.target.value)}
              placeholder="e.g., Payment processing degraded for 18 minutes; 142 transactions dropped"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-200 mb-1">Immediate Mitigation Applied</label>
            <textarea
              rows={2}
              value={mitigation}
              onChange={(e) => setMitigation(e.target.value)}
              placeholder="e.g., Restarted worker pods to flush orphaned pool connections; scaled max_connections to 250."
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-200 mb-1">Permanent Fix Applied *</label>
            <textarea
              required
              rows={2}
              value={permanentFix}
              onChange={(e) => setPermanentFix(e.target.value)}
              placeholder="e.g., Patched PaymentWebhookClient with try-with-resources and integrated pgbouncer proxy layer."
              className="w-full bg-background border border-border rounded-lg p-3 text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-200 mb-1">Lessons Learned (one per line)</label>
          <textarea
            rows={3}
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
            placeholder="Always monitor connection pool exhaustion alerts&#10;Deploy connection proxy on read/write replicas"
            className="w-full bg-background border border-border rounded-lg p-3 text-white focus:outline-none focus:border-accent-cyan font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-200 mb-1">Follow-up Jira / GitHub Tickets</label>
          <input
            type="text"
            value={tickets}
            onChange={(e) => setTickets(e.target.value)}
            placeholder="e.g., INFRA-4421, PAY-904"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
          />
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <div>
              <span className="font-bold text-white block">Hindsight Memory Retention Hook</span>
              <span className="text-gray-400 text-[11px]">
                This verified outcome will be ingested into Hindsight bank for automatic future recall.
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> {submitting ? 'Retaining...' : 'Confirm & Retain Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};
"""

with open(r"d:\IncidentMind AI\frontend\src\pages\Postmortem.tsx", "w", encoding="utf-8") as f:
    f.write(postmortem_code)

print("Postmortem.tsx written successfully via write_postmortem.py")
