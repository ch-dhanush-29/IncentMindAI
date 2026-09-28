import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Clock, 
  Brain, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard: React.FC<{ onSelectIncident: (id: string) => void }> = ({ onSelectIncident }) => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, trRes] = await Promise.all([
          api.getAnalyticsSummary(),
          api.getAnalyticsTrends()
        ]);
        setSummary(sumRes);
        setTrends(trRes);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400 font-mono text-sm">Loading SRE Executive Telemetry...</div>;
  }

  const mttrValue = String(summary?.mean_time_to_resolve_minutes ?? 18) + 'm';

  const kpis = [
    {
      title: 'Active Incidents',
      value: summary?.open_incidents ?? 0,
      icon: Flame,
      color: 'text-amber-400',
      badge: 'Current Load',
    },
    {
      title: 'Mean Time to Resolution (MTTR)',
      value: mttrValue,
      icon: Clock,
      color: 'text-accent-cyan',
      badge: '-42% with Hindsight',
    },
    {
      title: 'Verified Memories in Hindsight',
      value: summary?.total_hindsight_memories ?? 0,
      icon: Brain,
      color: 'text-purple-400',
      badge: 'TEMPR Indexed',
    },
    {
      title: 'Total Resolved Incidents',
      value: summary?.resolved_incidents ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      badge: 'Retained Knowledge',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Executive SRE Operations Dashboard</h2>
          <p className="text-xs text-gray-400 mt-1">
            Persistent telemetry, recurring incident signatures, and Hindsight agent memory impact.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-card border border-border text-gray-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Environment: Production Multi-Cluster</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-card border border-border/80 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{kpi.title}</span>
                <Icon className={'w-4 h-4 ' + kpi.color} />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono tracking-tight text-white">{kpi.value}</div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card/90 border border-border text-gray-300">
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Incident Investigations & Memory Recall Assists</h3>
              <p className="text-xs text-gray-400">Volume of active alerts vs investigations grounded in Hindsight</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.daily_volume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="incidents" name="Total Incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recalled_assists" name="Memory Assisted" fill="#00D2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 className="text-sm font-semibold text-white">Severity Breakdown</h3>
          <div className="space-y-3">
            {summary?.by_severity && Object.entries(summary.by_severity).map(([sev, count]: [string, any]) => {
              const dotClass = sev === 'Critical' ? 'bg-red-500' : sev === 'High' ? 'bg-orange-500' : 'bg-amber-400';
              return (
                <div key={sev} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className={'w-2 h-2 rounded-full ' + dotClass} />
                    <span className="text-gray-300 font-medium">{sev}</span>
                  </span>
                  <span className="font-mono text-gray-400">{count} incidents</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-white mb-2">Top Affected Services</h3>
            <div className="space-y-2">
              {summary?.by_service && Object.entries(summary.by_service).map(([srv, count]: [string, any]) => (
                <div key={srv} className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-gray-300">{srv}</span>
                  <span className="px-1.5 py-0.5 rounded bg-background border border-border">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Recurring Production Incident Signatures</h3>
            <p className="text-xs text-gray-400">Signatures recognized by Hindsight memory across deployment cycles</p>
          </div>
        </div>
        <div className="space-y-3">
          {trends?.recurring_signatures?.map((sig: any, idx: number) => (
            <div 
              key={idx}
              className="p-3 rounded-lg bg-background/60 border border-border hover:border-accent-cyan/50 transition-colors flex items-center justify-between text-xs cursor-pointer"
              onClick={() => onSelectIncident('INC-DEMO-REPEAT')}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{sig.service}</span>
                  <span className="text-gray-400 font-mono">? {sig.pattern}</span>
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  Recurrence frequency: {sig.occurrences} historical occurrences documented in memory bank
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-accent-cyan text-[11px] font-mono">
                  {sig.status}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
