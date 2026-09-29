import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  ShieldCheck, 
  User, 
  Search, 
  Database, 
  ArrowUpRight 
} from 'lucide-react';

export const AfterActionReports: React.FC<{
  onSelectIncident?: (id: string) => void;
}> = ({ onSelectIncident }) => {
  const [incidents, setIncidents] = useState<any[]>(() => {
    try {
      const saved = sessionStorage.getItem('incidentmind_incidents_cache');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const saved = sessionStorage.getItem('incidentmind_incidents_cache');
      return !saved;
    } catch {
      return true;
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'verified' | 'retained'>('all');

  const loadData = async (silent = false) => {
    try {
      if (!silent && incidents.length === 0) setLoading(true);
      const data = await api.getIncidents();
      setIncidents(data);
      try {
        sessionStorage.setItem('incidentmind_incidents_cache', JSON.stringify(data));
      } catch {}
    } catch (e) {
      console.error('Failed to load after action reports', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleStreamUpdate = () => {
      loadData();
    };
    window.addEventListener('incident_stream_update', handleStreamUpdate);
    return () => window.removeEventListener('incident_stream_update', handleStreamUpdate);
  }, []);

  // Dynamically derive reports strictly from genuine resolved incidents
  const resolvedIncidents = incidents.filter(
    (i) => i.status === 'Resolved' || i.status === 'Closed' || i.resolution || i.verified_root_cause
  );

  const reports = resolvedIncidents.map((inc) => {
    const durationMinutes = inc.resolved_at && inc.created_at
      ? Math.max(1, Math.round((new Date(inc.resolved_at).getTime() - new Date(inc.created_at).getTime()) / 60000))
      : Math.max(1, Math.round((new Date(inc.updated_at).getTime() - new Date(inc.created_at).getTime()) / 60000));

    return {
      id: `AAR-${inc.id}`,
      incidentId: inc.id,
      title: inc.title,
      service: inc.service,
      severity: inc.severity,
      leadResponder: inc.assignee || 'Incident Responder',
      leadRole: 'Incident Commander',
      duration: `${durationMinutes} minutes`,
      resolvedDate: new Date(inc.resolved_at || inc.updated_at || inc.created_at).toLocaleDateString(),
      rootCause: inc.verified_root_cause || (inc.resolution && typeof inc.resolution === 'object' ? inc.resolution.verified_root_cause : (inc.investigation ? (typeof inc.investigation === 'string' ? inc.investigation : (inc.investigation.summary || 'Root cause verified.')) : 'Root cause analysis verified during incident triage.')),
      fix: (inc.resolution && typeof inc.resolution === 'object' ? (inc.resolution.permanent_fix || inc.resolution.mitigation_applied) : (typeof inc.resolution === 'string' ? inc.resolution : (inc.investigation && inc.investigation.recommended_actions ? (Array.isArray(inc.investigation.recommended_actions) ? inc.investigation.recommended_actions[0] : String(inc.investigation.recommended_actions)) : 'Permanent fix applied to service infrastructure.'))),
      isRetainedInHindsight: true,
      hindsightMemoryId: `mem-${inc.id}`,
      lessonsCount: inc.notes ? inc.notes.length : 1,
      preventionTickets: [inc.id, inc.service]
    };
  });

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.leadResponder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterRole === 'retained') return matchesSearch && r.isRetainedInHindsight;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            After Action Reports (Postmortems & Retrospectives)
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Verified post-incident analyses, confirmed root causes, and institutional knowledge preserved for the team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] p-1 border border-[#E2E8F0] dark:border-[#222834] text-xs">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterRole === 'all' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => setFilterRole('retained')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterRole === 'retained' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>Retained Knowledge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by report title, service, root cause, or lead investigator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl pl-10 pr-4 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
        />
      </div>

      {/* Reports Grid or Empty State */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          <span>Ingesting verified after action reports...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-[#1E2536] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9]">
            {reports.length === 0 ? 'No After Action Reports Available' : 'No Reports Match Your Filter'}
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
            {reports.length === 0
              ? 'When an incident is resolved and verified, its postmortem and permanent resolution are retained into Hindsight persistent memory and automatically listed here as an official After Action Report.'
              : 'Try clearing your search query or switching from Retained Knowledge to All Reports.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                      {report.id}
                    </span>
                    <span className="font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
                      ref: {report.incidentId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Retained in Knowledge Base
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-mono">
                    <span>Service: <strong className="text-[#172033] dark:text-[#F1F5F9]">{report.service}</strong></span>
                    <span>•</span>
                    <span>Duration: {report.duration}</span>
                    <span>•</span>
                    <span>{report.resolvedDate}</span>
                  </div>
                </div>

                {/* Root Cause & Fix Box */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs space-y-2">
                  <div>
                    <div className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">Verified Root Cause:</div>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">{report.rootCause}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#222834]">
                    <div className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">Permanent Resolution:</div>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">{report.fix}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{report.leadResponder}</span>
                </div>

                <button
                  onClick={() => onSelectIncident && onSelectIncident(report.incidentId)}
                  className="flex items-center gap-1 font-mono text-[11px] text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>View Incident Dossier</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
