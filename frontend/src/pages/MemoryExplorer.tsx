import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Database, 
  BrainCircuit, 
  Search, 
  Activity
} from 'lucide-react';

export const MemoryExplorer: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.content?.toLowerCase().includes(q) ||
      m.source_incident_id?.toLowerCase().includes(q) ||
      m.metadata?.service?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-accent-cyan" />
            Hindsight Persistent Memory Explorer
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Biomimetic memory bank powered by Hindsight TEMPR (Temporal, Entity, Multi-strategy, Parallel Retrieval).
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bank ID: <span className="text-accent-cyan">{status?.hindsight?.bank_id || 'incidentmind-prod-bank'}</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <span className="text-xs font-medium text-gray-400">Retained Incident Memories</span>
          <div className="text-2xl font-bold font-mono text-white mt-2">{memories.length}</div>
          <span className="text-[11px] text-purple-400 font-mono">Durable Vector & Entity Store</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <span className="text-xs font-medium text-gray-400">TEMPR Recall Operations</span>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {auditLog.filter(a => a.action === 'RECALL').length}
          </div>
          <span className="text-[11px] text-accent-cyan font-mono">Active Semantic Lookups</span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <span className="text-xs font-medium text-gray-400">Hindsight Integration Mode</span>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-2">
            {status?.hindsight?.status === 'connected_remote' ? 'Hindsight Cloud' : 'Hindsight Sandbox'}
          </div>
          <span className="text-[11px] text-gray-500 font-mono">Verified Provenance Tracking</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memory records by service, incident ID, or root cause keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            Retained Incident Knowledge Records
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400">Reading Hindsight memory bank...</div>
          ) : filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No memory records found in bank.</div>
          ) : (
            <div className="space-y-3">
              {filteredMemories.map((mem) => (
                <div key={mem.id} className="p-4 rounded-xl bg-card border border-border hover:border-accent-cyan/40 transition-colors space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent-cyan">{mem.id}</span>
                      {mem.source_incident_id && (
                        <span className="px-2 py-0.5 rounded bg-background border border-border text-gray-300">
                          Source: {mem.source_incident_id}
                        </span>
                      )}
                      {mem.metadata?.service && (
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300">
                          {mem.metadata.service}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {new Date(mem.retained_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {mem.content}
                  </p>

                  <div className="p-3 rounded-lg bg-background border border-border/80 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 block">Verified Root Cause:</span>
                      <span className="text-emerald-300">{mem.provenance?.verified_root_cause || mem.metadata?.verified_root_cause || 'Confirmed by SRE'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Applied Resolution:</span>
                      <span className="text-gray-300">{mem.provenance?.resolution || mem.metadata?.permanent_fix || 'Remediation completed'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-cyan" />
            Memory Operations Stream (Audit)
          </h3>

          <div className="rounded-xl bg-card border border-border p-4 space-y-3 max-h-[600px] overflow-y-auto text-xs font-mono">
            {auditLog.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No operations recorded.</div>
            ) : (
              auditLog.map((op, idx) => {
                const actionClass = op.action === 'RETAIN' 
                  ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800';
                return (
                  <div key={idx} className="p-2.5 rounded bg-background border border-border/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={'px-1.5 py-0.5 rounded font-bold ' + actionClass}>
                        {op.action}
                      </span>
                      <span className="text-gray-500">{new Date(op.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-gray-300 text-[11px] truncate">
                      {op.summary || op.query || op.incident_id}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
