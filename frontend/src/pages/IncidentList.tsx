import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Server,
  Download,
  ArrowUpDown,
  User,
  ChevronLeft,
  FileSpreadsheet
} from 'lucide-react';
import { SeverityBadge, StatusBadge, HindsightBadge, Button } from '../components/ui';

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
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');
  const [statusTab, setStatusTab] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(
        serviceFilter || undefined,
        severityFilter || undefined,
        statusTab === 'ACTIVE' ? 'Investigating' : statusTab === 'RESOLVED' ? 'Resolved' : undefined,
        search || undefined,
        assigneeFilter || undefined
      );
      setIncidents(data);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [serviceFilter, severityFilter, statusTab, search, assigneeFilter]);

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `incidentmind_incidents_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCSV = () => {
    const headers = ["ID", "Title", "Service", "Severity", "Status", "Assignee", "Environment", "Created At"];
    const rows = incidents.map(i => [
      i.id,
      `"${(i.title || '').replace(/"/g, '""')}"`,
      i.service,
      i.severity,
      i.status,
      `"${(i.assignee || 'unassigned').replace(/"/g, '""')}"`,
      i.environment,
      i.created_at
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `incidentmind_incidents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'severity') {
      const order: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalPages = Math.ceil(sortedIncidents.length / pageSize) || 1;
  const paginatedIncidents = sortedIncidents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeCount = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Header with Declare & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            Production Incidents Feed
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Real-time telemetry, active war room workspaces, and historical records linked to Hindsight memory banks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAsCSV}
            title="Download CSV export"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportAsJSON}
            title="Download JSON export"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> JSON
          </Button>

          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Declare Incident
          </Button>
        </div>
      </div>

      {/* Filter and Status Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-3">
        {/* Top Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E2E8F0] dark:border-[#222834] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
                statusTab === 'ALL'
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                  : 'bg-[#F8FAFC] dark:bg-[#181D26] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#222834] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
              }`}
            >
              All Incidents ({incidents.length})
            </button>
            <button
              onClick={() => setStatusTab('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
                statusTab === 'ACTIVE'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-[#F8FAFC] dark:bg-[#181D26] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#222834] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
              }`}
            >
              Active Outages ({activeCount})
            </button>
            <button
              onClick={() => setStatusTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
                statusTab === 'RESOLVED'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#F8FAFC] dark:bg-[#181D26] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#222834] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
              }`}
            >
              Resolved & Retained ({resolvedCount})
            </button>
          </div>

          <div className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
            <span>Showing <strong className="text-[#172033] dark:text-[#F1F5F9]">{sortedIncidents.length}</strong> incidents</span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-[#E2E8F0] dark:border-[#222834] pl-3">
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#172033] dark:text-[#F1F5F9] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Sort: Newest</option>
                <option value="oldest" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Sort: Oldest</option>
                <option value="severity" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Sort: Highest Severity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by title, symptoms, or error messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">All Services</option>
              <option value="payment-api" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">payment-api</option>
              <option value="auth-service" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">auth-service</option>
              <option value="checkout-worker" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">checkout-worker</option>
              <option value="order-service" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">order-service</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">All Severities</option>
              <option value="Critical" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Critical</option>
              <option value="High" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">High</option>
              <option value="Medium" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Medium</option>
              <option value="Low" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Low</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">All Assignees</option>
              <option value="Ryan Cox Administrator" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Ryan Cox Administrator</option>
              <option value="Carlos Ruiz (Infra Lead)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Carlos Ruiz (Infra Lead)</option>
              <option value="Elena Rostova (Principal SRE)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Elena Rostova (Principal SRE)</option>
              <option value="Jane Smith (DBA)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Jane Smith (DBA)</option>
              <option value="sre-oncall" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">sre-oncall</option>
              <option value="unassigned" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List Card */}
      <div className="bg-white dark:bg-[#141820] rounded-2xl border border-[#E2E8F0] dark:border-[#222834] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B] dark:text-[#94A3B8] font-mono text-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
            <span>Streaming incident events...</span>
          </div>
        ) : paginatedIncidents.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] dark:text-[#94A3B8] text-xs">
            No production incidents matched the selected criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
            {paginatedIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className="p-5 hover:bg-[#EEF2FF]/40 dark:hover:bg-[#1C2230]/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-3xl">
                  {/* Top Row Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#4F46E5] dark:text-indigo-400 px-2 py-0.5 rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60">
                      {inc.id}
                    </span>
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono flex items-center gap-1">
                      <Server className="w-3 h-3 text-[#94A3B8]" />
                      [{inc.service}]
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                      env: {inc.environment}
                    </span>
                    {inc.assignee && inc.assignee !== 'unassigned' && (
                      <span className="text-[11px] font-mono text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <User className="w-3 h-3 text-[#4F46E5] dark:text-indigo-400" />
                        {inc.assignee}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-1 mt-0.5">
                      {inc.description}
                    </p>
                  </div>

                  {/* Symptoms & Hindsight Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {inc.symptoms.slice(0, 3).map((symp, idx) => (
                      <span 
                        key={idx} 
                        className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-[#F8FAFC] dark:bg-[#181D26] px-2 py-0.5 rounded-md border border-[#E2E8F0] dark:border-[#222834]"
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
                <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] dark:text-[#94A3B8] self-end md:self-auto flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[#172033] dark:text-[#F1F5F9] font-medium">
                      {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-[#4F46E5] dark:text-indigo-300 group-hover:bg-[#4F46E5] group-hover:text-white dark:group-hover:bg-[#4F46E5] dark:group-hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold">
                    <span>Investigate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#F8FAFC] dark:bg-[#181D26] border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748B] dark:text-[#94A3B8]">
              Page {currentPage} of {totalPages} ({sortedIncidents.length} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#222834] bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#1C2230] flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#222834] bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#1C2230] flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

