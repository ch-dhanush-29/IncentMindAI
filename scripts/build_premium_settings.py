settings_code = """import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  Key,
  Server,
  Lock,
  Bell,
  FileText,
  User,
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
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-accent-cyan" />
            System Administration & Environment Settings
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Cluster configuration, Vectorize Hindsight memory banks, Groq inference, and security access controls.
          </p>
        </div>

        <Button size="sm" variant="secondary" onClick={loadSettings}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Status
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border text-xs">
        <button
          onClick={() => setActiveTab('connectivity')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'connectivity' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Provider & Connectivity
        </button>
        <button
          onClick={() => setActiveTab('access')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'access' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Workspaces & SRE Access
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'audit' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Security Audit Trail ({auditTrail.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'notifications' ? 'border-accent-cyan text-accent-cyan' : 'border-transparent text-gray-400 hover:text-gray-200'
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
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-purple-400" /> Hindsight Memory
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs font-mono text-gray-300 space-y-1">
                <div>Bank: <span className="text-accent-cyan">{settings?.hindsight_bank_id || 'incidentmind-prod-bank'}</span></div>
                <div>Status: <span className="text-emerald-400">{settings?.hindsight_mode || 'Active'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                Official Hindsight REST interface configured for retain, recall, and TEMPR multi-strategy search.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-accent-blue" /> Groq LLM Inference
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-mono text-gray-300 space-y-1">
                <div>Model: <span className="text-white">{settings?.groq_model || 'llama-3.3-70b-versatile'}</span></div>
                <div>State: <span className="text-emerald-400">{settings?.groq_configured ? 'API Connected' : 'Resilient Sandbox Engine'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                High-speed LLM inference enforcing zero-hallucination policies and qualitative uncertainty grounding.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Structured Database
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-mono text-gray-300 space-y-1">
                <div>Driver: <span className="text-white">Motor / AsyncIO</span></div>
                <div>Store: <span className="text-accent-cyan">{settings?.db_mode || 'In-Memory Resilient Store'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 font-sans">
                MongoDB Atlas connection with ACID isolation for incidents, users, and audit trails.
              </p>
            </Card>
          </div>

          <Card className="p-5 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-semibold text-white font-sans">Backend Environment Variables (.env)</h3>
            <p className="text-gray-400 font-sans">
              To point IncidentMind AI to a live Hindsight Cloud instance or Groq production API key, configure the backend environment:
            </p>

            <pre className="p-4 rounded-lg bg-background border border-border text-gray-300 overflow-x-auto text-[11px]">
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
          <h3 className="text-sm font-semibold text-white">Workspaces & Role-Based Access Control</h3>
          <p className="text-gray-400">
            Configure tenant isolation and authorization boundaries for production SRE on-call teams.
          </p>

          <div className="divide-y divide-border pt-2">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">prod-east-1 Workspace</div>
                <div className="text-gray-400 text-[11px]">Primary production cluster with Hindsight memory bank isolation</div>
              </div>
              <Badge variant="success">Active Workspace</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">staging-us-central Workspace</div>
                <div className="text-gray-400 text-[11px]">Isolated pre-production test bed with synthetic telemetry</div>
              </div>
              <Badge variant="neutral">Sandbox</Badge>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card className="p-5 space-y-4 text-xs font-mono">
          <h3 className="text-sm font-semibold text-white font-sans">Immutable Security Audit Trail</h3>
          <p className="text-gray-400 font-sans">
            Captures all incident creations, AI investigation runs, memory operations, and human verified resolutions.
          </p>

          <div className="space-y-2 pt-2 max-h-96 overflow-y-auto pr-1">
            {auditTrail.map((ev, i) => (
              <div key={i} className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-cyan font-bold">{ev.action}</span>
                    <span className="text-gray-400 font-sans">• {ev.details}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">Incident: {ev.incident_id || 'Global'} by {ev.user || 'sre-engineer'}</div>
                </div>
                <span className="text-[10px] text-gray-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white">Alert Routing & Incident Escalations</h3>
          <p className="text-gray-400">
            Connect PagerDuty, Opsgenie, or Slack Webhooks for incoming production alert dispatch.
          </p>
          <div className="p-4 rounded-lg bg-background border border-border space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Webhook Integration Active
            </div>
            <p className="text-gray-400 font-mono text-[11px]">POST /api/incidents handles automated telemetry ingest from Datadog, Prometheus, or CloudWatch.</p>
          </div>
        </Card>
      )}
    </div>
  );
};
"""

with open(r"d:\IncidentMind AI\frontend\src\pages\SettingsPage.tsx", "w", encoding="utf-8") as f:
    f.write(settings_code)
print("Updated SettingsPage.tsx successfully")
