import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  RotateCcw, 
  LogIn, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  Search, 
  Filter,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../services/api';
import type { UserActivity, UserSummary } from '../types/incident';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIncident?: (incidentId: string) => void;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectIncident
}) => {
  const { user, isSignedIn } = useUser();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const userEmail = user?.primaryEmailAddress?.emailAddress || 'commander@incidentmind.ai';
  const userName = user?.fullName || user?.firstName || 'Incident Commander';
  const userId = user?.id || 'unknown';
  const avatarUrl = user?.imageUrl;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [historyData, summaryData] = await Promise.all([
        api.getUserHistory(userEmail, userId, selectedFilter === 'ALL' ? undefined : selectedFilter, 200),
        api.getUserSummary(userEmail, userId)
      ]);
      setActivities(historyData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load user history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, selectedFilter, userEmail, userId]);

  if (!isOpen) return null;

  // Filter activities by search query
  const filteredActivities = activities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      act.action_type.toLowerCase().includes(query) ||
      act.details.toLowerCase().includes(query) ||
      (act.incident_id && act.incident_id.toLowerCase().includes(query)) ||
      (act.incident_title && act.incident_title.toLowerCase().includes(query))
    );
  });

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'INCIDENT_DECLARED':
        return {
          icon: ShieldAlert,
          label: 'Incident Declared',
          bg: 'bg-red-50 dark:bg-red-950/40',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-900/50'
        };
      case 'INVESTIGATION_RUN':
        return {
          icon: Cpu,
          label: 'AI Investigation',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40',
          text: 'text-indigo-700 dark:text-indigo-400',
          border: 'border-indigo-200 dark:border-indigo-900/50'
        };
      case 'NOTE_ADDED':
        return {
          icon: FileText,
          label: 'Note Added',
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-900/50'
        };
      case 'POSTMORTEM_RETAINED':
        return {
          icon: CheckCircle2,
          label: 'Postmortem Retained',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-900/50'
        };
      case 'COPILOT_QUERY':
        return {
          icon: MessageSquare,
          label: 'Copilot Inquired',
          bg: 'bg-sky-50 dark:bg-sky-950/40',
          text: 'text-sky-700 dark:text-sky-400',
          border: 'border-sky-200 dark:border-sky-900/50'
        };
      case 'INCIDENT_REOPENED':
        return {
          icon: RotateCcw,
          label: 'Incident Reopened',
          bg: 'bg-orange-50 dark:bg-orange-950/40',
          text: 'text-orange-700 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-900/50'
        };
      case 'SESSION_START':
      case 'LOGIN':
        return {
          icon: LogIn,
          label: 'Session Active',
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-900/50'
        };
      default:
        return {
          icon: History,
          label: type.replace('_', ' '),
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700'
        };
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `user-activity-${userEmail}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return {
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } catch {
      return { date: isoStr, time: '' };
    }
  };

  const filterOptions = [
    { id: 'ALL', label: 'All Activities' },
    { id: 'INCIDENT_DECLARED', label: 'Declarations' },
    { id: 'INVESTIGATION_RUN', label: 'Investigations' },
    { id: 'NOTE_ADDED', label: 'Notes' },
    { id: 'POSTMORTEM_RETAINED', label: 'Postmortems' },
    { id: 'COPILOT_QUERY', label: 'Copilot Queries' },
    { id: 'INCIDENT_REOPENED', label: 'Reopened' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#1E2430] w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#172033] dark:text-[#F1F5F9]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1E2430] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#12161F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Account Activity History</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  Persisted
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Lifetime action history and audit log associated with your login account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-white dark:hover:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] transition-colors cursor-pointer"
              title="Refresh Activity History"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4F46E5]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-white dark:hover:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* User Account Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#141822] border border-[#E2E8F0] dark:border-[#1E2430] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={userName} 
                  className="w-12 h-12 rounded-xl border border-indigo-200 dark:border-indigo-800 object-cover shadow-xs" 
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm leading-tight">{userName}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    {isSignedIn ? 'Clerk SSO' : 'SRE Sandbox'}
                  </span>
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono mt-0.5">
                  {userEmail}
                </div>
                {userId && userId !== 'unknown' && (
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    User ID: {userId}
                  </div>
                )}
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 border-t md:border-t-0 md:border-l border-[#E2E8F0] dark:border-[#222834] pt-3 md:pt-0 md:pl-4">
              <div className="text-center px-2 py-1 rounded-lg bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834]">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Total</div>
                <div className="text-sm font-bold text-[#4F46E5] dark:text-indigo-400">
                  {summary?.total_actions ?? activities.length}
                </div>
              </div>
              <div className="text-center px-2 py-1 rounded-lg bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834]">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Declared</div>
                <div className="text-sm font-bold text-red-600 dark:text-red-400">
                  {summary?.incidents_declared ?? 0}
                </div>
              </div>
              <div className="text-center px-2 py-1 rounded-lg bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834]">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Investigated</div>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {summary?.investigations_run ?? 0}
                </div>
              </div>
              <div className="text-center px-2 py-1 rounded-lg bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834]">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Notes</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {summary?.notes_added ?? 0}
                </div>
              </div>
              <div className="text-center px-2 py-1 rounded-lg bg-white dark:bg-[#0E1117] border border-[#E2E8F0] dark:border-[#222834]">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Postmortems</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {summary?.postmortems_retained ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Search + Filter Pills */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFilter(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedFilter === opt.id
                        ? 'bg-[#4F46E5] text-white shadow-xs font-semibold'
                        : 'bg-[#F8FAFC] dark:bg-[#141822] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#222834] hover:bg-slate-100 dark:hover:bg-[#1E2430]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter history records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#141822] border border-[#E2E8F0] dark:border-[#222834] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="border border-[#E2E8F0] dark:border-[#1E2430] rounded-xl overflow-hidden bg-white dark:bg-[#0B0D11]">
            <div className="px-4 py-2.5 border-b border-[#E2E8F0] dark:border-[#1E2430] bg-[#F8FAFC] dark:bg-[#12161F] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Chronological Events ({filteredActivities.length})</span>
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Sorted newest first
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-[#64748B] dark:text-[#94A3B8] flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#4F46E5]" />
                <span>Loading your persistent activity records...</span>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] dark:text-[#94A3B8] flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                <p className="font-medium text-[#172033] dark:text-[#F1F5F9]">No activity records found</p>
                <p className="text-[11px] max-w-sm">
                  {searchQuery 
                    ? `No events match "${searchQuery}". Try clearing the search query.` 
                    : `No ${selectedFilter === 'ALL' ? '' : selectedFilter.toLowerCase()} actions recorded for this login account yet.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E2430] max-h-[420px] overflow-y-auto">
                {filteredActivities.map((act) => {
                  const badge = getActionBadge(act.action_type);
                  const Icon = badge.icon;
                  const time = formatTimestamp(act.timestamp);

                  return (
                    <div 
                      key={act.id} 
                      className="p-4 hover:bg-[#F8FAFC] dark:hover:bg-[#141822]/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl border ${badge.bg} ${badge.text} ${badge.border} flex-shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] dark:text-[#64748B] font-mono">
                              {act.id}
                            </span>
                          </div>

                          <p className="text-xs text-[#172033] dark:text-[#F1F5F9] font-medium leading-relaxed">
                            {act.details}
                          </p>

                          {/* Related Incident link */}
                          {act.incident_id && (
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (act.incident_id && onSelectIncident) {
                                    onSelectIncident(act.incident_id);
                                    onClose();
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 text-[#4F46E5] dark:text-indigo-400 font-mono text-[11px] font-medium transition-colors cursor-pointer group"
                              >
                                <span>{act.incident_id}</span>
                                {act.incident_title && <span className="font-sans font-normal text-slate-600 dark:text-slate-400 truncate max-w-[200px]">• {act.incident_title}</span>}
                                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 sm:self-start pl-11 sm:pl-0">
                        <div className="text-[11px] font-mono text-[#172033] dark:text-[#F1F5F9]">
                          {time.time}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] dark:text-[#64748B]">
                          {time.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] dark:border-[#1E2430] bg-[#F8FAFC] dark:bg-[#12161F] flex items-center justify-between">
          <button
            onClick={handleExportJSON}
            disabled={activities.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#2D3545] hover:bg-white dark:hover:bg-[#1E2430] text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-50"
            title="Download full JSON history"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (JSON)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
