import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'connectivity' | 'access' | 'audit' | 'notifications'>('connectivity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [s, a] = await Promise.all([
        api.getSettings(),
        api.getAudit()
      ]);
      setSettings(s);
      setAuditTrail(a);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#4F46E5]" />
            System Administration & Environment Settings
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Cluster configuration, Vectorize Hindsight memory banks, Groq inference, and security access controls.
          </p>
        </div>

        <Button size="sm" variant="secondary" onClick={loadSettings} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] text-xs">
        <button
          onClick={() => setActiveTab('connectivity')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'connectivity' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Provider & Connectivity
        </button>
        <button
          onClick={() => setActiveTab('access')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'access' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Workspaces & SRE Access
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Security Audit Trail ({auditTrail.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'notifications' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Alert Escalations
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'connectivity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#4F46E5]" /> Hindsight Memory
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Bank: <span className="text-[#4F46E5] font-semibold">{settings?.hindsight_bank_id || 'incidentmind-prod-bank'}</span></div>
                <div>Status: <span className="text-emerald-700 font-medium">{settings?.hindsight_mode || 'Active'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Official Hindsight REST interface configured for retain, recall, and TEMPR multi-strategy search.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#4F46E5]" /> Groq LLM Inference
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Model: <span className="text-[#172033]">{settings?.groq_model || 'llama-3.3-70b-versatile'}</span></div>
                <div>State: <span className="text-emerald-700 font-medium">{settings?.groq_configured ? 'API Connected' : 'Resilient Sandbox Engine'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                High-speed LLM inference enforcing zero-hallucination policies and qualitative uncertainty grounding.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Structured Database
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Driver: <span className="text-[#172033]">Motor / AsyncIO</span></div>
                <div>Store: <span className="text-[#4F46E5] font-semibold">{settings?.db_mode || 'In-Memory Resilient Store'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                MongoDB Atlas connection with ACID isolation for incidents, users, and audit trails.
              </p>
            </Card>
          </div>

          <Card className="p-5 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-semibold text-[#172033] font-sans">Backend Environment Variables (.env)</h3>
            <p className="text-[#64748B] font-sans">
              To point IncidentMind AI to a live Hindsight Cloud instance or Groq production API key, configure the backend environment:
            </p>

            <pre className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] overflow-x-auto text-[11px]">
{`# Backend Environment Configuration (.env)
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=incidentmind-prod-bank

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=incidentmind_db
DEMO_MODE=true`}
            </pre>
          </Card>
        </div>
      )}

      {activeTab === 'access' && (
        <Card className="p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-[#172033]">Workspaces & Role-Based Access Control</h3>
          <p className="text-[#64748B]">
            Configure tenant isolation and authorization boundaries for production SRE on-call teams.
          </p>

          <div className="divide-y divide-[#E2E8F0] pt-2">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#172033]">prod-east-1 Workspace</div>
                <div className="text-[#64748B] text-[11px]">Primary production cluster with Hindsight memory bank isolation</div>
              </div>
              <Badge variant="success">Active Workspace</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#172033]">staging-us-central Workspace</div>
                <div className="text-[#64748B] text-[11px]">Isolated pre-production test bed with synthetic telemetry</div>
              </div>
              <Badge variant="neutral">Sandbox</Badge>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card className="p-5 space-y-4 text-xs font-mono">
          <h3 className="text-sm font-semibold text-[#172033] font-sans">Immutable Security Audit Trail</h3>
          <p className="text-[#64748B] font-sans">
            Captures all incident creations, AI investigation runs, memory operations, and human verified resolutions.
          </p>

          <div className="space-y-2 pt-2 max-h-96 overflow-y-auto pr-1">
            {auditTrail.map((ev, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4F46E5] font-bold">{ev.action}</span>
                    <span className="text-[#64748B] font-sans">• {ev.details}</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Incident: {ev.incident_id || 'Global'} by {ev.user || 'sre-engineer'}</div>
                </div>
                <span className="text-[10px] text-[#94A3B8]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-[#172033]">Alert Routing & Incident Escalations</h3>
          <p className="text-[#64748B]">
            Connect PagerDuty, Opsgenie, or Slack Webhooks for incoming production alert dispatch.
          </p>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="font-semibold text-[#172033] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Webhook Integration Active
            </div>
            <p className="text-[#64748B] font-mono text-[11px]">POST /api/incidents handles automated telemetry ingest from Datadog, Prometheus, or CloudWatch.</p>
          </div>
        </Card>
      )}
    </div>
  );
};
