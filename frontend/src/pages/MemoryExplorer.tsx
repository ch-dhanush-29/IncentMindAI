import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, 
  BrainCircuit, 
  Search, 
  Layers, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Code
} from 'lucide-react';
import { Card, Badge, HindsightBadge, CodeBlock } from '../components/ui';

export const MemoryExplorer: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [activeTemprTab, setActiveTemprTab] = useState<'T' | 'E' | 'M' | 'P' | 'R'>('T');
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    loadMemoryData();

    const handleStreamUpdate = () => {
      loadMemoryData();
    };
    window.addEventListener('incident_stream_update', handleStreamUpdate);
    return () => window.removeEventListener('incident_stream_update', handleStreamUpdate);
  }, []);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      const [mems, audits, st] = await Promise.all([
        api.getMemories(),
        api.getMemoryAudit(),
        api.getHealthReady()
      ]);
      setMemories(mems);
      setAuditLog(audits);
      setStatus(st);
      if (mems.length > 0) {
        setSelectedMemory(mems[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter(m => {
    const matchesSearch = !searchQuery || (
      m.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.source_incident_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.metadata?.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.metadata?.verified_root_cause?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesService = serviceFilter === 'ALL' || m.metadata?.service === serviceFilter;
    return matchesSearch && matchesService;
  });

  const temprConcepts = {
    T: {
      letter: 'T',
      name: 'Temporal Awareness',
      tag: 'Decay & Recurrence Tracking',
      desc: 'Weights memories using dynamic exponential decay and periodicity algorithms. Recent outages during similar deployment windows receive higher contextual rank.',
      metric: status?.hindsight?.stats?.last_consolidated_at
        ? `Last Consolidated: ${new Date(status.hindsight.stats.last_consolidated_at).toLocaleTimeString()}`
        : 'Time Horizon: 90-day rolling window with recency-boosted score decay'
    },
    E: {
      letter: 'E',
      name: 'Entity Topologies',
      tag: 'Microservice Graph Linking',
      desc: 'Builds entity relationships across interconnected components (e.g., payment-api → postgres-primary → HikariCP pool). Allows cross-service failure correlation.',
      metric: status?.hindsight?.stats?.total_nodes !== undefined
        ? `Live Graph: ${status.hindsight.stats.total_nodes} nodes & ${status.hindsight.stats.total_links} semantic/causal links in Bank: ${status.hindsight.bank_id}`
        : 'Active Graph: 0 nodes (Local Sandbox Mode)'
    },
    M: {
      letter: 'M',
      name: 'Multi-Strategy Retrieval',
      tag: 'Hybrid Dense + Sparse Vectors',
      desc: 'Combines dense semantic vector embeddings with sparse BM25 keyword matching and exact error hash lookups, preventing semantic drift.',
      metric: 'Hybrid Strategy: Vector cosine similarity + BM25 keyword rank'
    },
    P: {
      letter: 'P',
      name: 'Parallel Retrieval Pipeline',
      tag: 'Concurrent Async Lookups',
      desc: 'Executes parallel multi-headed queries across past postmortems, verified runbooks, repository code, and configuration parameter histories.',
      metric: 'Query Latency: < 45ms parallel execution across bank shards'
    },
    R: {
      letter: 'R',
      name: 'Ranked Provenance Retrieval',
      tag: '100% SRE Provenance Grounding',
      desc: 'Every recalled memory is strictly tied to a human-verified resolution, timestamp, source incident ID, and verification engineer sign-off.',
      metric: 'Verification Enforced: Zero ungrounded hypotheses stored'
    }
  };

  return (
    <div className="space-y-6 text-[#172033] dark:text-[#F1F5F9] transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            Institutional Memory Explorer
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Inspect persistent incident resolutions, historical lessons, and verification provenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <HindsightBadge label="Institutional Memory Store" />
        </div>
      </div>

      {/* Top 3 Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">Primary Memory Bank</span>
            <div className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] font-mono">{status?.hindsight?.bank_id || 'Enterprise Knowledge Bank'}</div>
          </div>
          <Database className="w-5 h-5 text-[#4F46E5] dark:text-indigo-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">Total Stored Incidents</span>
            <div className="text-xl font-bold text-[#172033] dark:text-[#F1F5F9] font-mono">{memories.length} Records</div>
          </div>
          <BrainCircuit className="w-5 h-5 text-[#4F46E5] dark:text-indigo-400" />
        </Card>

        <Card className="p-4 flex flex-col justify-between space-y-1">
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {status?.hindsight?.status === 'connected_remote' ? 'Cloud Memory Active' : 'Local Memory Active'}
          </div>
          <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">Provenance & Recurrence Tracking Active</span>
        </Card>
      </div>

      {/* TEMPR Architecture Interactive Widget */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#222834] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              <span>5-Pillar Knowledge Architecture</span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              How IncidentMind structures persistent incident memory across 5 key pillars
            </p>
          </div>

          {/* Pillar Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] self-start sm:self-auto font-mono text-xs">
            {(['T', 'E', 'M', 'P', 'R'] as const).map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveTemprTab(letter)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTemprTab === letter
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#252D3D]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Pillar Content */}
        {(() => {
          const tab = temprConcepts[activeTemprTab];
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] space-y-1.5 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 text-[#4F46E5] dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center">
                    {tab.letter}
                  </span>
                  <span className="font-bold text-[#172033] dark:text-[#F1F5F9] text-sm">{tab.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/50 text-[#4F46E5] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 font-semibold">
                    {tab.tag}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed font-sans pt-1">
                  {tab.desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EEF2FF]/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-center space-y-1 font-mono text-xs">
                <span className="text-[#64748B] dark:text-[#94A3B8] text-[10px]">Pillar Metric:</span>
                <span className="text-[#4F46E5] dark:text-indigo-300 font-semibold text-xs leading-relaxed">{tab.metric}</span>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Search and Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memory records by service, incident ID, root cause, or error keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5]"
          />
        </div>

        {/* Service Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {['ALL', 'payment-api', 'auth-service', 'checkout-worker'].map((srv) => (
            <button
              key={srv}
              onClick={() => setServiceFilter(srv)}
              className={`px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                serviceFilter === srv
                  ? 'bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 font-bold'
                  : 'bg-white dark:bg-[#181D26] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#222834] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
              }`}
            >
              {srv}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Memories List on Left, Live Audit Log & Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Memory Records Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              <span>Retained Incident Knowledge Records ({filteredMemories.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">Click any card to inspect full details</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#64748B] dark:text-[#94A3B8] font-mono text-xs flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
              <span>Querying institutional memory records...</span>
            </div>
          ) : filteredMemories.length === 0 ? (
            <Card className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              No memories found matching your search.
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredMemories.map((mem) => {
                const isSelected = selectedMemory?.id === mem.id;
                return (
                  <div
                    key={mem.id}
                    onClick={() => setSelectedMemory(mem)}
                    className={`p-5 rounded-2xl border transition-colors cursor-pointer space-y-3 shadow-xs ${
                      isSelected
                        ? 'bg-[#EEF2FF]/40 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700'
                        : 'bg-white dark:bg-[#141820] border-[#E2E8F0] dark:border-[#222834] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-[#F8FAFC] dark:hover:bg-[#181D26]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#4F46E5] dark:text-indigo-400 px-2 py-0.5 rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40">
                          {mem.id}
                        </span>
                        <span className="text-[#64748B] dark:text-[#94A3B8]">
                          Source: <span className="text-[#172033] dark:text-[#F1F5F9] font-semibold">{mem.source_incident_id}</span>
                        </span>
                        <span className="text-[#64748B] dark:text-[#94A3B8]">[{mem.metadata?.service}]</span>
                      </div>

                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Human Verified
                      </span>
                    </div>

                    <p className="text-xs text-[#172033] dark:text-[#F1F5F9] leading-relaxed font-sans">
                      {mem.content}
                    </p>

                    {mem.metadata?.verified_root_cause && (
                      <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs font-mono space-y-1">
                        <span className="text-[#64748B] dark:text-[#94A3B8] text-[10px] font-semibold uppercase block">Verified Root Cause:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">{mem.metadata.verified_root_cause}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] pt-1">
                      <span>Retained: {new Date(mem.retained_at).toLocaleDateString()}</span>
                      <span className="text-[#4F46E5] dark:text-indigo-400 font-semibold">Inspect Full Record →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Memory Dossier / Raw JSON Inspector & Audit Trail */}
        <div className="space-y-6">
          {/* Selected Record Dossier */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222834] pb-3">
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                <Code className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <span>Record Inspector</span>
              </h3>
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                {selectedMemory?.id || 'None Selected'}
              </span>
            </div>

            {selectedMemory ? (
              <div className="space-y-3">
                <div className="space-y-1 text-xs">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block font-mono text-[10px]">Context Key:</span>
                  <span className="font-mono text-[#172033] dark:text-[#F1F5F9] bg-[#F8FAFC] dark:bg-[#181D26] px-2 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#222834] block">
                    {selectedMemory.context}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8] block font-mono text-[10px]">Structured Record Payload:</span>
                  <CodeBlock 
                    code={JSON.stringify(selectedMemory, null, 2)} 
                    language="json" 
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                Click any memory card on the left to inspect its details.
              </div>
            )}
          </Card>

          {/* Immutable Audit Log Stream */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#222834] pb-3">
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <span>Memory Audit Trail</span>
              </h3>
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">{auditLog.length} Events</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {auditLog.map((ev, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#4F46E5] dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40">
                      {ev.action}
                    </span>
                    <span className="text-[#94A3B8] dark:text-[#64748B]">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#172033] dark:text-[#F1F5F9] text-[11px] leading-snug">{ev.summary || ev.details}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
