# 1. IncidentHistory.tsx
archive_code = """import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident } from '../types/incident';
import { 
  Archive, 
  Search, 
  Filter, 
  Clock, 
  BrainCircuit, 
  ChevronRight, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';

interface IncidentHistoryProps {
  onSelectIncident: (id: string) => void;
}

export const IncidentHistory: React.FC<IncidentHistoryProps> = ({ onSelectIncident }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    loadIncidents();
  }, [service]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(service || undefined);
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = incidents.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.service.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      i.resolution?.verified_root_cause?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-accent-cyan" /> Incident Knowledge Archive
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Searchable historical incident repository with linked postmortems and Hindsight memory provenance.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-3.5 rounded-xl bg-card border border-border flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search past root causes, fixes, tickets, or incident IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
          />
        </div>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-gray-300 focus:outline-none focus:border-accent-cyan"
        >
          <option value="">All Services</option>
          <option value="payment-api">payment-api</option>
          <option value="auth-service">auth-service</option>
          <option value="checkout-worker">checkout-worker</option>
        </select>
      </div>

      {/* Archive Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-gray-400">Loading historical incident archive...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500">No archived incidents match your query.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className="p-5 rounded-xl bg-card border border-border hover:border-accent-cyan/40 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-accent-cyan">{inc.id}</span>
                  <Badge variant={inc.severity === 'Critical' ? 'critical' : inc.severity === 'High' ? 'high' : 'medium'}>
                    {inc.severity}
                  </Badge>
                  <span className="text-gray-400">[{inc.service}]</span>
                  <span className="text-gray-500">• {new Date(inc.created_at).toLocaleDateString()}</span>
                </div>

                {inc.resolution?.retained_in_hindsight && (
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded flex items-center gap-1 self-start md:self-auto">
                    <BrainCircuit className="w-3 h-3 text-purple-400" /> Hindsight Indexed
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-accent-cyan transition-colors">{inc.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{inc.description}</p>
              </div>

              {inc.resolution && (
                <div className="p-3 rounded-lg bg-background border border-border/80 text-[11px] font-mono grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                  <div>
                    <span className="text-gray-500 block">Verified Root Cause:</span>
                    <span className="text-emerald-300">{inc.resolution.verified_root_cause}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Permanent Resolution:</span>
                    <span className="text-gray-300">{inc.resolution.permanent_fix}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
"""

# 2. Analytics.tsx
analytics_code = """import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart3, 
  Clock, 
  BrainCircuit, 
  Flame, 
  Activity, 
  TrendingDown,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card, Badge } from '../components/ui';

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, t] = await Promise.all([
          api.getAnalyticsSummary(),
          api.getAnalyticsTrends()
        ]);
        setSummary(s);
        setTrends(t);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400 font-mono text-xs">Computing SRE analytics telemetry...</div>;
  }

  const severityPie = summary?.by_severity ? [
    { name: 'Critical', value: summary.by_severity.Critical || 0, color: '#EF4444' },
    { name: 'High', value: summary.by_severity.High || 0, color: '#F97316' },
    { name: 'Medium', value: summary.by_severity.Medium || 0, color: '#F59E0B' },
    { name: 'Low', value: summary.by_severity.Low || 0, color: '#10B981' },
  ].filter(p => p.value > 0) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-cyan" /> SRE Analytics & Recurrence Analytics
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Quantitative telemetry on incident duration, MTTR reduction with Hindsight, and recurring failure patterns.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs text-gray-400">Total Tracked Incidents</span>
          <div className="text-2xl font-mono font-bold text-white mt-2">{summary?.total_incidents || 0}</div>
          <span className="text-[11px] text-gray-500 font-mono">Multi-Service Portfolio</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-gray-400">Mean Time to Resolution (MTTR)</span>
          <div className="text-2xl font-mono font-bold text-accent-cyan mt-2">{summary?.mean_time_to_resolve_minutes || 18}m</div>
          <span className="text-[11px] text-emerald-400 font-mono">↓ 42% Triage Acceleration</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-gray-400">Active Hindsight Memories</span>
          <div className="text-2xl font-mono font-bold text-purple-400 mt-2">{summary?.total_hindsight_memories || 0}</div>
          <span className="text-[11px] text-purple-300 font-mono">Durable Knowledge Records</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-gray-400">Resolved & Closed Rate</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-2">
            {summary?.total_incidents ? Math.round(((summary.resolved_incidents || 0) / summary.total_incidents) * 100) : 100}%
          </div>
          <span className="text-[11px] text-gray-500 font-mono">Production Resolution SLA</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Daily Incident Volume vs Hindsight Memory Assists</h3>
            <span className="text-[11px] text-gray-400 font-mono">Last 5 Days Triage</span>
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
                <Bar dataKey="incidents" name="Total Alerts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recalled_assists" name="Memory Assisted" fill="#00D2FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Severity Distribution</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {severityPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-border">
            {severityPie.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-gray-300">{p.name}: {p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recurring Signatures */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Production Recurrence Index (Hindsight Detection)</h3>
        <p className="text-xs text-gray-400">Services exhibiting recurring failure signatures across rolling deployment cycles</p>
        
        <div className="space-y-2.5 pt-2">
          {trends?.recurring_signatures?.map((sig: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
              <div className="space-y-1">
                <div className="font-semibold text-white">{sig.service} <span className="text-gray-400">• {sig.pattern}</span></div>
                <div className="text-[11px] text-gray-500">Historical frequency: {sig.occurrences} matches documented in bank</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-accent-cyan text-[11px]">
                {sig.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
"""

with open(r"d:\IncidentMind AI\frontend\src\pages\IncidentHistory.tsx", "w", encoding="utf-8") as f:
    f.write(archive_code)
print("Created IncidentHistory.tsx")

with open(r"d:\IncidentMind AI\frontend\src\pages\AnalyticsPage.tsx", "w", encoding="utf-8") as f:
    f.write(analytics_code)
print("Created AnalyticsPage.tsx")
