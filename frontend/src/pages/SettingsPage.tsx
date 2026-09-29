import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  Sun,
  Moon,
  Palette,
  MessageSquare,
  Lock,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'integrations' | 'notifications' | 'access' | 'audit' | 'appearance'>('integrations');
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
      setSlackTestResult(`Alert sent to ${settings?.slack_channel || '#incidents-war-room'}`);
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
          <h2 className="text-xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-500" />
            Settings & System Status
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Manage platform configuration, integrations, access control, and appearance.
          </p>
        </div>

        <Button size="sm" variant="secondary" onClick={loadSettings} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#222834] text-xs">
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'integrations' 
              ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-semibold' 
              : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
          }`}
        >
          System Services
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'notifications' 
              ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-semibold' 
              : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
          }`}
        >
          Notifications & Alerts
        </button>
        <button
          onClick={() => setActiveTab('access')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'access' 
              ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-semibold' 
              : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
          }`}
        >
          Workspaces & Access
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'audit' 
              ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-semibold' 
              : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
          }`}
        >
          Audit Log
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'appearance' 
              ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-semibold' 
              : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Appearance
        </button>
      </div>

      {/* Tab 1: System Services */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service 1 */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-500" /> Persistent Memory
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">Operational</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Continuous incident knowledge indexing and recall.
                </div>
              </div>
            </Card>

            {/* Service 2 */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-500" /> AI Diagnostic Copilot
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">Active & Ready</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Real-time investigation assistance and root cause analysis.
                </div>
              </div>
            </Card>

            {/* Service 3 */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" /> War Room Alerting
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Ready" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">Channel Linked</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Automated incident broadcasts and slash command routing.
                </div>
              </div>
            </Card>

            {/* Service 4 */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-500" /> Enterprise Single Sign-On
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Protected" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">Protected</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Role-based access control and session management.
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#172033] dark:text-[#F1F5F9]">
                  All Core Incident Services Operational
                </div>
                <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
                  Sub-second query response time across active workspaces.
                </div>
              </div>
            </div>
            <Badge variant="success">99.98% Uptime</Badge>
          </Card>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'notifications' && (
        <Card className="p-5 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <BellRing className="w-4 h-4 text-indigo-500" /> Incident Broadcast Channels
            </h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
              Live broadcast destination for new outages and investigation summaries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">Designated War Room</div>
              <div className="text-sm font-bold text-[#4F46E5] dark:text-indigo-400 font-mono mt-0.5">
                {settings?.slack_channel || '#incidents-war-room'}
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                Threaded updates dispatched on incident declaration and resolution.
              </div>
            </div>

            <Button size="sm" onClick={handleTestSlack} disabled={slackTesting}>
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              {slackTesting ? 'Sending...' : 'Send Test Notification'}
            </Button>
          </div>

          {slackTestResult && (
            <div className={`p-3 rounded-xl text-xs font-medium ${
              slackTestResult.startsWith('Failed') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {slackTestResult}
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Access */}
      {activeTab === 'access' && (
        <Card className="p-5 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Workspaces & Team Roles</h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
              Role permissions and environment isolation for on-call teams.
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#172033] dark:text-[#F1F5F9]">Production Workspace</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Primary incident triage and memory retention</div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#172033] dark:text-[#F1F5F9]">Staging & Drills Workspace</div>
                <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">Simulated outage drills and runbook testing</div>
              </div>
              <Badge variant="neutral">Sandbox</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Audit */}
      {activeTab === 'audit' && (
        <Card className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Recent Platform Activity</h3>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono">{auditTrail.length} Events</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {auditTrail.map((ev, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#4F46E5] dark:text-indigo-400 mr-2">{ev.action}</span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{ev.details || ev.summary}</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono whitespace-nowrap">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Appearance */}
      {activeTab === 'appearance' && (
        <Card className="p-5 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" /> Interface Theme
            </h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
              Choose your visual presentation preference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-[#4F46E5] bg-indigo-50/50 shadow-xs'
                  : 'border-[#E2E8F0] dark:border-[#222834] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">Light Theme</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Clean daylight palette with high contrast and subtle borders.
              </p>
            </div>

            <div 
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#4F46E5] bg-indigo-950/40 shadow-xs'
                  : 'border-[#E2E8F0] dark:border-[#222834] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">Dark Theme</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Deep command center theme with reduced eye fatigue for on-call responders.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
