import os

files = {}

files[r"d:\IncidentMind AI\frontend\src\components\Sidebar.tsx"] = '''import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronRight,
  Radio
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hindsightConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, hindsightConnected }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'incidents', label: 'Incidents Feed', icon: Activity },
    { id: 'investigation', label: 'AI Investigation Studio', icon: BrainCircuit },
    { id: 'memory-explorer', label: 'Hindsight Memory Explorer', icon: ShieldAlert },
    { id: 'postmortem', label: 'Resolution & Retain', icon: FileText },
    { id: 'settings', label: 'System & Health', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col justify-between h-screen select-none">
      <div>
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BrainCircuit className="w-5 h-5 text-background font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              IncidentMind <span className="text-accent-cyan text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">AI</span>
            </h1>
            <p className="text-xs text-gray-400">Persistent Memory SRE</p>
          </div>
        </div>

        <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-card/60 border border-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hindsightConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-gray-300 font-mono text-[11px]">Hindsight Bank</span>
          </div>
          <span className="text-[10px] text-accent-cyan font-mono bg-cyan-950/40 px-1 rounded">TEMPR Active</span>
        </div>

        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-blue/15 text-accent-cyan border border-accent-cyan/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-card/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent-cyan" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border bg-sidebar/80 text-xs text-gray-400">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold text-xs">
            SRE
          </div>
          <div>
            <div className="text-gray-200 font-medium">Production On-Call</div>
            <div className="text-[11px] text-gray-500 font-mono">workspace: prod-east</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-border/50 font-mono">
          <span className="flex items-center gap-1"><Radio className="w-2.5 h-2.5 text-emerald-400" /> Groq Fast</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
'''

files[r"d:\IncidentMind AI\frontend\src\components\Navbar.tsx"] = '''import React from 'react';
import { Search, Database } from 'lucide-react';

interface NavbarProps {
  onSearch?: (q: string) => void;
  openCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, openCreateModal }) => {
  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, services, logs, or past postmortems..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-background/80 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-background border border-border text-xs font-mono text-gray-300">
          <Database className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Hindsight Memory:</span>
          <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-1.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span className="text-sm font-bold leading-none">+</span> Declare Incident
        </button>
      </div>
    </header>
  );
};
'''

files[r"d:\IncidentMind AI\frontend\src\components\CreateIncidentModal.tsx"] = '''import React, { useState } from 'react';
import { api } from '../services/api';
import { X, AlertCircle, ShieldAlert } from 'lucide-react';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newId: string) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [service, setService] = useState('payment-api');
  const [severity, setSeverity] = useState('Critical');
  const [environment, setEnvironment] = useState('production');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [logsExcerpt, setLogsExcerpt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !service || !description) {
      setError('Please provide title, service, and description.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        title,
        service,
        severity,
        environment,
        description,
        symptoms: symptoms.split('\\n').filter(s => s.trim().length > 0),
        error_messages: errorMessages.split('\\n').filter(e => e.trim().length > 0),
        affected_components: [service],
        logs_excerpt: logsExcerpt
      };

      const result = await api.createIncident(payload);
      onCreated(result.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Declare New Incident</h2>
              <p className="text-xs text-gray-400">Capture telemetry, symptoms, and initiate Hindsight memory investigation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-background">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-300 mb-1">Incident Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., PostgreSQL connection pool saturation under checkout load"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-gray-300 mb-1">Service *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
              >
                <option value="payment-api">payment-api</option>
                <option value="auth-service">auth-service</option>
                <option value="checkout-worker">checkout-worker</option>
                <option value="order-service">order-service</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
              >
                <option value="Critical">Critical (P1)</option>
                <option value="High">High (P2)</option>
                <option value="Medium">Medium (P3)</option>
                <option value="Low">Low (P4)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-cyan"
              >
                <option value="production">production</option>
                <option value="staging">staging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              required
              rows={2}
              placeholder="Summary of what is broken and who is impacted..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-300 mb-1">Observed Symptoms (one per line)</label>
              <textarea
                rows={3}
                placeholder="504 Gateway Timeout&#10;p99 latency > 4000ms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">Error Messages / Signatures</label>
              <textarea
                rows={3}
                placeholder="HikariPool-1 - Connection is not available"
                value={errorMessages}
                onChange={(e) => setErrorMessages(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-300 mb-1">Sanitized Log Excerpt</label>
            <textarea
              rows={3}
              placeholder="[ERROR] 14:22:01.104 HikariPool-1 - Connection timeout..."
              value={logsExcerpt}
              onChange={(e) => setLogsExcerpt(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-gray-300 placeholder-gray-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-background border border-border text-gray-300 hover:bg-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium shadow-sm transition-all flex items-center gap-1.5"
            >
              {submitting ? 'Submitting...' : 'Declare & Open Investigation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
'''

files[r"d:\IncidentMind AI\frontend\src\pages\SettingsPage.tsx"] = '''import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [h, s] = await Promise.all([
        api.getHealthReady(),
        api.getSettings()
      ]);
      setHealth(h);
      setSettings(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-accent-cyan" />
            System Connectivity & Provider Settings
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Live health verification for Vectorize Hindsight memory banks, Groq LLM inference, and MongoDB.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="px-3 py-1.5 rounded-lg bg-card border border-border text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" /> Hindsight Memory
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-mono text-gray-300 space-y-1">
            <div>Bank: <span className="text-accent-cyan">{settings?.hindsight_bank_id || 'incidentmind-prod-bank'}</span></div>
            <div>Mode: <span className="text-emerald-400">{settings?.hindsight_mode || 'Active'}</span></div>
          </div>
          <p className="text-[11px] text-gray-400">
            Official Hindsight REST / SDK interface configured for retain, recall, and reflection.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-accent-blue" /> Groq LLM Provider
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xs font-mono text-gray-300 space-y-1">
            <div>Model: <span className="text-white">{settings?.groq_model || 'llama-3.3-70b-versatile'}</span></div>
            <div>State: <span className="text-emerald-400">{settings?.groq_configured ? 'API Connected' : 'Resilient Sandbox Engine'}</span></div>
          </div>
          <p className="text-[11px] text-gray-400">
            Zero-hallucination structured investigation pipeline with qualitative uncertainty bounds.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border space-y-3">
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
          <p className="text-[11px] text-gray-400">
            Audit trails, incident telemetry, and postmortems preserved with ACID isolation.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-card border border-border space-y-4 text-xs font-mono">
        <h3 className="text-sm font-semibold text-white font-sans">Active Configuration & Environment Variables</h3>
        <p className="text-gray-400 font-sans">
          To point IncidentMind AI to your live Hindsight Cloud instance and Groq production keys, update the backend .env file:
        </p>

        <pre className="p-4 rounded-lg bg-background border border-border text-gray-300 overflow-x-auto">
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
      </div>
    </div>
  );
};
'''

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully wrote {path}")

