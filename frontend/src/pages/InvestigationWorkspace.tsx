import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident, InvestigationResult } from '../types/incident';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Database, 
  RefreshCw,
  Terminal,
  FileCheck2,
  ExternalLink,
  SplitSquareVertical
} from 'lucide-react';

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
  const [chatLog, setChatLog] = useState<{ q: string; a: string }[]>([]);
  const [asking, setAsking] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [baselineInvestigation, setBaselineInvestigation] = useState<InvestigationResult | null>(null);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);

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

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !question.trim()) return;
    try {
      setAsking(true);
      const res = await api.askQuestion(incident.id, question);
      setChatLog(prev => [...prev, { q: question, a: res.answer }]);
      setQuestion('');
    } catch (e) {
      console.error(e);
    } finally {
      setAsking(false);
    }
  };

  if (loading && !incident) {
    return <div className="p-8 text-gray-400 font-mono text-xs">Loading AI Investigation Studio...</div>;
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-gray-400 text-sm">
        Select an incident from the Incidents Feed to begin investigation.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-accent-cyan px-2 py-0.5 rounded bg-background border border-border">
              {incident.id}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400">
              {incident.severity}
            </span>
            <span className="text-xs text-gray-400 font-mono">Service: {incident.service}</span>
            <span className="text-xs text-gray-500 font-mono">? {incident.environment}</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{incident.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => runComparison()}
            className="px-3 py-1.5 rounded-lg bg-background hover:bg-card border border-accent-cyan/40 text-accent-cyan font-mono text-xs flex items-center gap-1.5 transition-all"
            title="Side-by-side comparison of agent diagnosis with vs without Hindsight memory"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" /> Compare vs No-Memory
          </button>

          <button
            onClick={() => runAnalysis(incident.id, true)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/50 text-accent-blue font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={'w-3.5 h-3.5 ' + (loading ? 'animate-spin' : '')} /> Re-analyze
          </button>

          <button
            onClick={() => onNavigateToResolve(incident.id)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5" /> Verify & Retain Postmortem
          </button>
        </div>
      </div>

      {compareMode && baselineInvestigation && (
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-accent-cyan/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SplitSquareVertical className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-sm font-bold text-white">Persistent Memory Impact: Grounded Recall vs Generic Baseline</h3>
            </div>
            <button 
              onClick={() => setCompareMode(false)}
              className="text-xs font-mono text-gray-400 hover:text-white px-2 py-0.5 rounded bg-background border border-border"
            >
              Exit Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-background/80 border border-border space-y-2">
              <div className="flex items-center justify-between text-gray-400 border-b border-border pb-2">
                <span className="font-bold text-gray-300">WITHOUT HINDSIGHT (Baseline LLM)</span>
                <span className="text-[10px] text-amber-400">0 Memories Used</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-sans">{baselineInvestigation.summary}</p>
              <div className="text-[11px] text-amber-300/80 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                {baselineInvestigation.insufficient_evidence_warning || 'Generic diagnosis path. Exploring broad failure domains.'}
              </div>
              <div className="pt-2">
                <span className="font-bold text-gray-300 block mb-1 font-sans">Exploratory Hypotheses:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-400 font-sans">
                  {baselineInvestigation.hypotheses.map((h, i) => (
                    <li key={i}><span className="font-semibold text-gray-300">{h.cause}</span> ({h.status})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-b from-card to-background border border-accent-cyan/50 space-y-2 shadow-lg shadow-cyan-950/40">
              <div className="flex items-center justify-between text-accent-cyan border-b border-cyan-900/60 pb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-accent-cyan" /> WITH HINDSIGHT PERSISTENT MEMORY
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {String(investigation?.recalled_memories.length || 0)} Historical Match(es)
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed font-sans">{investigation?.summary}</p>
              <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/50">
                {investigation?.confidence_rationale}
              </div>
              <div className="pt-2">
                <span className="font-bold text-accent-cyan block mb-1 font-sans">Grounded Confirmed Root Cause:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-300 font-sans">
                  {investigation?.hypotheses.map((h, i) => {
                    const badgeClass = h.status === 'Confirmed' ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300';
                    return (
                      <li key={i}>
                        <span className="font-semibold text-white">{h.cause}</span>
                        <span className={'ml-2 text-[10px] px-1.5 py-0.5 rounded ' + badgeClass}>{h.status}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold text-white">Agentic Investigation Synthesis</h3>
              </div>
              {investigation?.is_memory_enabled && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Hindsight TEMPR Recall
                </span>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {investigation?.summary || 'Analysis pending...'}
            </p>

            <div className="p-3 rounded-lg bg-background/80 border border-border text-xs">
              <div className="font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" /> Evidence & Confidence Grounding:
              </div>
              <p className="text-gray-400 font-mono text-[11px]">
                {investigation?.confidence_rationale}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Root Cause Hypotheses (Grounded vs Suspected)</h3>
              <span className="text-xs text-gray-400 font-mono">Human Verification Required</span>
            </div>

            <div className="space-y-3">
              {investigation?.hypotheses.map((hypo, idx) => {
                const cardClass = hypo.status === 'Confirmed'
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : hypo.status === 'Suspected'
                  ? 'bg-amber-950/20 border-amber-800/60'
                  : 'bg-background border-border';

                const statusTagClass = hypo.status === 'Confirmed'
                  ? 'bg-emerald-900/60 text-emerald-300'
                  : hypo.status === 'Suspected'
                  ? 'bg-amber-900/60 text-amber-300'
                  : 'bg-gray-800 text-gray-400';

                return (
                  <div key={idx} className={'p-4 rounded-lg border text-xs space-y-2 ' + cardClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={'px-2 py-0.5 rounded text-[10px] font-mono font-bold ' + statusTagClass}>
                            {hypo.status}
                          </span>
                          <span className="font-bold text-white text-xs">{hypo.cause}</span>
                        </div>
                        {hypo.notes && <p className="text-gray-400 text-[11px]">{hypo.notes}</p>}
                      </div>

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-gray-400">
                        Risk: {hypo.risk_level}
                      </span>
                    </div>

                    {hypo.evidence_supporting && hypo.evidence_supporting.length > 0 && (
                      <div className="pt-2 border-t border-border/50 text-[11px] font-mono text-gray-300 space-y-1">
                        <div className="text-gray-500 font-semibold">Supporting Evidence:</div>
                        {hypo.evidence_supporting.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-300">
                            <span className="text-accent-cyan">?</span> {ev}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Safe, Reversible Diagnostic Sequence</h3>
              <span className="text-[11px] text-gray-400 font-mono">Non-destructive triage steps</span>
            </div>

            <div className="space-y-3">
              {investigation?.diagnostic_steps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-background/80 border border-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <span className="w-5 h-5 rounded-full bg-accent-blue/20 text-accent-cyan flex items-center justify-center font-mono text-xs font-bold">
                        {step.step_number}
                      </span>
                      <span>{step.action}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                        {step.is_reversible ? 'Reversible' : 'Irreversible'}
                      </span>
                      <span className="text-gray-400 bg-card px-1.5 py-0.5 rounded border border-border">
                        Risk: {step.risk}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-[11px] pl-7">{step.rationale}</p>

                  {step.command_or_query && (
                    <div className="ml-7 p-2 rounded bg-black/60 border border-border font-mono text-[11px] text-accent-cyan flex items-center justify-between">
                      <code>{step.command_or_query}</code>
                      <Terminal className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-accent-cyan" />
              Contextual SRE Copilot Q&A
            </h3>
            <p className="text-xs text-gray-400">
              Ask follow-up questions bounded strictly to this incident and recalled Hindsight memory banks.
            </p>

            {chatLog.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {chatLog.map((chat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="p-2.5 rounded-lg bg-background text-gray-200 font-mono text-[11px]">
                      <span className="text-accent-cyan font-bold">Q:</span> {chat.q}
                    </div>
                    <div className="p-3 rounded-lg bg-card/80 border border-border text-gray-300 leading-relaxed">
                      <span className="text-purple-400 font-bold font-mono">Agent:</span> {chat.a}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAsk} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Ask about potential root causes, similar past incidents, or queries to run..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
              />
              <button
                type="submit"
                disabled={asking}
                className="px-3.5 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" /> {asking ? 'Thinking...' : 'Ask'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Recalled Hindsight Memories</h3>
              </div>
              <button
                onClick={onOpenExplorer}
                className="text-[11px] font-mono text-accent-cyan hover:underline flex items-center gap-1"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {investigation?.recalled_memories && investigation.recalled_memories.length > 0 ? (
              <div className="space-y-3">
                {investigation.recalled_memories.map((mem, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-background border border-border text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-accent-cyan font-bold">{mem.source_incident_id || mem.memory_id}</span>
                      <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                        {String(Math.round((mem.similarity_score || 0.85) * 100))} % Match
                      </span>
                    </div>

                    <p className="text-gray-300 text-[11px] font-sans leading-snug">{mem.summary}</p>

                    {mem.verified_root_cause && (
                      <div className="pt-1 text-[11px] font-mono text-gray-400">
                        <span className="text-gray-500 font-semibold block">Historical Fix Applied:</span>
                        <span className="text-emerald-300">{mem.resolution_applied}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-background text-center text-xs text-gray-500 font-mono">
                No prior memories recalled for this incident signature yet.
              </div>
            )}
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-white">Referenced Runbooks</h3>
            {investigation?.suggested_runbooks?.map((rb, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-background border border-border text-xs flex items-center justify-between">
                <span className="text-gray-200 font-medium">{rb.title}</span>
                <span className="text-gray-500 font-mono text-[10px]">{rb.url_or_ref}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-white">Incident Symptoms & Logs</h3>
            <div className="space-y-1.5">
              {incident.symptoms.map((s, i) => (
                <div key={i} className="p-2 rounded bg-background text-[11px] font-mono text-gray-300 border border-border/60">
                  {s}
                </div>
              ))}
            </div>

            {incident.logs_excerpt && (
              <div className="pt-2">
                <div className="text-[11px] text-gray-400 font-mono mb-1">Log Stream Excerpt:</div>
                <pre className="p-3 rounded bg-black/80 border border-border text-[10px] font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-48">
                  {incident.logs_excerpt}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
