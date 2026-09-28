import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  Filter, 
  ChevronRight, 
  BrainCircuit,
  Plus
} from 'lucide-react';

interface IncidentListProps {
  onSelectIncident: (id: string) => void;
  openCreateModal: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({ onSelectIncident, openCreateModal }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(
        serviceFilter || undefined,
        severityFilter || undefined,
        statusFilter || undefined
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
  }, [serviceFilter, severityFilter, statusFilter]);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Resolved':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      case 'Investigating':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-800 animate-pulse';
      case 'Mitigated':
        return 'bg-blue-950/60 text-blue-300 border-blue-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Incidents Feed</h2>
          <p className="text-xs text-gray-400 mt-1">
            Active alerts, investigation workspaces, and historical records retained in Hindsight.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> New Incident
        </button>
      </div>

      <div className="p-3 rounded-xl bg-card border border-border flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-400 font-medium pl-1">
          <Filter className="w-3.5 h-3.5 text-accent-cyan" /> Filters:
        </div>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-accent-cyan"
        >
          <option value="">All Services</option>
          <option value="payment-api">payment-api</option>
          <option value="auth-service">auth-service</option>
          <option value="checkout-worker">checkout-worker</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-accent-cyan"
        >
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-gray-300 focus:outline-none focus:border-accent-cyan"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>

        {(serviceFilter || severityFilter || statusFilter) && (
          <button
            onClick={() => { setServiceFilter(''); setSeverityFilter(''); setStatusFilter(''); }}
            className="text-accent-cyan hover:underline text-xs ml-auto pr-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 font-mono text-xs">Loading incident telemetry...</div>
        ) : incidents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">No incidents match the selected filters.</div>
        ) : (
          <div className="divide-y divide-border">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className="p-4 hover:bg-background/40 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-accent-cyan">{inc.id}</span>
                    <span className={'px-2 py-0.5 rounded text-[11px] font-mono border ' + getSeverityBadge(inc.severity)}>
                      {inc.severity}
                    </span>
                    <span className={'px-2 py-0.5 rounded text-[11px] font-mono border ' + getStatusBadge(inc.status)}>
                      {inc.status}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">[{inc.service}]</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white">{inc.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{inc.description}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {inc.symptoms.slice(0, 2).map((symp, idx) => (
                      <span key={idx} className="text-[11px] font-mono text-gray-400 bg-background/80 px-2 py-0.5 rounded border border-border/60">
                        {symp}
                      </span>
                    ))}
                    {inc.resolution?.retained_in_hindsight && (
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-purple-400" /> In Hindsight Bank
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 self-end md:self-auto">
                  <div className="text-right">
                    <div>{new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[10px] text-gray-500">{inc.environment}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
