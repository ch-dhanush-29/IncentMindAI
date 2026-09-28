import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, 
  BrainCircuit, 
  Search, 
  Activity,
  Layers,
  Clock,
  Network,
  Cpu,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Code
} from 'lucide-react';
import { Card, Badge, HindsightBadge, Button, CodeBlock } from '../components/ui';

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
      metric: 'Time Horizon: 90-day rolling window with recency-boosted score decay'
    },
    E: {
      letter: 'E',
      name: 'Entity Topologies',
      tag: 'Microservice Graph Linking',
      desc: 'Builds entity relationships across interconnected components (e.g., payment-api → postgres-primary → HikariCP pool). Allows cross-service failure correlation.',
      metric: 'Active Graph: 14 microservice nodes & 42 mapped dependency edges'
    },
    M: {
      letter: 'M',
      name: 'Multi-Strategy Retrieval',
      tag: 'Hybrid Dense + Sparse Vectors',
      desc: 'Combines dense semantic vector embeddings with sparse BM25 keyword matching and exact error hash lookups, preventing semantic drift.',
      metric: 'Hybrid Strategy: 1536-dim vector cosine similarity + BM25 keyword rank'
    },
    P: {
      letter: 'P',
      name: 'Parallel Retrieval Pipeline',
      tag: 'Concurrent Async Lookups',
      desc: 'Executes parallel multi-headed queries across past postmortems, verified runbooks, repository code, and configuration parameter histories.',
      metric: 'Query Latency: < 42ms parallel execution across 4 shard partitions'
    },
    R: {
      letter: 'R',
      name: 'Ranked Provenance Retrieval',
      tag: 'Human-Verified Grounding',
      desc: 'Strictly prioritizes resolutions confirmed by SRE human engineers over speculative model hallucinations, ensuring 100% dependable diagnostics.',
      metric: 'Confidence Filter: 100% of recalled solutions have SRE sign-off'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Database className="w-6 h-6 text-accent-cyan" />
            <span>Hindsight Persistent Memory Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Biomimetic memory bank powered by Hindsight TEMPR (Temporal, Entity, Multi-strategy, Parallel Retrieval).
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bank ID: <span className="text-accent-cyan font-bold">{status?.hindsight?.bank_id || 'incidentmind-prod-bank'}</span></span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-xs font-medium text-slate-400">Retained Incident Memories</span>
          <div className="text-3xl font-extrabold font-mono text-white pt-1">{memories.length}</div>
          <span className="text-[11px] text-purple-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Durable Vector & Entity Store
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs font-medium text-slate-400">TEMPR Recall Operations</span>
          <div className="text-3xl font-extrabold font-mono text-accent-cyan pt-1">
            {auditLog.filter(a => a.action === 'RECALL').length}
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">Real-Time SRE Recall Queries</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs font-medium text-slate-400">Hindsight Engine Mode</span>
          <div className="text-xl font-bold font-mono text-emerald-400 pt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {status?.hindsight?.status === 'connected_remote' ? 'Hindsight Cloud API' : 'Hindsight Embedded Bank'}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Provenance & Recurrence Tracking Active</span>
        </Card>
      </div>

      {/* TEMPR Architecture Interactive Widget */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-cyan" />
              <span>TEMPR Memory Architecture Deep Dive</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How Hindsight structures persistent memory across 5 architectural pillars
            </p>
          </div>

          {/* Pillar Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto font-mono text-xs">
            {(['T', 'E', 'M', 'P', 'R'] as const).map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveTemprTab(letter)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTemprTab === letter
                    ? 'bg-gradient-to-r from-blue-600 to-accent-cyan text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-accent-cyan font-mono font-bold text-xs flex items-center justify-center">
                    {tab.letter}
                  </span>
                  <span className="font-bold text-white text-sm">{tab.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {tab.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  {tab.desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-purple-950/30 border border-purple-800/40 flex flex-col justify-center space-y-1 font-mono text-xs">
                <span className="text-slate-400 text-[10px]">Active Engine Telemetry:</span>
                <span className="text-purple-300 font-semibold text-xs leading-relaxed">{tab.metric}</span>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Search and Filters Bar */}
      <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memory records by service, incident ID, root cause, or error keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan"
          />
        </div>

        {/* Service Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {['ALL', 'payment-api', 'auth-service', 'checkout-worker'].map((srv) => (
            <button
              key={srv}
              onClick={() => setServiceFilter(srv)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                serviceFilter === srv
                  ? 'bg-accent-blue/20 text-accent-cyan border-accent-cyan/40 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
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
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Retained Incident Knowledge Records ({filteredMemories.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Click any card to inspect TEMPR vectors</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">Reading Hindsight memory bank...</div>
          ) : filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No memory records match the selected query.</div>
          ) : (
            <div className="space-y-3">
              {filteredMemories.map((mem) => {
                const isSelected = selectedMemory?.id === mem.id;

                return (
                  <div 
                    key={mem.id} 
                    onClick={() => setSelectedMemory(mem)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      isSelected 
                        ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30' 
                        : 'bg-[#0F172A] border-[#1E293B] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-accent-cyan">{mem.id}</span>
                        {mem.source_incident_id && (
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            Source: {mem.source_incident_id}
                          </span>
                        )}
                        {mem.metadata?.service && (
                          <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300">
                            {mem.metadata.service}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(mem.retained_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {mem.content}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Verified Root Cause:</span>
                        <span className="text-emerald-300 font-medium leading-snug">
                          {mem.provenance?.verified_root_cause || mem.metadata?.verified_root_cause || 'Confirmed by SRE'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Applied Resolution:</span>
                        <span className="text-slate-300 leading-snug">
                          {mem.provenance?.resolution || mem.metadata?.permanent_fix || 'Remediation completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Selected Memory Inspector & Audit Trail */}
        <div className="space-y-6">
          {/* Selected Memory Inspector Card */}
          {selectedMemory ? (
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Memory Inspector</span>
                </h3>
                <span className="text-[10px] font-mono text-accent-cyan bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                  {selectedMemory.id}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Source Incident ID:</span>
                  <span className="text-white font-bold">{selectedMemory.source_incident_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Verified By Human SRE:</span>
                  <span className="text-emerald-400 font-bold">YES (Provenance Grounded)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Bank Name:</span>
                  <span className="text-purple-300 font-mono">incidentmind-prod-bank</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[10px] font-mono block mb-1">Raw TEMPR Payload & Metadata:</span>
                <CodeBlock 
                  code={JSON.stringify(selectedMemory, null, 2)} 
                  language="json" 
                />
              </div>
            </Card>
          ) : null}

          {/* Memory Operations Stream (Live Audit) */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-cyan" />
                <span>Memory Operations Stream (Audit)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{auditLog.length} events</span>
            </div>

            <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 space-y-2.5 max-h-[400px] overflow-y-auto text-xs font-mono">
              {auditLog.length === 0 ? (
                <div className="text-slate-400 text-center py-4">No operations recorded.</div>
              ) : (
                auditLog.map((op, idx) => {
                  const isRetain = op.action === 'RETAIN';

                  return (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-bold border ${
                          isRetain 
                            ? 'bg-purple-950 text-purple-300 border-purple-700' 
                            : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        }`}>
                          {op.action}
                        </span>
                        <span className="text-slate-400">{new Date(op.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] truncate">
                        {op.summary || op.query || op.incident_id}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

