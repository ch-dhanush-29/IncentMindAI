import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  Archive, 
  Search, 
  ChevronRight, 
  Server,
  Ticket
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge } from '../components/ui';

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
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] flex items-center gap-2.5">
            <Archive className="w-6 h-6 text-[#4F46E5]" />
            <span>Incident Knowledge Archive</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Searchable historical incident repository with linked postmortems, verified fixes, and institutional knowledge.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search past root causes, fixes, Jira tickets, or incident IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:bg-white"
          />
        </div>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[#172033] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
        >
          <option value="">All Services</option>
          <option value="payment-api">payment-api</option>
          <option value="auth-service">auth-service</option>
          <option value="checkout-worker">checkout-worker</option>
        </select>
      </div>

      {/* Archive Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#64748B] space-y-2">
          <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto" />
          <span>Scanning archive records...</span>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-xs text-[#64748B]">
          No archived incidents found matching query.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-indigo-200 hover:bg-[#EEF2FF]/20 transition-colors cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#4F46E5] px-2 py-0.5 rounded-lg bg-[#EEF2FF] border border-indigo-100">
                      {inc.id}
                    </span>
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {new Date(inc.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#4F46E5] transition-colors leading-snug">
                    {inc.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono mt-1">
                    <Server className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>service: {inc.service}</span>
                    <span>•</span>
                    <span>env: {inc.environment}</span>
                  </div>
                </div>

                {inc.resolution?.verified_root_cause ? (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="text-[10px] font-mono font-semibold text-[#64748B] uppercase flex items-center justify-between">
                      <span>Verified Root Cause:</span>
                      <HindsightBadge label="Retained" />
                    </div>
                    <p className="text-[#172033] line-clamp-2 leading-relaxed font-sans">
                      {inc.resolution.verified_root_cause}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    Active Outage — Investigation in progress
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1 text-[#64748B]">
                  {inc.resolution?.follow_up_tickets && inc.resolution.follow_up_tickets.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-[#94A3B8]" />
                      {inc.resolution.follow_up_tickets.join(', ')}
                    </span>
                  )}
                </div>

                <div className="text-[#4F46E5] group-hover:text-[#4338CA] flex items-center gap-1 font-semibold">
                  <span>View Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
