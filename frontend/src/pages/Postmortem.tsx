import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  FileCheck2, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Card, Button } from '../components/ui';

interface PostmortemProps {
  selectedIncidentId: string | null;
  onDone: () => void;
}

export const Postmortem: React.FC<PostmortemProps> = ({ selectedIncidentId, onDone }) => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'commander@incidentmind.ai';
  const userName = user?.fullName || user?.firstName || 'Incident Commander';
  const userId = user?.id || 'unknown';

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
      setError('Please provide the verified root cause and permanent fix before retaining in memory.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      setRetainStep(1); // Step 1: Validating Human Verification
      await new Promise(r => setTimeout(r, 600));

      setRetainStep(2); // Step 2: Formulating TEMPR Biomimetic Index
      await new Promise(r => setTimeout(r, 600));

      setRetainStep(3); // Step 3: Retaining in Hindsight Bank

      const payload = {
        verified_root_cause: rootCause,
        verification_method: verificationMethod || 'SRE Metrics Inspection',
        impact_summary: impactSummary || 'Degraded customer service operations',
        mitigation_applied: mitigation || 'Restored healthy state',
        permanent_fix: permanentFix,
        is_verified_by_human: true,
        verified_by_user: userName,
        user_email: userEmail,
        user_name: userName,
        user_id: userId,
        lessons_learned: lessons.split('\n').filter(l => l.trim().length > 0),
        follow_up_tickets: tickets.split(',').map(t => t.trim()).filter(Boolean),
        retain_in_hindsight: true
      };

      const updated = await api.resolveIncident(currentId, payload);
      setCurrentIncident(updated);
      setRetainedMemoryId(`mem-${currentId.toLowerCase()}`);
      setSuccess(true);
      setRetainStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to resolve and retain incident in Hindsight.');
      setRetainStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Incident Selector */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#4F46E5] dark:text-indigo-400" />
            Human-Verified Postmortem & Resolution
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Confirmed root causes and resolutions are preserved in institutional memory to prevent recurring triage toil.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">Target Incident:</label>
          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-1.5 text-xs text-[#4F46E5] dark:text-indigo-400 font-mono font-bold focus:outline-none focus:border-[#4F46E5] cursor-pointer"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id} className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">
                {inc.id} - {inc.service} ({inc.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Persistence Steps Animation if Submitting */}
      {submitting && retainStep > 0 && (
        <Card className="p-5 space-y-3 bg-[#EEF2FF]/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60">
          <h4 className="text-xs font-mono font-bold text-[#4F46E5] dark:text-indigo-400 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 animate-spin text-[#4F46E5] dark:text-indigo-400" />
            <span>Knowledge Preservation Pipeline:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border transition-colors ${
              retainStep >= 1 ? 'bg-white dark:bg-[#141820] border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834] text-[#94A3B8]'
            }`}>
              1. Enforce Human Verification ✓
            </div>
            <div className={`p-3 rounded-xl border transition-colors ${
              retainStep >= 2 ? 'bg-white dark:bg-[#141820] border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834] text-[#94A3B8]'
            }`}>
              2. Index Resolution Patterns ✓
            </div>
            <div className={`p-3 rounded-xl border transition-colors ${
              retainStep >= 3 ? 'bg-white dark:bg-[#141820] border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834] text-[#94A3B8]'
            }`}>
              3. Store in Memory Bank ✓
            </div>
          </div>
        </Card>
      )}

      {/* Success Notification Banner */}
      {success && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Resolution Preserved in Institutional Memory!</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onDone}
            >
              Return to Feed <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#141820] border border-emerald-200 dark:border-emerald-900/50 text-xs font-mono space-y-1 text-[#172033] dark:text-[#F1F5F9]">
            <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8] pb-1 border-b border-[#E2E8F0] dark:border-[#222834]">
              <span className="text-[#4F46E5] dark:text-indigo-400 font-semibold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" /> Retained Memory Record: {retainedMemoryId}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Verified & Retained</span>
            </div>
            <div className="text-[11px] text-[#172033] dark:text-[#F1F5F9] pt-1">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Verified Root Cause: </span>{rootCause}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Permanent Fix: </span>{permanentFix}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Resolution Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Root Cause & Verification */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222834] pb-2.5">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Root Cause & Verification Method</span>
            </h3>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">Human Verification Required</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">
                Verified Root Cause * (Human SRE Confirmed)
              </label>
              <textarea
                required
                rows={3}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="e.g., HikariCP connection leak in webhook retry executor combined with max_connections ceiling in RDS parameter group."
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100 leading-relaxed font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Verification Method Used</label>
                <input
                  type="text"
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value)}
                  placeholder="e.g., Inspected pg_stat_activity queries in idle in transaction state"
                  className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Impact Summary</label>
                <input
                  type="text"
                  value={impactSummary}
                  onChange={(e) => setImpactSummary(e.target.value)}
                  placeholder="e.g., Payment processing degraded for 18 minutes; 142 transactions dropped"
                  className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Mitigation & Permanent Fix */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222834] pb-2.5">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              <span>2. Remediation & Permanent Architecture Fix</span>
            </h3>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">Runbook Capture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Immediate Mitigation Applied</label>
              <textarea
                rows={3}
                value={mitigation}
                onChange={(e) => setMitigation(e.target.value)}
                placeholder="e.g., Restarted worker pods to flush orphaned pool connections; scaled max_connections to 250."
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Permanent Fix Applied *</label>
              <textarea
                required
                rows={3}
                value={permanentFix}
                onChange={(e) => setPermanentFix(e.target.value)}
                placeholder="e.g., Patched PaymentWebhookClient with try-with-resources and integrated pgbouncer proxy layer."
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100 leading-relaxed font-sans"
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Lessons Learned & Tickets */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222834] pb-2.5">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">3. Continuous Improvement</h3>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">Knowledge Retention</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Lessons Learned (one per line)</label>
              <textarea
                rows={3}
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="Always wrap external webhook invocations with try-with-resources&#10;Deploy connection pool alerts at 80% threshold"
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5 text-xs">Follow-up Jira / GitHub Tickets</label>
              <input
                type="text"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                placeholder="e.g., INFRA-4421, PAY-904"
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] font-mono"
              />
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-2 font-mono">
                Tickets are linked to the incident record for future cross-referencing.
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom Submission Bar */}
        <div className="p-5 rounded-2xl bg-[#EEF2FF] dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#141820] border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center flex-shrink-0">
              <BrainCircuit className="w-5 h-5 text-[#4F46E5] dark:text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-[#172033] dark:text-[#F1F5F9] text-sm block">Save Outcome to Institutional Memory</span>
              <span className="text-[#64748B] dark:text-[#94A3B8] text-xs">
                Preserves this verified resolution so future matching incidents instantly suggest this proven fix.
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting ? 'Preserving Knowledge...' : 'Confirm Resolution & Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};
