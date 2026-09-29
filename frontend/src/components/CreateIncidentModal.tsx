import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../services/api';
import { X, AlertCircle, ShieldAlert, Sparkles, Flame } from 'lucide-react';
import { Button } from './ui';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newId: string) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'commander@incidentmind.ai';
  const userName = user?.fullName || user?.firstName || 'Incident Commander';
  const userId = user?.id || 'unknown';

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

  const presets = [
    {
      label: 'PostgreSQL Pool Saturation',
      service: 'payment-api',
      severity: 'Critical',
      title: 'PostgreSQL connection pool saturation under checkout surge',
      desc: 'Sudden spike in 504 Gateway Timeouts across checkout routes. Multiple backend threads blocked waiting for free DB connection handle.',
      symptoms: '504 Gateway Timeout during checkout\np99 latency > 4200ms\nHikariCP pool saturation at 100/100 connections',
      errors: 'HikariPool-1 - Connection is not available, request timed out after 30000ms.\nPSQLException: FATAL: remaining connection slots are reserved',
      logs: '[ERROR] 18:40:12 [http-nio-8080-exec-19] HikariPool-1 - Connection is not available, request timed out after 30000ms.\n[ERROR] 18:40:13 [http-nio-8080-exec-22] PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections.'
    },
    {
      label: 'Redis Cache Stampede',
      service: 'auth-service',
      severity: 'High',
      title: 'Auth token session cache stampede following Redis failover',
      desc: 'Massive surge in DB CPU utilization after redis session cluster restart. Simultaneous cache miss storm on popular user session tokens.',
      symptoms: 'Auth latency escalated to 2.8s\nRedis cache hit ratio dropped from 99% to 18%\nPostgres user_db CPU reached 96%',
      errors: 'RedisCommandTimeoutException: Command timed out after 2000ms\nAuthTokenVerifyError: unable to verify session token in store',
      logs: '[ERROR] 09:12:44 RedisCommandTimeoutException: Command timed out after 2000ms [key=sess_token_auth_91823]\n[WARN] 09:12:45 Fallback to Postgres user_sessions DB table under high concurrency.'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setService(p.service);
    setSeverity(p.severity);
    setDescription(p.desc);
    setSymptoms(p.symptoms);
    setErrorMessages(p.errors);
    setLogsExcerpt(p.logs);
  };

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
        symptoms: symptoms.split('\n').filter(s => s.trim().length > 0),
        error_messages: errorMessages.split('\n').filter(e => e.trim().length > 0),
        affected_components: [service],
        logs_excerpt: logsExcerpt,
        assignee: userName,
        metadata: {
          creator_email: userEmail,
          creator_name: userName,
          creator_id: userId
        }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] w-full max-w-2xl rounded-2xl shadow-xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#222834]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172033] dark:text-[#F1F5F9]">Declare Production Incident</h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Capture telemetry, symptoms, and initiate automatic Hindsight memory investigation</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2536] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Presets Bar */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" /> Quick Telemetry Presets:
          </span>
          <div className="flex items-center gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-[11px] text-[#4F46E5] dark:text-indigo-300 hover:text-[#4338CA] bg-[#EEF2FF] dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Incident Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., PostgreSQL connection pool saturation under checkout surge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3.5 py-2 text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Service *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              >
                <option value="payment-api" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">payment-api</option>
                <option value="auth-service" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">auth-service</option>
                <option value="checkout-worker" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">checkout-worker</option>
                <option value="order-service" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">order-service</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              >
                <option value="Critical" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Critical (P1 Outage)</option>
                <option value="High" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">High (P2 Degraded)</option>
                <option value="Medium" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Medium (P3 Partial)</option>
                <option value="Low" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Low (P4 Minor)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl px-3 py-2 text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              >
                <option value="production" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">production</option>
                <option value="staging" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">staging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Summary & Scope of Impact *</label>
            <textarea
              required
              rows={2}
              placeholder="Summary of what is broken, error rates, and customers impacted..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-indigo-100 leading-relaxed font-sans"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Observed Symptoms (one per line)</label>
              <textarea
                rows={3}
                placeholder="504 Gateway Timeout&#10;p99 latency > 4000ms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-2.5 font-mono text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] text-[11px]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Error Traces / Exception Messages</label>
              <textarea
                rows={3}
                placeholder="HikariPool-1 - Connection is not available"
                value={errorMessages}
                onChange={(e) => setErrorMessages(e.target.value)}
                className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-2.5 font-mono text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F5F9] mb-1.5">Sanitized Log Stream Excerpt</label>
            <textarea
              rows={3}
              placeholder="[ERROR] 14:22:01.104 HikariPool-1 - Connection timeout..."
              value={logsExcerpt}
              onChange={(e) => setLogsExcerpt(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-2.5 font-mono text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] text-[11px]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0] dark:border-[#222834]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
            >
              <Flame className="w-4 h-4 mr-1.5 text-white" />
              {submitting ? 'Declaring...' : 'Declare & Launch AI Studio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
