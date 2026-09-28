import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  Server,
  Ticket
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button } from '../components/ui';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Archive className="w-6 h-6 text-accent-cyan" />
            <span>Incident Knowledge Archive</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Searchable historical incident repository with linked postmortems, verified fixes, and Hindsight memory provenance.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B] flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search past root causes, fixes, Jira tickets, or incident IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan"
          />
        </div>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-accent-cyan cursor-pointer"
        >
          <option value="">All Services</option>
          <option value="payment-api">payment-api</option>
          <option value="auth-service">auth-service</option>
          <option value="checkout-worker">checkout-worker</option>
        </select>
      </div>

      {/* Archive Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-2">
          <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <div>Loading historical incident archive...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400">
          No archived incidents match your query.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-accent-cyan/50 hover:bg-slate-900/60 transition-all cursor-pointer space-y-3 group shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-mono flex-wrap">
                  <span className="font-bold text-accent-cyan px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {inc.id}
                  </span>
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                  <span className="text-slate-400 flex items-center gap-1">
                    <Server className="w-3 h-3 text-slate-500" />
                    [{inc.service}]
                  </span>
                  <span className="text-slate-400">• {new Date(inc.created_at).toLocaleDateString()}</span>
                </div>

                {inc.resolution?.retained_in_hindsight && (
                  <HindsightBadge label="Hindsight Indexed" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">
                  {inc.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {inc.description}
                </p>
              </div>

              {inc.resolution && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">Verified Root Cause:</span>
                    <span className="text-emerald-300 font-medium leading-relaxed">{inc.resolution.verified_root_cause}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">Permanent Resolution:</span>
                    <span className="text-slate-200 leading-relaxed">{inc.resolution.permanent_fix}</span>
                  </div>
                </div>
              )}

              {inc.resolution?.follow_up_tickets && inc.resolution.follow_up_tickets.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Ticket className="w-3 h-3" /> Linked Tickets:
                  </span>
                  {inc.resolution.follow_up_tickets.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

