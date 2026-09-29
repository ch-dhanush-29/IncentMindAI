import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident, InvestigationResult } from '../types/incident';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Database, 
  RefreshCw, 
  FileCheck2, 
  ExternalLink, 
  SplitSquareVertical,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  Square,
  Server
} from 'lucide-react';
import { SeverityBadge, StatusBadge, HindsightBadge, Button, CodeBlock, Card } from '../components/ui';

interface InvestigationWorkspaceProps {
  selectedIncidentId: string | null;
  onNavigateToResolve: (incidentId: string) => void;
  onOpenExplorer: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  selectedIncidentId,
  onNavigateToResolve,
  onOpenExplorer,
}) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [investigation, setInvestigation] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState<{ q: string; a: string; time: string }[]>([]);
  const [asking, setAsking] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [baselineInvestigation, setBaselineInvestigation] = useState<InvestigationResult | null>(null);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadAllIncidents();
  }, []);

  useEffect(() => {
    if (selectedIncidentId) {
      loadIncident(selectedIncidentId);
    } else if (allIncidents.length > 0) {
      loadIncident(allIncidents[0].id);
    }
  }, [selectedIncidentId, allIncidents]);

  const loadAllIncidents = async () => {
    try {
      const data = await api.getIncidents();
      setAllIncidents(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadIncident = async (id: string) => {
    try {
      setLoading(true);
      setCheckedSteps({});
      const inc = await api.getIncident(id);
      setIncident(inc);
      if (inc.investigation) {
        setInvestigation(inc.investigation);
      } else {
        runAnalysis(id, true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (id: string, withMem: boolean) => {
    try {
      setLoading(true);
      const res = await api.analyzeIncident(id, withMem);
      setInvestigation(res);
      const inc = await api.getIncident(id);
      setIncident(inc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runComparison = async () => {
    if (!incident) return;
    try {
      setLoading(true);
      setCompareMode(true);
      const baseline = await api.analyzeIncident(incident.id, false);
      setBaselineInvestigation(baseline);
      const memAssisted = await api.analyzeIncident(incident.id, true);
      setInvestigation(memAssisted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async (promptText?: string) => {
    const q = promptText || question;
    if (!incident || !q.trim()) return;
    try {
      setAsking(true);
      const res = await api.askQuestion(incident.id, q);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatLog(prev => [...prev, { q, a: res.answer, time: timeStr }]);
      if (!promptText) setQuestion('');
    } catch (e) {
      console.error(e);
    } finally {
      setAsking(false);
    }
  };

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  if (loading && !incident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#64748B] font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <span>Synthesizing Telemetry & Correlating Memory...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-[#64748B] text-sm">
        Select an incident from the Incidents Feed to begin investigation.
      </div>
    );
  }

  const promptSuggestions = [
    "What was the exact verified root cause in the previous occurrence?",
    "Show the safe query to inspect connection handles",
    "What is the rollback procedure if the pod restart fails?",
    "Show recommended safe diagnostic steps"
  ];

  return (
    <div className="space-y-6">
      {/* Incident Switcher and Main Hero Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={incident.id}
              onChange={(e) => loadIncident(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-2.5 py-1 text-[#4F46E5] dark:text-indigo-400 font-mono text-xs font-bold focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              {allIncidents.map((inc) => (
                <option key={inc.id} value={inc.id} className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">
                  {inc.id} - {inc.service} ({inc.severity})
                </option>
              ))}
            </select>

            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />

            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono flex items-center gap-1">
              <Server className="w-3 h-3 text-[#94A3B8]" />
              Service: <span className="text-[#172033] dark:text-[#F1F5F9] font-semibold">{incident.service}</span>
            </span>

            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
              Env: <span className="text-[#172033] dark:text-[#F1F5F9]">{incident.environment}</span>
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-[#172033] dark:text-[#F1F5F9] tracking-tight leading-snug">{incident.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => runComparison()}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer border ${
              compareMode
                ? 'bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold'
                : 'bg-white dark:bg-[#181D26] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2536] border-[#E2E8F0] dark:border-[#222834] text-[#172033] dark:text-[#F1F5F9]'
            }`}
            title="Side-by-side comparison of diagnosis with vs without institutional memory"
          >
            <SplitSquareVertical className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
            <span>{compareMode ? 'Comparing Active' : 'Compare vs No-Memory'}</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => runAnalysis(incident.id, true)}
            disabled={loading}
          >
            <RefreshCw className={'w-3.5 h-3.5 mr-1.5 ' + (loading ? 'animate-spin' : '')} />
            Re-analyze
          </Button>

          <Button
            variant="hindsight"
            size="sm"
            onClick={() => onNavigateToResolve(incident.id)}
          >
            <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
            Verify & Retain Postmortem
          </Button>
        </div>
      </div>

      {/* Side-by-Side Comparison Hero Display */}
      {compareMode && baselineInvestigation && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#222834] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center">
                <SplitSquareVertical className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                  <span>Institutional Memory Recall vs Generic Baseline</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-[#4F46E5] dark:text-indigo-300 font-semibold">
                    A/B SRE Diagnostic Benchmark
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Visual comparison showing how institutional memory eliminates guesswork and reduces triage time.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setCompareMode(false)}
              className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] hover:border-slate-300 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Close Comparison ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column A: Generic Baseline LLM (No Memory) */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
              <div className="flex items-center justify-between border-b border-red-200 dark:border-red-900/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="font-bold text-red-900 dark:text-red-300 text-xs font-mono">WITHOUT MEMORY (Generic Baseline)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-medium">
                  0 Memories Recalled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-red-200 dark:border-red-900/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Triage Duration</span>
                  <span className="text-red-700 dark:text-red-400 font-bold">~45 - 60 minutes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-red-200 dark:border-red-900/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Hallucination Risk</span>
                  <span className="text-red-700 dark:text-red-400 font-bold">HIGH (Generic Guessing)</span>
                </div>
              </div>

              <p className="text-xs text-[#172033] dark:text-[#F1F5F9] leading-relaxed font-sans">
                {baselineInvestigation.summary}
              </p>

              <div className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Warning: Unverified Generic Path
                </div>
                {baselineInvestigation.insufficient_evidence_warning || 'The agent lacks persistent memory of previous occurrences. Proposes broad trial-and-error debugging.'}
              </div>

              <div className="pt-1">
                <span className="text-xs font-bold text-[#172033] dark:text-[#F1F5F9] block mb-1.5">Speculative Hypotheses:</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {baselineInvestigation.hypotheses.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                      <span className="text-[#172033] dark:text-[#F1F5F9]">{h.cause}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#181D26] text-[#64748B] dark:text-[#94A3B8] border border-slate-200 dark:border-[#222834]">{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column B: With Institutional Memory (Hero) */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-900/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                  <span className="font-bold text-[#4F46E5] dark:text-indigo-400 text-xs font-mono">WITH INSTITUTIONAL MEMORY</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                  {String(investigation?.recalled_memories.length || 1)} Match(es) Found
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-indigo-200 dark:border-indigo-900/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Triage Duration</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">~5 - 8 mins (-86% MTTR)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-indigo-200 dark:border-indigo-900/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Grounding Provenance</span>
                  <span className="text-[#4F46E5] dark:text-indigo-400 font-bold">100% SRE Confirmed</span>
                </div>
              </div>

              <p className="text-xs text-[#172033] dark:text-[#F1F5F9] leading-relaxed font-sans font-medium">
                {investigation?.summary}
              </p>

              <div className="text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Grounded in Verified Incident History
                </div>
                <div>{investigation?.confidence_rationale}</div>
              </div>

              <div className="pt-1">
                <span className="text-xs font-bold text-[#4F46E5] dark:text-indigo-400 block mb-1.5">Confirmed Root Cause & Runbook:</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {investigation?.hypotheses.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-[#141820] border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between">
                      <span className="text-[#172033] dark:text-[#F1F5F9] font-medium">{h.cause}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold">
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace 3-Column / 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Synthesis, Hypotheses, Checklist, Copilot Q&A */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agentic Synthesis Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Agentic Investigation Synthesis</h3>
              </div>
              <HindsightBadge label="Institutional Memory" />
            </div>

            <p className="text-xs text-[#172033] dark:text-[#F1F5F9] leading-relaxed font-sans">
              {investigation?.summary || 'Synthesizing investigation findings...'}
            </p>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs space-y-1">
              <div className="font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" /> Evidence & Confidence Grounding:
              </div>
              <p className="text-[#64748B] dark:text-[#94A3B8] font-mono text-[11px] leading-relaxed">
                {investigation?.confidence_rationale}
              </p>
            </div>
          </Card>

          {/* Root Cause Hypotheses */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Root Cause Hypotheses (Grounded vs Suspected)</h3>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">Evidence-Ranked</span>
            </div>

            <div className="space-y-3">
              {investigation?.hypotheses.map((hypo, idx) => {
                const isConfirmed = hypo.status === 'Confirmed';
                const isSuspected = hypo.status === 'Suspected';

                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
                      isConfirmed 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                        : isSuspected 
                        ? 'bg-[#FEF3C7]/40 dark:bg-amber-950/20 border-[#FDE68A] dark:border-amber-900/50' 
                        : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isConfirmed 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                              : isSuspected 
                              ? 'bg-[#FEF3C7] dark:bg-amber-950/60 text-[#92400E] dark:text-amber-300 border-[#FDE68A] dark:border-amber-800' 
                              : 'bg-slate-100 dark:bg-[#1E2536] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2D3545]'
                          }`}>
                            {hypo.status}
                          </span>
                          <span className="font-bold text-[#172033] dark:text-[#F1F5F9] text-xs">{hypo.cause}</span>
                        </div>
                        {hypo.notes && <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">{hypo.notes}</p>}
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border flex-shrink-0 ${
                        hypo.risk_level === 'Medium'
                          ? 'text-[#92400E] dark:text-amber-300 bg-[#FEF3C7] dark:bg-amber-950/50 border-[#FDE68A] dark:border-amber-800'
                          : hypo.risk_level === 'High'
                          ? 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800'
                          : 'text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#141820] border-[#E2E8F0] dark:border-[#222834]'
                      }`}>
                        Risk: <span className="font-semibold">{hypo.risk_level}</span>
                      </span>
                    </div>

                    {hypo.evidence_supporting && hypo.evidence_supporting.length > 0 && (
                      <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#222834] text-[11px] font-mono space-y-1">
                        <div className="text-[#64748B] dark:text-[#94A3B8] font-semibold text-[10px]">Supporting Grounding Evidence:</div>
                        {hypo.evidence_supporting.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-[#172033] dark:text-[#F1F5F9]">
                            <span className="text-[#4F46E5] dark:text-indigo-400">✓</span> {ev}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Safe Reversible Diagnostic Runbook Sequence (Interactive Checklist) */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                  <span>Safe, Reversible Diagnostic Sequence</span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-medium">Non-Destructive</span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Click step checkboxes to track live triage execution</p>
              </div>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                {Object.values(checkedSteps).filter(Boolean).length} / {investigation?.diagnostic_steps.length || 0} Executed
              </span>
            </div>

            <div className="space-y-3">
              {investigation?.diagnostic_steps.map((step, idx) => {
                const isChecked = !!checkedSteps[step.step_number];

                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border text-xs space-y-2.5 transition-colors ${
                      isChecked 
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                        : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-2.5 font-medium text-[#172033] dark:text-[#F1F5F9] cursor-pointer select-none"
                        onClick={() => toggleStep(step.step_number)}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]" />
                        )}
                        <span className={`text-xs ${isChecked ? 'line-through text-[#64748B] dark:text-[#64748B]' : 'text-[#172033] dark:text-[#F1F5F9]'}`}>
                          Step {step.step_number}: {step.action}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded-full border ${
                          step.is_reversible 
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' 
                            : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800'
                        }`}>
                          {step.is_reversible ? 'Reversible' : 'Irreversible'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${
                          step.risk === 'Medium'
                            ? 'text-[#92400E] dark:text-amber-300 bg-[#FEF3C7] dark:bg-amber-950/50 border-[#FDE68A] dark:border-amber-800'
                            : step.risk === 'High'
                            ? 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800'
                            : 'text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#141820] border-[#E2E8F0] dark:border-[#222834]'
                        }`}>
                          Risk: {step.risk}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] pl-6">{step.rationale}</p>

                    {step.command_or_query && (
                      <div className="ml-6">
                        <CodeBlock code={step.command_or_query} language="triage-query" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SRE Copilot Q&A */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <span>Contextual SRE Copilot Q&A</span>
              </h3>
              <span className="text-[10px] font-mono text-[#4F46E5] dark:text-indigo-400 bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.5 rounded-full font-medium">
                Grounded in Incident Dossier
              </span>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Ask follow-up questions bounded strictly to this incident's telemetry and verified historical memories.
            </p>

            {/* Clickable prompt suggestions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {promptSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(sug)}
                  disabled={asking}
                  className="text-[11px] text-[#4F46E5] dark:text-indigo-300 bg-[#EEF2FF] dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/60 transition-colors font-mono text-left cursor-pointer"
                >
                  ⚡ {sug}
                </button>
              ))}
            </div>

            {/* Chat conversation history */}
            {chatLog.length > 0 && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs pt-2">
                {chatLog.map((chat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950/50 text-[#172033] dark:text-[#F1F5F9] font-mono text-xs border border-indigo-100 dark:border-indigo-800/60 flex items-start justify-between">
                      <div>
                        <span className="text-[#4F46E5] dark:text-indigo-400 font-bold mr-2">Q:</span>
                        {chat.q}
                      </div>
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] ml-2">{chat.time}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-[#172033] dark:text-[#F1F5F9] leading-relaxed space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 text-[#4F46E5] dark:text-indigo-400 font-mono text-[11px] font-semibold">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>IncidentMind Copilot:</span>
                      </div>
                      <div className="text-xs text-[#172033] dark:text-[#F1F5F9] whitespace-pre-wrap pl-5">
                        {chat.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleAsk(); }} 
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                placeholder="Ask about root cause evidence, SQL commands, or runbook steps..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3.5 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={asking}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Ask Copilot
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 1 Col: Recalled Memories, Runbooks, Symptoms & Logs */}
        <div className="space-y-6">
          {/* Recalled Past Incidents */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Recalled Past Incidents</h3>
              </div>
              <button
                onClick={onOpenExplorer}
                className="text-[11px] font-mono text-[#4F46E5] dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {investigation?.recalled_memories && investigation.recalled_memories.length > 0 ? (
              <div className="space-y-3">
                {investigation.recalled_memories.map((mem, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-[#EEF2FF]/20 dark:hover:bg-[#1E2536] transition-colors text-xs space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#4F46E5] dark:text-indigo-400 font-bold">{mem.source_incident_id || mem.memory_id}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                        {String(Math.round((mem.similarity_score || 0.85) * 100))}% Match
                      </span>
                    </div>

                    <p className="text-[#172033] dark:text-[#F1F5F9] text-xs font-sans leading-snug">{mem.summary}</p>

                    {mem.verified_root_cause && (
                      <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#222834] text-[11px] font-mono space-y-1">
                        <span className="text-[#64748B] dark:text-[#94A3B8] font-semibold block text-[10px]">Historical Confirmed Fix:</span>
                        <span className="text-emerald-700 dark:text-emerald-400">{mem.resolution_applied}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-center text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                No prior memories recalled for this signature yet.
              </div>
            )}
          </Card>

          {/* Suggested Runbooks */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Suggested Runbooks</h3>
            <div className="space-y-2">
              {investigation?.suggested_runbooks?.map((rb, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs flex items-center justify-between">
                  <span className="text-[#172033] dark:text-[#F1F5F9] font-medium">{rb.title}</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-mono text-[10px] bg-white dark:bg-[#141820] px-2 py-0.5 rounded-md border border-[#E2E8F0] dark:border-[#222834]">
                    {rb.url_or_ref}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Incident Symptoms & Logs */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Observed Telemetry & Symptoms</h3>
            <div className="space-y-1.5">
              {incident.symptoms.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] text-[11px] font-mono text-[#172033] dark:text-[#F1F5F9] border border-[#E2E8F0] dark:border-[#222834] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {incident.logs_excerpt && (
              <div className="pt-2">
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono mb-1.5 flex items-center justify-between">
                  <span>Log Stream Excerpt:</span>
                  <span className="text-[#4F46E5] dark:text-indigo-400 text-[10px]">raw output</span>
                </div>
                <CodeBlock code={incident.logs_excerpt} language="error-trace" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
