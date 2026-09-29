import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  User, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  BrainCircuit, 
  Database,
  Flame,
  Clock,
  Layers,
  Activity,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Server
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard: React.FC<{ 
  onSelectIncident: (id: string) => void;
  onStartInvestigation?: (id: string) => void;
  openCreateModal?: () => void;
}> = ({ onSelectIncident, onStartInvestigation, openCreateModal }) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [irRole, setIrRole] = useState<'lead' | 'second'>('lead');
  const [leaderRole, setLeaderRole] = useState<'lead' | 'second'>('lead');
  const [activeVisualTab, setActiveVisualTab] = useState<'dashboard' | 'memory' | 'analysis'>('dashboard');

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [incRes, sumRes] = await Promise.all([
          api.getIncidents(),
          api.getAnalyticsSummary()
        ]);
        setIncidents(incRes);
        setSummary(sumRes);
        setLastSynced(new Date());
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Listen to real-time SSE broadcasts
    const handleStreamUpdate = () => {
      loadData();
    };
    window.addEventListener('incident_stream_update', handleStreamUpdate);
    return () => window.removeEventListener('incident_stream_update', handleStreamUpdate);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Dynamically compute incident cards from live backend records
  const liveCards = incidents.map((inc) => {
    const isCritical = inc.severity === 'Critical';
    const isHigh = inc.severity === 'High';
    return {
      id: inc.id,
      title: inc.title,
      category: inc.service || 'Service',
      type: inc.service.includes('auth') ? 'Auth & JWT' : inc.service.includes('payment') ? 'Database' : 'Service Outage',
      severity: inc.severity,
      severityColor: isCritical ? 'border-red-500 text-red-500' : isHigh ? 'border-orange-500 text-orange-500' : 'border-amber-500 text-amber-500',
      leftStripe: isCritical ? 'border-l-4 border-l-red-500' : isHigh ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-blue-500',
      status: inc.status,
      statusStyle: inc.status === 'Resolved' || inc.status === 'Closed'
        ? 'border-emerald-500/60 text-emerald-600 bg-emerald-500/10'
        : 'border-amber-500/60 text-amber-600 bg-amber-500/10',
      assignee: inc.assignee || 'Unassigned',
      timeAgo: new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(inc.created_at).toLocaleDateString(),
      service: inc.service,
      isSynthetic: false
    };
  });

  // Strictly genuine incidents - zero synthetic fallbacks
  const myIncidents = liveCards;

  // Active Incidents Metric Cards dynamically derived from backend data
  const critCount = summary?.by_severity?.Critical ?? incidents.filter(i => i.severity === 'Critical').length;
  const highCount = summary?.by_severity?.High ?? incidents.filter(i => i.severity === 'High').length;
  const medCount = summary?.by_severity?.Medium ?? incidents.filter(i => i.severity === 'Medium').length;
  const lowCount = summary?.by_severity?.Low ?? incidents.filter(i => i.severity === 'Low').length;
  const totalCount = summary?.total_incidents ?? incidents.length;

  const activeMetrics = [
    { label: 'Total', count: totalCount, border: 'border-l-4 border-l-slate-800 dark:border-l-slate-300', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Info', count: 0, border: 'border-l-4 border-l-slate-400 dark:border-l-slate-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Low', count: lowCount, border: 'border-l-4 border-l-blue-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Medium', count: medCount, border: 'border-l-4 border-l-amber-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'High', count: highCount, border: 'border-l-4 border-l-orange-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Critical', count: critCount, border: 'border-l-4 border-l-red-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' }
  ];

  // Dynamic Incident Matrix rows derived strictly from real services
  const serviceGroups: Record<string, { reported: number; investigating: number; responding: number; contained: number; recovering: number; total: number }> = {};
  
  incidents.forEach(inc => {
    const svc = inc.service || 'Other';
    if (!serviceGroups[svc]) {
      serviceGroups[svc] = { reported: 0, investigating: 0, responding: 0, contained: 0, recovering: 0, total: 0 };
    }
    serviceGroups[svc].total += 1;
    if (inc.status === 'New') serviceGroups[svc].reported += 1;
    else if (inc.status === 'Investigating') serviceGroups[svc].investigating += 1;
    else if (inc.status === 'Mitigated') serviceGroups[svc].contained += 1;
    else if (inc.status === 'Resolved' || inc.status === 'Closed') serviceGroups[svc].recovering += 1;
    else serviceGroups[svc].responding += 1;
  });

  const matrixRows = Object.entries(serviceGroups).map(([svc, counts]) => ({
    category: svc,
    ...counts
  }));

  // Incident Leaders dynamically derived from real incident responder assignments
  const leaderMap: Record<string, number> = {};
  incidents.forEach(inc => {
    const name = inc.assignee || 'Unassigned';
    leaderMap[name] = (leaderMap[name] || 0) + 1;
  });

  const dynamicLeaders = Object.entries(leaderMap)
    .map(([name, count]) => ({
      name,
      title: name === 'Unassigned' ? 'Awaiting Dispatch' : leaderRole === 'lead' ? 'Incident Lead' : 'IR Secondary',
      count
    }))
    .sort((a, b) => b.count - a.count);

  // In Progress Improvements dynamically derived from resolved incidents with root causes or fixes
  const dynamicImprovements = incidents
    .filter(inc => inc.resolution || inc.verified_root_cause)
    .map(inc => ({
      title: inc.resolution ? (inc.resolution.length > 55 ? inc.resolution.slice(0, 55) + '...' : inc.resolution) : (inc.verified_root_cause || inc.title),
      sub: `${inc.service} • ${inc.id}`,
      assignee: inc.assignee || 'Unassigned'
    }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-[#172033] dark:text-[#F1F5F9] transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] font-sans">
          Dashboard
        </h1>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Incident</span>
        </button>
      </div>

      {/* Live Data Provenance Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-[#222834] text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#172033] dark:text-[#F1F5F9]">Live Telemetry Stream</span>
          <span>•</span>
          <span>Provenance: Persisted Database & Vectorize Hindsight Cloud</span>
        </div>
        <div>
          Last Synced: <span className="text-[#172033] dark:text-[#F1F5F9]">{lastSynced.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Grid: Left Column (~68%) & Right Column (~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Section: My Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] tracking-tight">
                My Incidents
              </h2>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1E2536] transition-colors cursor-pointer"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1E2536] transition-colors cursor-pointer"
                  title="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Segmented control: IR Lead / IR Second */}
            <div className="flex w-full rounded-xl bg-[#F8FAFC] dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] p-1 text-xs">
              <button
                onClick={() => setIrRole('lead')}
                className={`flex-1 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  irRole === 'lead'
                    ? 'bg-white dark:bg-[#1F2633] text-[#172033] dark:text-[#F1F5F9] shadow-xs font-semibold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
                }`}
              >
                IR Lead
              </button>
              <button
                onClick={() => setIrRole('second')}
                className={`flex-1 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  irRole === 'second'
                    ? 'bg-white dark:bg-[#1F2633] text-[#172033] dark:text-[#F1F5F9] shadow-xs font-semibold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
                }`}
              >
                IR Second
              </button>
            </div>

            {/* Carousel / Cards Track */}
            <div 
              ref={carouselRef}
              className="flex items-stretch gap-4 overflow-x-auto pb-2 scrollbar-none snap-x"
            >
              {myIncidents.length === 0 ? (
                <div className="w-full p-8 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9]">All Systems Normal — No Active Incidents</div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
                    No active incidents assigned or reported in this environment. Incidents ingested via API, Webhooks, or Slack will automatically appear in real time.
                  </p>
                </div>
              ) : (
                myIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => onSelectIncident(inc.id)}
                    className={`w-72 min-w-[280px] p-4 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] ${inc.leftStripe} shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between gap-3 group snap-start`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-[#172033] dark:text-[#F1F5F9] leading-snug group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {inc.title}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono leading-none">
                            {inc.category}
                          </div>
                          <div className="text-[10px] text-[#DC2626] dark:text-red-400 font-bold font-mono mt-0.5">
                            {inc.type}
                          </div>
                          <div className={`text-[10px] font-mono font-bold mt-0.5 ${
                            inc.severity === 'Critical' ? 'text-red-600 dark:text-red-400' : 'text-orange-500'
                          }`}>
                            {inc.severity}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${inc.statusStyle}`}>
                          {inc.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E2430] text-[11px] text-[#64748B] dark:text-[#94A3B8] space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3 h-3 text-[#94A3B8]" />
                        <span className="truncate">{inc.assignee}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>{inc.timeAgo}</span>
                        <span>{inc.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Section: Active Incidents */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] tracking-tight">
              Active Incidents
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {activeMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#222834] ${m.bg} ${m.border} shadow-xs flex flex-col justify-between`}
                >
                  <div className="text-2xl font-black font-mono tracking-tight text-[#172033] dark:text-[#F1F5F9]">
                    {m.count}
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Section: Incident Matrix */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] tracking-tight">
              Incident Matrix
            </h2>

            <div className="bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] dark:bg-[#181D26] border-b border-[#E2E8F0] dark:border-[#222834] text-[#64748B] dark:text-[#94A3B8] font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Category</th>
                      <th className="py-2.5 px-3 font-medium text-center">Reported</th>
                      <th className="py-2.5 px-3 font-medium text-center">Investigating</th>
                      <th className="py-2.5 px-3 font-medium text-center">Responding</th>
                      <th className="py-2.5 px-3 font-medium text-center">Contained</th>
                      <th className="py-2.5 px-3 font-medium text-center">Recovering</th>
                      <th className="py-2.5 px-4 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
                    {matrixRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                          No service disruptions detected across tracked clusters.
                        </td>
                      </tr>
                    ) : (
                      matrixRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC] dark:hover:bg-[#181D26]/60 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#172033] dark:text-[#F1F5F9]">
                            {row.category}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.reported > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-red-500">
                                <span className="w-2 h-2 rounded-full bg-red-500" /> {row.reported}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] dark:text-[#475569] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.investigating > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-500">
                                <span className="w-2 h-2 rounded-full bg-amber-500" /> {row.investigating}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] dark:text-[#475569] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.responding > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-orange-500">
                                <span className="w-2 h-2 rounded-full bg-orange-500" /> {row.responding}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] dark:text-[#475569] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.contained > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-purple-500">
                                <span className="w-2 h-2 rounded-full bg-purple-500" /> {row.contained}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] dark:text-[#475569] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {row.recovering > 0 ? (
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-blue-500">
                                <span className="w-2 h-2 rounded-full bg-blue-500" /> {row.recovering}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] dark:text-[#475569] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#172033] dark:text-[#F1F5F9]">
                            {row.total}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Incident Leaders Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] tracking-tight">
              Incident Leaders
            </h2>

            {/* Segmented control: IR Lead / IR Second */}
            <div className="flex w-full rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] p-1 text-xs">
              <button
                onClick={() => setLeaderRole('lead')}
                className={`flex-1 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  leaderRole === 'lead'
                    ? 'bg-white dark:bg-[#252D3D] text-[#172033] dark:text-[#F1F5F9] shadow-xs font-semibold'
                    : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                IR Lead
              </button>
              <button
                onClick={() => setLeaderRole('second')}
                className={`flex-1 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  leaderRole === 'second'
                    ? 'bg-white dark:bg-[#252D3D] text-[#172033] dark:text-[#F1F5F9] shadow-xs font-semibold'
                    : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                IR Second
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] dark:border-[#222834] text-[#64748B] dark:text-[#94A3B8] font-mono text-[11px]">
                  <tr>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
                  {dynamicLeaders.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                        No responder activity logged yet.
                      </td>
                    </tr>
                  ) : (
                    dynamicLeaders.map((ldr, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC] dark:hover:bg-[#181D26]/50">
                        <td className="py-2.5 font-semibold text-[#172033] dark:text-[#F1F5F9]">
                          {ldr.name}
                        </td>
                        <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8] font-sans">
                          {ldr.title}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold text-[#172033] dark:text-[#F1F5F9]">
                          {ldr.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. In Progress Improvements Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] tracking-tight">
              In Progress Improvements
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8F0] dark:border-[#222834] text-[#64748B] dark:text-[#94A3B8] font-mono text-[11px]">
                  <tr>
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Assignee</th>
                    <th className="pb-2 font-medium text-right">...</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
                  {dynamicImprovements.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                        No post-incident improvements recorded yet.
                      </td>
                    </tr>
                  ) : (
                    dynamicImprovements.map((imp, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC] dark:hover:bg-[#181D26]/50 group">
                        <td className="py-2.5 pr-2">
                          <div className="font-semibold text-[#172033] dark:text-[#F1F5F9] leading-snug group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 cursor-pointer">
                            {imp.title}
                          </div>
                          <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono mt-0.5">
                            {imp.sub}
                          </div>
                        </td>
                        <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8] text-[11px] whitespace-nowrap">
                          {imp.assignee}
                        </td>
                        <td className="py-2.5 text-right">
                          <button className="text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] p-1 cursor-pointer">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* 4. VISUAL INTELLIGENCE & INVESTIGATION FLOW */}
      <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-500" />
              <span>Incident Intelligence & Diagnostic Flow</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Correlate active symptoms with proven historical resolutions.
            </p>
          </div>

          {/* Visual Tabs */}
          <div className="flex items-center rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] p-1 border border-[#E2E8F0] dark:border-[#222834] text-xs">
            <button
              onClick={() => setActiveVisualTab('dashboard')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeVisualTab === 'dashboard' 
                  ? 'bg-white dark:bg-[#252D3D] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveVisualTab('memory')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeVisualTab === 'memory' 
                  ? 'bg-white dark:bg-[#252D3D] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              Past Knowledge
            </button>
            <button
              onClick={() => setActiveVisualTab('analysis')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeVisualTab === 'analysis' 
                  ? 'bg-white dark:bg-[#252D3D] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              Root Cause Tree
            </button>
          </div>
        </div>

        {/* Visual Content Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          <div className="md:col-span-7 rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-[#222834] bg-slate-950 shadow-sm relative group">
            <img 
              src={
                activeVisualTab === 'dashboard'
                  ? '/images/incidentmind/hero-dashboard.png'
                  : activeVisualTab === 'memory'
                  ? '/images/incidentmind/persistent-memory.png'
                  : '/images/incidentmind/root-cause-analysis.png'
              } 
              alt="Incident Overview"
              className="w-full h-60 md:h-64 object-cover group-hover:scale-101 transition-transform duration-300"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/90">
              {activeVisualTab === 'dashboard' ? 'Real-Time Incident Telemetry' : activeVisualTab === 'memory' ? 'Retained Historical Solutions' : 'Automated Diagnostic Breakdown'}
            </div>
          </div>

          <div className="md:col-span-5 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834]">
              <div className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">
                Instant Historical Context
              </div>
              <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
                Surfaces previously verified fixes the moment an alert triggers.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834]">
              <div className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">
                Actionable Safe Steps
              </div>
              <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
                Guided runbook recommendations with human confirmation.
              </div>
            </div>

            <div className="pt-1">
              {onStartInvestigation && (
                <button
                  onClick={() => onStartInvestigation(incidents[0]?.id || 'INC-11790C')}
                  className="w-full py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Investigation Studio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
