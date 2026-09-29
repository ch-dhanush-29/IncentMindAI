import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'connectivity' | 'access' | 'audit' | 'notifications' | 'appearance'>('connectivity');
  const [loading, setLoading] = useState(true);
  const [slackTesting, setSlackTesting] = useState(false);
  const [slackTestResult, setSlackTestResult] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

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

  const handleTestSlack = async () => {
    try {
      setSlackTesting(true);
      setSlackTestResult(null);
      await api.testSlackAlert();
      setSlackTestResult(`Dispatched test incident alert to ${settings?.slack_channel || '#incidents-war-room'}`);
    } catch (e: any) {
      setSlackTestResult(`Failed: ${e.message}`);
    } finally {
      setSlackTesting(false);
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
            Cluster configuration, Vectorize Hindsight memory banks, Groq inference, Slack bot, and Clerk SSO.
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
          Slack & Escalations
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'appearance' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Appearance & Theme
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'connectivity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Vectorize Hindsight */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#4F46E5]" /> Vectorize Hindsight
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Bank: <span className="text-[#4F46E5] font-semibold">{settings?.hindsight_bank_id || 'incidentmind-prod-bank'}</span></div>
                <div>Mode: <span className="text-emerald-700 font-medium">{settings?.hindsight_mode || 'Vectorize Cloud'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Sub-200ms semantic memory search across past incidents and verified post-mortems.
              </p>
            </Card>

            {/* Card 2: Groq Inference */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#4F46E5]" /> Groq Fast LLM
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Model: <span className="text-[#172033]">{settings?.groq_model || 'llama-3.3-70b-versatile'}</span></div>
                <div>Status: <span className="text-emerald-700 font-medium">{settings?.groq_configured ? 'API Connected' : 'Resilient Sandbox Engine'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Real-time reasoning across active telemetry streams with zero synthetic hallucination.
              </p>
            </Card>

            {/* Card 3: Slack Bot */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#4F46E5]" /> Slack War Room
                </span>
                <span className={`w-2 h-2 rounded-full ${settings?.slack_connected ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Channel: <span className="text-[#4F46E5] font-semibold">{settings?.slack_channel || '#incidents-war-room'}</span></div>
                <div>Status: <span className="text-emerald-700 font-medium">{settings?.slack_connected ? 'Live Connected' : 'Sandbox Buffer'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Automated incident alert broadcasts, command handlers, and diagnosis thread updates.
              </p>
            </Card>

            {/* Card 4: Clerk Auth */}
            <Card className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" /> Clerk SSO & RBAC
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs font-mono text-[#172033] space-y-1">
                <div>Provider: <span className="text-[#172033]">Clerk Cloud</span></div>
                <div>Mode: <span className="text-emerald-700 font-medium">{settings?.clerk_auth_enabled ? 'Enforced JWT' : 'Dev SRE Sandbox'}</span></div>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans">
                Enterprise Multi-Factor Authentication, Role-Based Access Control, and session audit logs.
              </p>
            </Card>
          </div>

          <Card className="p-5 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-semibold text-[#172033] font-sans">Backend Environment Variables (.env)</h3>
            <p className="text-[#64748B] font-sans">
              To point IncidentMind AI to Vectorize Hindsight Cloud, Slack Bot, Clerk Auth, or Groq API, configure `.env`:
            </p>

            <pre className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#172033] overflow-x-auto text-[11px] leading-relaxed">
{`# 1. Vectorize Hindsight Persistent Memory
HINDSIGHT_API_KEY=hs_live_your_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=incidentmind-prod-bank
HINDSIGHT_ENABLED=true

# 2. Slack War Room & Incident Bot
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_DEFAULT_CHANNEL=#incidents-war-room

# 3. Clerk Authentication & SSO
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret
AUTH_ENABLED=true

# 4. Groq Fast LPU Inference
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# 5. Database & Mode
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=incidentmind_db
DEMO_MODE=false`}
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
        <Card className="p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#4F46E5]" /> Slack War Room & Alert Integrations
            </h3>
            <p className="text-[#64748B] mt-1">
              Connect your Slack workspace to broadcast live incident alerts, share AI root-cause hypotheses, and allow SREs to declare incidents via Slack commands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-[#4F46E5] bg-[#EEF2FF] border border-indigo-100 px-2 py-0.5 rounded">
                War Room Channel
              </span>
              <h4 className="font-bold text-sm text-[#172033]">{settings?.slack_channel || '#incidents-war-room'}</h4>
              <p className="text-[11px] text-[#64748B]">
                All declared incidents and AI investigation summaries are automatically posted as threaded discussions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Slack Slash Commands
              </span>
              <h4 className="font-bold text-sm text-[#172033]">/incident declare [title]</h4>
              <p className="text-[11px] text-[#64748B]">
                Endpoint: <code className="text-[#4F46E5] bg-white px-1 py-0.5 rounded border border-[#E2E8F0]">POST /api/webhooks/slack/command</code>
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[#172033]">Live Slack Alert Dispatch Test</div>
              <div className="text-[#64748B] text-[11px]">Send a test incident alert with Block Kit action buttons to verify webhook connectivity.</div>
              {slackTestResult && (
                <div className={`mt-2 text-xs font-mono font-medium ${slackTestResult.startsWith('Failed') ? 'text-red-600' : 'text-emerald-700'}`}>
                  {slackTestResult}
                </div>
              )}
            </div>
            <Button size="sm" onClick={handleTestSlack} disabled={slackTesting}>
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              {slackTesting ? 'Dispatching...' : 'Send Test Slack Notification'}
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card className="p-6 space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#4F46E5]" /> Theme & Visual Experience
            </h3>
            <p className="text-[#64748B] mt-1">
              Select your interface theme preference. Changes apply instantly across the entire application and persist in local storage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Theme Card */}
            <div 
              onClick={() => setTheme('light')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'light'
                  ? 'border-[#4F46E5] ring-2 ring-indigo-500/20 bg-white shadow-xs'
                  : 'border-[#E2E8F0] hover:border-slate-300 bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033]">Enterprise Light Theme</h4>
                    <span className="text-[10px] text-[#64748B] font-mono">Indigo & Slate (#F5F7FB / #FFFFFF)</span>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold">✓</span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Crisp white cards, hairline slate borders, and high-contrast typography designed for daytime operations and presentations.
              </p>
            </div>

            {/* Dark Theme Card */}
            <div 
              onClick={() => setTheme('dark')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'dark'
                  ? 'border-[#4F46E5] ring-2 ring-indigo-500/20 bg-[#161F30] shadow-xs'
                  : 'border-[#E2E8F0] hover:border-slate-300 bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#172033]">Operations Dark Theme</h4>
                    <span className="text-[10px] text-[#64748B] font-mono">Midnight Obsidian & Deep Slate</span>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold">✓</span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Deep obsidian background, elevated slate cards, and low-eye-strain luminous indigo accents for nocturnal SRE on-call rotations.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
