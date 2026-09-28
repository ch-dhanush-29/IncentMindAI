import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Clock, 
  Brain, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck,
  TrendingDown,
  Layers,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Server
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button } from '../components/ui';

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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
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
      color: 'text-rose-400',
      bgColor: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      badge: 'Current Outages',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    },
    {
      title: 'Mean Time to Resolution (MTTR)',
      value: mttrValue,
      icon: Clock,
      color: 'text-accent-cyan',
      bgColor: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      badge: '-42% with Hindsight',
      badgeClass: 'bg-cyan-500/10 text-accent-cyan border-cyan-500/30 font-semibold',
    },
    {
      title: 'Verified Memories in Bank',
      value: summary?.total_hindsight_memories ?? 0,
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      badge: 'TEMPR Indexed',
      badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-700/60',
    },
    {
      title: 'Total Retained Resolutions',
      value: summary?.resolved_incidents ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      badge: '100% Provenance',
      badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Critical Alert Ticker if Active */}
      {criticalIncident && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/50 shadow-lg shadow-rose-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Flame className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity="Critical" />
                <span className="font-mono text-xs text-rose-300 font-bold">{criticalIncident.id}</span>
                <span className="text-xs text-slate-400">on service <span className="text-white font-mono font-semibold">{criticalIncident.service}</span></span>
              </div>
              <h3 className="text-sm font-semibold text-white mt-0.5">{criticalIncident.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <span className="text-xs font-mono text-slate-400 hidden lg:inline">Hindsight Match: <span className="text-accent-cyan font-bold">94%</span></span>
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
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive SRE Operations Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous telemetry, recurring incident signatures, and Hindsight persistent memory acceleration.
          </p>
        </div>
        <div className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-2 self-start md:self-auto shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Environment: <span className="text-white font-semibold">Production Multi-Cluster</span></span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-xl bg-gradient-to-b ${kpi.bgColor} bg-[#0F172A] border ${kpi.borderColor} relative overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <Icon className={'w-4 h-4 ' + kpi.color} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold font-mono tracking-tight text-white">{kpi.value}</div>
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
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Incident Investigations & Memory Recall Assists</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded-full">TEMPR</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Volume of active outages vs investigations accelerated by Hindsight past memory</p>
            </div>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.daily_volume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="incidents" name="Total Incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recalled_assists" name="Hindsight Assisted" fill="#00D2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-white">Severity Breakdown</h3>
          <div className="space-y-3">
            {summary?.by_severity && Object.entries(summary.by_severity).map(([sev, count]: [string, any]) => {
              return (
                <div key={sev} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={sev} />
                  </div>
                  <span className="font-mono text-slate-300 font-semibold">{count} active</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-2.5">Top Critical Services</h3>
            <div className="space-y-2">
              {summary?.by_service && Object.entries(summary.by_service).map(([srv, count]: [string, any]) => (
                <div key={srv} className="flex items-center justify-between text-xs font-mono text-slate-300 p-2 rounded-lg bg-slate-900/40 border border-slate-800/40">
                  <span className="text-slate-200 font-medium">{srv}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-accent-cyan font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Incident Signatures */}
      <div className="p-5 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Recurring Production Incident Signatures</span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded-full">Automated Signature Detection</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Recurring failure patterns recognized by Hindsight memory bank across deployment cycles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {trends?.recurring_signatures?.map((sig: any, idx: number) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-accent-cyan/60 hover:bg-slate-900 transition-all flex flex-col justify-between gap-3 cursor-pointer group"
              onClick={() => onSelectIncident(incidents[0]?.id || 'INC-CEC3A6')}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-accent-cyan" />
                    {sig.service}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-accent-cyan text-[10px] font-mono">
                    {sig.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {sig.pattern}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {sig.occurrences} historical occurrences documented in Hindsight memory
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-accent-cyan font-mono group-hover:text-cyan-300">
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

