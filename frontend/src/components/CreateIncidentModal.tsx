import { useState } from 'react';
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
        symptoms: symptoms.split('\n').filter(s => s.trim().length > 0),
        error_messages: errorMessages.split('\n').filter(e => e.trim().length > 0),
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
