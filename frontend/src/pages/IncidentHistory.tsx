import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  Archive, 
  Search, 
  Filter, 
  Clock, 
  BrainCircuit, 
  ChevronRight, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';

interface IncidentHistoryProps {
  onSelectIncident: (id: string) => void;
}

export const IncidentHistory: React.FC<IncidentHistoryProps> = ({ onSelectIncident }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    loadIncidents();
  }, [service]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(service || undefined);
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = incidents.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.service.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.resolution?.verified_root_cause?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-accent-cyan" /> Incident Knowledge Archive
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Searchable historical incident repository with linked postmortems and Hindsight memory provenance.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-3.5 rounded-xl bg-card border border-border flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search past root causes, fixes, tickets, or incident IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
          />
        </div>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:border-accent-cyan"
        >
          <option value="">All Services</option>
          <option value="payment-api">payment-api</option>
          <option value="auth-service">auth-service</option>
          <option value="checkout-worker">checkout-worker</option>
        </select>
      </div>

      {/* Archive Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-gray-400">Loading historical incident archive...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500">No archived incidents match your query.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className="p-5 rounded-xl bg-card border border-border hover:border-accent-cyan/40 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-accent-cyan">{inc.id}</span>
                  <Badge variant={inc.severity === 'Critical' ? 'critical' : inc.severity === 'High' ? 'high' : 'medium'}>
                    {inc.severity}
                  </Badge>
                  <span className="text-gray-400">[{inc.service}]</span>
                  <span className="text-gray-500">• {new Date(inc.created_at).toLocaleDateString()}</span>
                </div>

                {inc.resolution?.retained_in_hindsight && (
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded flex items-center gap-1 self-start md:self-auto">
                    <BrainCircuit className="w-3 h-3 text-purple-400" /> Hindsight Indexed
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-accent-cyan transition-colors">{inc.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{inc.description}</p>
              </div>

              {inc.resolution && (
                <div className="p-3 rounded-lg bg-background border border-border/80 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                  <div>
                    <span className="text-gray-500 block">Verified Root Cause:</span>
                    <span className="text-emerald-300">{inc.resolution.verified_root_cause}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Permanent Resolution:</span>
                    <span className="text-gray-300">{inc.resolution.permanent_fix}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
