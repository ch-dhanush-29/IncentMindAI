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
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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

  // Mock / enriched card list matching screenshot
  const myIncidents = [
    {
      id: 'INC-SEC-019',
      title: 'Generic Phishing Incident',
      category: 'Incident',
      type: 'Phishing',
      severity: 'Critical',
      severityColor: 'border-red-500 text-red-500',
      leftStripe: 'border-l-4 border-l-red-500',
      status: 'Resolved',
      statusStyle: 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10',
      assignee: 'Ryan Cox Administrator',
      timeAgo: '116d ago',
      date: '5/17/2025',
      service: 'identity-gateway'
    },
    {
      id: 'INC-SEC-034',
      title: 'Data Leak Suspected',
      category: 'Incident',
      type: 'Data Breach',
      severity: 'High',
      severityColor: 'border-orange-500 text-orange-500',
      leftStripe: 'border-l-4 border-l-orange-500',
      status: 'Responding',
      statusStyle: 'border-orange-500/60 text-orange-400 bg-orange-500/10',
      assignee: 'Ryan Cox Administrator',
      timeAgo: '44d ago',
      date: '7/28/2025',
      service: 'marketing-portal'
    },
    {
      id: 'INC-SEC-055',
      title: 'Testing Again Slack/Jira',
      category: 'Incident',
      type: 'Phishing',
      severity: 'High',
      severityColor: 'border-amber-500 text-amber-500',
      leftStripe: 'border-l-4 border-l-amber-500',
      status: 'Reported',
      statusStyle: 'border-blue-500/60 text-blue-400 bg-blue-500/10',
      assignee: 'Ryan Cox Administrator',
      timeAgo: '17d ago',
      date: '8/24/2025',
      service: 'slack-bot-service'
    },
    {
      id: incidents[0]?.id || 'INC-11790C',
      title: incidents[0]?.title || 'PostgreSQL Connection Pool Saturation Under Peak Checkout Load',
      category: 'Infrastructure',
      type: 'Database',
      severity: 'Critical',
      severityColor: 'border-red-500 text-red-500',
      leftStripe: 'border-l-4 border-l-red-500',
      status: 'Investigating',
      statusStyle: 'border-amber-500/60 text-amber-400 bg-amber-500/10',
      assignee: 'Incident Commander',
      timeAgo: '2h ago',
      date: 'Today',
      service: 'payment-api'
    },
    {
      id: incidents[1]?.id || 'INC-24748B',
      title: incidents[1]?.title || 'Auth Service Authentication Token Cache Stampede',
      category: 'Authentication',
      type: 'SSO & JWT',
      severity: 'High',
      severityColor: 'border-orange-500 text-orange-500',
      leftStripe: 'border-l-4 border-l-orange-500',
      status: 'Mitigated',
      statusStyle: 'border-purple-500/60 text-purple-400 bg-purple-500/10',
      assignee: 'Ryan Cox (Analyst)',
      timeAgo: '1d ago',
      date: 'Yesterday',
      service: 'auth-service'
    }
  ];

  // Active Incidents Metric Cards
  const activeMetrics = [
    { label: 'Total', count: 12, border: '', bg: 'bg-[#161B22] dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Info', count: 0, border: 'border-l-4 border-l-slate-400', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Low', count: 1, border: 'border-l-4 border-l-blue-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Medium', count: 2, border: 'border-l-4 border-l-amber-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'High', count: 5, border: 'border-l-4 border-l-orange-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' },
    { label: 'Critical', count: 4, border: 'border-l-4 border-l-red-500', bg: 'bg-white dark:bg-[#161B22]', text: 'text-[#172033] dark:text-[#F1F5F9]' }
  ];

  // Incident Matrix rows
  const matrixRows = [
    { category: 'CVE', reported: 1, investigating: 0, responding: 0, contained: 0, recovering: 0, total: 1 },
    { category: 'Data Breach', reported: 1, investigating: 0, responding: 1, contained: 0, recovering: 0, total: 2 },
    { category: 'Infrastructure & DB', reported: 0, investigating: 1, responding: 0, contained: 1, recovering: 0, total: 2 },
    { category: 'Authentication & SSO', reported: 0, investigating: 0, responding: 1, contained: 0, recovering: 1, total: 2 },
    { category: 'Payment Gateway', reported: 0, investigating: 1, responding: 0, contained: 0, recovering: 0, total: 1 },
    { category: 'Phishing & Social', reported: 1, investigating: 0, responding: 0, contained: 1, recovering: 0, total: 2 }
  ];

  // Incident Leaders Table
  const incidentLeaders = irRole === 'lead' ? [
    { name: 'Ryan Cox Administrator', title: 'Lead Security Engineer', count: 6 },
    { name: 'Ryan Cox (Analyst)', title: 'Security Analyst', count: 3 },
    { name: 'Sam Hassanzadeh', title: 'Sales Engineer', count: 2 },
    { name: 'Ryan Cox', title: 'IR Lead', count: 1 }
  ] : [
    { name: 'Elena Rostova', title: 'Principal SRE', count: 5 },
    { name: 'Carlos Ruiz', title: 'Infrastructure Lead', count: 4 },
    { name: 'Jane Smith', title: 'DBA Engineer', count: 2 },
    { name: 'John Doe', title: 'SecOps Responder', count: 1 }
  ];

  // In Progress Improvements
  const improvements = [
    { title: '123 Test', sub: 'Jira Assign ID Test', assignee: 'Ryan Cox (Analyst)' },
    { title: 'Testing Improvement Items', sub: 'Jira Assign ID Test', assignee: 'Ryan Cox (Analyst)' },
    { title: '789 improve 10', sub: 'Generic Phishing Incident', assignee: 'Unassigned' },
    { title: 'Deploy pgbouncer pool buffer', sub: 'PostgreSQL connection saturation', assignee: 'Carlos Ruiz' },
    { title: 'Add HikariCP thread pool alert', sub: 'Payment API Latency Spike', assignee: 'Jane Smith' },
    { title: 'Enforce hardware MFA on admin accounts', sub: 'Data Leak from Marketing Account', assignee: 'John Doe' }
  ];

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
              {myIncidents.map((inc) => (
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

                    <div className="pt-1">
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
              ))}
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
                    {matrixRows.map((row, idx) => (
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
                    ))}
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
                  {incidentLeaders.map((ldr, idx) => (
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
                  ))}
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
                  {improvements.map((imp, idx) => (
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
                  ))}
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
