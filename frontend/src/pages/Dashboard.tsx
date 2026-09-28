import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Clock, 
  Brain, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Server 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { SeverityBadge, Button } from '../components/ui';

export const Dashboard: React.FC<{ 
  onSelectIncident: (id: string) => void;
  onStartInvestigation?: (id: string) => void;
}> = ({ onSelectIncident, onStartInvestigation }) => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, trRes, incRes] = await Promise.all([
          api.getAnalyticsSummary(),
          api.getAnalyticsTrends(),
          api.getIncidents()
        ]);
        setSummary(sumRes);
        setTrends(trRes);
        setIncidents(incRes);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#64748B] font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <span>Loading SRE Executive Telemetry & Hindsight Memories...</span>
      </div>
    );
  }

  const mttrValue = String(summary?.mean_time_to_resolve_minutes ?? 18) + 'm';
  const criticalIncident = incidents.find(i => i.severity === 'Critical' && i.status !== 'Resolved');

  const kpis = [
    {
      title: 'Active Production Incidents',
      value: summary?.open_incidents ?? 0,
      icon: Flame,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
      badge: 'Active Outages',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      title: 'Mean Time to Resolution (MTTR)',
      value: mttrValue,
      icon: Clock,
      iconColor: 'text-[#4F46E5]',
      iconBg: 'bg-[#EEF2FF]',
      badge: '-42% with Hindsight',
      badgeClass: 'bg-indigo-50 text-[#4F46E5] border-indigo-200 font-semibold',
    },
    {
      title: 'Verified Memories in Bank',
      value: summary?.total_hindsight_memories ?? 0,
      icon: Brain,
      iconColor: 'text-[#4F46E5]',
      iconBg: 'bg-[#EEF2FF]',
      badge: 'TEMPR Indexed',
      badgeClass: 'bg-indigo-50 text-[#4F46E5] border-indigo-200',
    },
    {
      title: 'Total Retained Resolutions',
      value: summary?.resolved_incidents ?? 0,
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      badge: '100% Provenance',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Critical Alert Banner if Active */}
      {criticalIncident && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity="Critical" />
                <span className="font-mono text-xs text-red-700 font-bold">{criticalIncident.id}</span>
                <span className="text-xs text-[#64748B]">on service <span className="text-[#172033] font-mono font-semibold">{criticalIncident.service}</span></span>
              </div>
              <h3 className="text-sm font-semibold text-[#172033] mt-0.5">{criticalIncident.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <span className="text-xs font-mono text-[#64748B] hidden lg:inline">Hindsight Match: <span className="text-[#4F46E5] font-bold">98%</span></span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => (onStartInvestigation ? onStartInvestigation(criticalIncident.id) : onSelectIncident(criticalIncident.id))}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Launch AI Studio
            </Button>
          </div>
        </div>
      )}

      {/* Header with Cluster Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#172033] flex items-center gap-2">
            Executive SRE Operations Dashboard
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Continuous telemetry, recurring incident signatures, and Hindsight persistent memory acceleration.
          </p>
        </div>
        <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] flex items-center gap-2 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Environment: <span className="text-[#172033] font-semibold">Production Multi-Cluster</span></span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs relative overflow-hidden transition-colors hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.iconBg}`}>
                  <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold font-mono tracking-tight text-[#172033]">{kpi.value}</div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${kpi.badgeClass}`}>
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
                <span>Incident Investigations & Memory Recall Assists</span>
                <span className="text-[10px] font-mono text-[#4F46E5] bg-[#EEF2FF] border border-indigo-100 px-2 py-0.5 rounded-full font-medium">TEMPR</span>
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">Volume of active outages vs investigations accelerated by Hindsight past memory</p>
            </div>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.daily_volume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', color: '#172033', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="incidents" name="Total Incidents" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recalled_assists" name="Hindsight Assisted" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#172033]">Severity Breakdown</h3>
          <div className="space-y-3">
            {summary?.by_severity && Object.entries(summary.by_severity).map(([sev, count]: [string, any]) => {
              return (
                <div key={sev} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={sev} />
                  </div>
                  <span className="font-mono text-[#172033] font-semibold">{count} active</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#172033] mb-2.5">Top Critical Services</h3>
            <div className="space-y-2">
              {summary?.by_service && Object.entries(summary.by_service).map(([srv, count]: [string, any]) => (
                <div key={srv} className="flex items-center justify-between text-xs font-mono text-[#172033] p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#172033] font-medium">{srv}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Incident Signatures */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
              <span>Recurring Production Incident Signatures</span>
              <span className="text-[10px] font-mono text-[#4F46E5] bg-[#EEF2FF] border border-indigo-100 px-2 py-0.5 rounded-full font-medium">Automated Signature Detection</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Recurring failure patterns recognized by Hindsight memory bank across deployment cycles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {trends?.recurring_signatures?.map((sig: any, idx: number) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-indigo-200 hover:bg-[#EEF2FF]/30 transition-colors flex flex-col justify-between gap-3 cursor-pointer group shadow-xs"
              onClick={() => onSelectIncident(incidents[0]?.id || 'INC-CEC3A6')}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#172033] text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#4F46E5]" />
                    {sig.service}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-[10px] font-mono font-medium">
                    {sig.status}
                  </span>
                </div>
                <div className="text-xs text-[#172033] font-medium">
                  {sig.pattern}
                </div>
                <div className="text-[11px] text-[#64748B] font-mono">
                  {sig.occurrences} historical occurrences documented in Hindsight memory
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#4F46E5] font-mono group-hover:text-[#4338CA]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3" /> Quick AI Triage
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
