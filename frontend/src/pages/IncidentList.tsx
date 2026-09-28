import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  Filter, 
  ChevronRight, 
  BrainCircuit, 
  Plus, 
  Search, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button } from '../components/ui';

interface IncidentListProps {
  onSelectIncident: (id: string) => void;
  openCreateModal: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ onSelectIncident, openCreateModal }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(
        serviceFilter || undefined,
        severityFilter || undefined,
        statusTab === 'ACTIVE' ? 'Investigating' : statusTab === 'RESOLVED' ? 'Resolved' : undefined,
        search || undefined
      );
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [serviceFilter, severityFilter, statusTab, search]);

  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Header with Declare Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Production Incidents Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, active war room workspaces, and historical records linked to Hindsight memory banks.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Declare Incident
        </Button>
      </div>

      {/* Filter and Status Bar */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B] space-y-3">
        {/* Top Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusTab === 'ALL'
                  ? 'bg-accent-blue text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              All Incidents ({incidents.length})
            </button>
            <button
              onClick={() => setStatusTab('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusTab === 'ACTIVE'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Active Outages ({activeCount})
            </button>
            <button
              onClick={() => setStatusTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusTab === 'RESOLVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Resolved & Retained ({resolvedCount})
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Showing <span className="text-accent-cyan font-bold">{incidents.length}</span> live records
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by title, symptoms, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-accent-cyan cursor-pointer"
          >
            <option value="">All Services</option>
            <option value="payment-api">payment-api</option>
            <option value="auth-service">auth-service</option>
            <option value="checkout-worker">checkout-worker</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-accent-cyan cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(serviceFilter || severityFilter || search) && (
            <button
              onClick={() => { setServiceFilter(''); setSeverityFilter(''); setSearch(''); }}
              className="text-accent-cyan hover:underline text-xs ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <div>Loading incident telemetry feed...</div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No incidents match the selected filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className="p-5 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-3xl">
                  {/* Top Row Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-cyan px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {inc.id}
                    </span>
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Server className="w-3 h-3 text-slate-500" />
                      [{inc.service}]
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      env: {inc.environment}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {inc.description}
                    </p>
                  </div>

                  {/* Symptoms & Hindsight Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {inc.symptoms.slice(0, 3).map((symp, idx) => (
                      <span 
                        key={idx} 
                        className="text-[11px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800"
                      >
                        {symp}
                      </span>
                    ))}
                    {inc.resolution?.retained_in_hindsight && (
                      <HindsightBadge label="Retained in Hindsight" />
                    )}
                  </div>
                </div>

                {/* Right: Timestamp and Launch Action */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 self-end md:self-auto flex-shrink-0">
                  <div className="text-right">
                    <div className="text-slate-300 font-medium">
                      {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-slate-900 group-hover:bg-accent-blue group-hover:text-white border border-slate-800 group-hover:border-blue-400 transition-all flex items-center gap-1.5 text-accent-cyan text-xs font-semibold">
                    <span>Investigate</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

