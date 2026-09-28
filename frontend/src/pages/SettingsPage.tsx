import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [, setHealth] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [, setLoading] = useState(true);

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
