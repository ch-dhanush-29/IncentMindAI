import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Incident, Severity, IncidentStatus } from '../types/incident';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Clock, 
  FileCheck2, 
  Server,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Send,
  User,
  Shield,
  History,
  FileText
} from 'lucide-react';
import { Card, Badge, SeverityBadge, StatusBadge, HindsightBadge, Button, CodeBlock } from '../components/ui';

interface IncidentDetailProps {
  incidentId: string;
  onBack: () => void;
  onStartInvestigation: (id: string) => void;
  onNavigateToResolve: (id: string) => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({
  incidentId,
  onBack,
  onStartInvestigation,
  onNavigateToResolve
}) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'symptoms' | 'investigation' | 'resolution' | 'notes' | 'audit'>('timeline');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Notes state
  const [newNote, setNewNote] = useState('');
  const [authorName, setAuthorName] = useState('sre-engineer');
  const [noteType, setNoteType] = useState('investigation_note');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Quick field editing state
  const [isUpdatingField, setIsUpdatingField] = useState(false);

  // Reopen prompt state
  const [showReopenPrompt, setShowReopenPrompt] = useState(false);
  const [reopenReason, setReopenReason] = useState('Symptoms recurred in production; continuing live diagnostics.');

  useEffect(() => {
    loadIncident();
  }, [incidentId]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadIncident = async () => {
    try {
      setLoading(true);
      const data = await api.getIncident(incidentId);
      setIncident(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (!incident) return;
    try {
      setIsUpdatingField(true);
      const updated = await api.updateIncident(incident.id, { status: newStatus });
      setIncident(updated);
      showToast(`Incident status transitioned to ${newStatus}`);
    } catch (err: any) {
      showToast(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingField(false);
    }
  };

  const handleSeverityChange = async (newSeverity: Severity) => {
    if (!incident) return;
    try {
      setIsUpdatingField(true);
      const updated = await api.updateIncident(incident.id, { severity: newSeverity });
      setIncident(updated);
      showToast(`Incident severity updated to ${newSeverity}`);
    } catch (err: any) {
      showToast(`Failed to update severity: ${err.message}`);
    } finally {
      setIsUpdatingField(false);
    }
  };

  const handleAssigneeChange = async (assignee: string) => {
    if (!incident) return;
    try {
      setIsUpdatingField(true);
      const updated = await api.updateIncident(incident.id, { assignee });
      setIncident(updated);
      showToast(`Incident assigned to ${assignee}`);
    } catch (err: any) {
      showToast(`Failed to update assignee: ${err.message}`);
    } finally {
      setIsUpdatingField(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !newNote.trim()) return;
    try {
      setIsSubmittingNote(true);
      const updated = await api.addNote(incident.id, newNote.trim(), authorName, noteType);
      setIncident(updated);
      setNewNote('');
      showToast('Investigation note saved and logged to audit trail');
    } catch (err: any) {
      showToast(`Failed to add note: ${err.message}`);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleReopen = async () => {
    if (!incident) return;
    try {
      setIsUpdatingField(true);
      const updated = await api.reopenIncident(incident.id, reopenReason, authorName);
      setIncident(updated);
      setShowReopenPrompt(false);
      showToast('Incident successfully reopened and marked Investigating');
    } catch (err: any) {
      showToast(`Failed to reopen: ${err.message}`);
    } finally {
      setIsUpdatingField(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#64748B] font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
        <span>Loading incident war room dossier {incidentId}...</span>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-8 text-center text-[#64748B]">
        Incident not found. <button onClick={onBack} className="text-[#4F46E5] underline cursor-pointer">Return to Feed</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3 bg-indigo-600 text-white text-xs font-mono rounded-xl shadow-md flex items-center justify-between animate-fade-in">
          <span>✓ {feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* Back and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents Feed
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Reopen action if resolved */}
          {(incident.status === 'Resolved' || incident.status === 'Closed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReopenPrompt(true)}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Reopen Incident
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartInvestigation(incident.id)}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#4F46E5] mr-1.5" />
            Launch AI Studio
          </Button>

          {incident.status !== 'Resolved' && (
            <Button
              variant="hindsight"
              size="sm"
              onClick={() => onNavigateToResolve(incident.id)}
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
              Verify & Resolve Postmortem
            </Button>
          )}
        </div>
      </div>

      {/* Incident Header Card */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#4F46E5] dark:text-indigo-400 text-sm px-2 py-0.5 rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                <Server className="w-3 h-3 text-[#94A3B8]" />
                [{incident.service}]
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">• env: {incident.environment}</span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#172033] dark:text-[#F1F5F9] tracking-tight leading-snug">
              {incident.title}
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed font-sans max-w-2xl">
              {incident.description}
            </p>

            {/* Quick Field Controls Toolbar */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#222834] flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Status:</span>
                <select
                  disabled={isUpdatingField}
                  value={incident.status}
                  onChange={(e) => handleStatusChange(e.target.value as IncidentStatus)}
                  className="bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-lg px-2 py-1 text-xs text-[#172033] dark:text-[#F1F5F9] font-semibold focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  <option value="New" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">New</option>
                  <option value="Investigating" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Investigating</option>
                  <option value="Mitigated" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Mitigated</option>
                  <option value="Resolved" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Resolved</option>
                  <option value="Closed" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Severity:</span>
                <select
                  disabled={isUpdatingField}
                  value={incident.severity}
                  onChange={(e) => handleSeverityChange(e.target.value as Severity)}
                  className="bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-lg px-2 py-1 text-xs text-[#172033] dark:text-[#F1F5F9] font-semibold focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  <option value="Critical" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Critical</option>
                  <option value="High" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">High</option>
                  <option value="Medium" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Medium</option>
                  <option value="Low" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#64748B] dark:text-[#94A3B8]">Assignee:</span>
                <select
                  disabled={isUpdatingField}
                  value={incident.assignee || 'unassigned'}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-lg px-2 py-1 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  <option value="unassigned" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Unassigned</option>
                  <option value="Ryan Cox Administrator" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Ryan Cox Administrator</option>
                  <option value="Carlos Ruiz (Infra Lead)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Carlos Ruiz (Infra Lead)</option>
                  <option value="Elena Rostova (Principal SRE)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Elena Rostova (Principal SRE)</option>
                  <option value="Jane Smith (DBA)" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Jane Smith (DBA)</option>
                  <option value="sre-oncall" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">sre-oncall</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Meta Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs font-mono text-[#64748B] dark:text-[#94A3B8] space-y-2 self-start min-w-[240px] shadow-xs">
            <div className="flex items-center justify-between">
              <span>Declared:</span>
              <span className="text-[#172033] dark:text-[#F1F5F9]">{new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service:</span>
              <span className="text-[#172033] dark:text-[#F1F5F9] font-semibold">{incident.service}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Assignee:</span>
              <span className="text-[#172033] dark:text-[#F1F5F9] font-medium truncate max-w-[130px]">{incident.assignee || 'Unassigned'}</span>
            </div>
            <div className="pt-1 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between">
              <span>Hindsight:</span>
              <span className={incident.resolution?.retained_in_hindsight ? 'text-[#4F46E5] dark:text-indigo-400 font-bold' : 'text-[#94A3B8]'}>
                {incident.resolution?.retained_in_hindsight ? 'RETAINED' : 'PENDING POSTMORTEM'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#222834] pt-2 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Lifecycle Stepper
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'symptoms'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Symptoms & Raw Logs
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'investigation'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Investigation Findings
          </button>
          <button
            onClick={() => setActiveTab('resolution')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'resolution'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            Confirmed Postmortem
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notes & Evidence ({incident.notes?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-[#4F46E5] text-[#4F46E5] dark:text-indigo-400 font-bold'
                : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({incident.audit_trail?.length || 0})</span>
          </button>
        </div>
      </Card>

      {/* Reopen Prompt Modal */}
      {showReopenPrompt && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <RotateCcw className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Reopen Incident {incident.id}</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300/80">
            Reopening this incident will set its status back to <strong>Investigating</strong> and clear the resolved timestamp, allowing engineers to append new evidence and re-evaluate hypotheses.
          </p>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-amber-900 dark:text-amber-300 font-semibold">Reason for reopening:</label>
            <input
              type="text"
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              className="w-full bg-white dark:bg-[#181D26] border border-amber-300 dark:border-amber-800 rounded-xl px-3 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" variant="primary" onClick={handleReopen} disabled={isUpdatingField}>
              Confirm Reopen
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowReopenPrompt(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Incident Lifecycle Progression</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-700 dark:text-red-400">
                <span>1. TRIGGERED</span>
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">Automated monitor tripped on {incident.service}</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">{new Date(incident.created_at).toLocaleTimeString()}</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.investigation ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.investigation ? 'text-[#4F46E5] dark:text-indigo-400' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}>
                <span>2. INVESTIGATING</span>
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">AI Agent querying Hindsight memory bank</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                {incident.investigation ? 'Diagnosis synthesized' : 'Awaiting triage'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.status === 'Mitigated' || incident.status === 'Resolved' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.status === 'Mitigated' || incident.status === 'Resolved' ? 'text-blue-700 dark:text-blue-400' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}>
                <span>3. MITIGATED</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">Initial mitigation steps executed</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                {incident.resolution ? 'Applied' : 'Pending action'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              incident.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50' : 'bg-[#F8FAFC] dark:bg-[#181D26] border-[#E2E8F0] dark:border-[#222834]'
            }`}>
              <div className={`flex items-center justify-between text-xs font-mono font-bold ${
                incident.status === 'Resolved' ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}>
                <span>4. RESOLVED</span>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="text-xs text-[#172033] dark:text-[#F1F5F9]">Root cause confirmed & retained in Hindsight</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                {incident.resolved_at ? new Date(incident.resolved_at).toLocaleTimeString() : 'In Progress'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Symptoms & Logs */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Observed Symptoms & Anomalies</h3>
            <div className="space-y-2">
              {incident.symptoms.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] font-mono text-xs text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-indigo-400" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] pt-2">Captured Error Messages</h3>
            <div className="space-y-2">
              {incident.error_messages.map((e, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 font-mono text-xs text-red-700 dark:text-red-400">
                  {e}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Sanitized Diagnostic Telemetry Log Stream</h3>
            {incident.logs_excerpt ? (
              <CodeBlock code={incident.logs_excerpt} language="log" />
            ) : (
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs text-[#64748B] dark:text-[#94A3B8]">
                No raw telemetry traces attached to this incident.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 3: Investigation Findings */}
      {activeTab === 'investigation' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Hindsight AI Synthesis & Hypotheses</h3>
            <Button size="sm" variant="primary" onClick={() => onStartInvestigation(incident.id)}>
              Open Full AI Studio
            </Button>
          </div>

          {incident.investigation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-[#172033] dark:text-[#F1F5F9] leading-relaxed">
                <span className="font-bold text-[#4F46E5] dark:text-indigo-400 block mb-1">Executive AI Summary:</span>
                {incident.investigation.summary}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9]">Ranked Hypotheses:</h4>
                {incident.investigation.hypotheses.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172033] dark:text-[#F1F5F9]">{h.cause}</span>
                      <Badge variant={h.status === 'Confirmed' ? 'success' : 'high'}>{h.status}</Badge>
                    </div>
                    <ul className="list-disc list-inside text-xs text-[#64748B] dark:text-[#94A3B8] space-y-1">
                      {h.evidence_supporting.map((ev, ei) => (
                        <li key={ei}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] dark:text-[#94A3B8] text-xs space-y-3">
              <p>No automated investigation results generated yet.</p>
              <Button size="sm" variant="primary" onClick={() => onStartInvestigation(incident.id)}>
                Run Hindsight Investigation Now
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Postmortem Resolution */}
      {activeTab === 'resolution' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9]">Confirmed Root Cause & Resolution Record</h3>
            {incident.status !== 'Resolved' && (
              <Button size="sm" variant="primary" onClick={() => onNavigateToResolve(incident.id)}>
                Edit & Resolve
              </Button>
            )}
          </div>

          {incident.resolution ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Verified Root Cause:</span>
                  <HindsightBadge label="Retained in Hindsight" />
                </div>
                <p className="text-emerald-950 dark:text-emerald-300 font-medium leading-relaxed">
                  {incident.resolution.verified_root_cause}
                </p>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Verified by: <span className="font-semibold">{incident.resolution.verified_by_user}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] space-y-1.5">
                  <span className="font-semibold text-[#172033] dark:text-[#F1F5F9]">Mitigation Applied:</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8]">{incident.resolution.mitigation_applied}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] space-y-1.5">
                  <span className="font-semibold text-[#172033] dark:text-[#F1F5F9]">Permanent Architectural Fix:</span>
                  <p className="text-[#64748B] dark:text-[#94A3B8]">{incident.resolution.permanent_fix}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] dark:text-[#94A3B8] text-xs space-y-3">
              <p>This incident is still open and has not yet been resolved or retained.</p>
              <Button size="sm" variant="primary" onClick={() => onNavigateToResolve(incident.id)}>
                Verify & Submit Postmortem
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Tab 5: Notes & Evidence */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              <span>Log Investigation Note or Telemetry Evidence</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log observation, diagnostic findings, pprof profile results, or runbook execution notes..."
                className="w-full bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-xl p-3 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] font-mono"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Engineer alias"
                      className="bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-lg px-2.5 py-1 text-xs text-[#172033] dark:text-[#F1F5F9] font-mono focus:outline-none focus:border-[#4F46E5] w-36"
                    />
                  </div>

                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] rounded-lg px-2.5 py-1 text-xs text-[#172033] dark:text-[#F1F5F9] font-mono focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                  >
                    <option value="investigation_note" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Investigation Note</option>
                    <option value="evidence" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Diagnostic Evidence</option>
                    <option value="hypothesis" className="bg-white dark:bg-[#141820] text-[#172033] dark:text-[#F1F5F9]">Hypothesis Refinement</option>
                  </select>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmittingNote ? 'Saving...' : 'Add Note to Dossier'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Notes List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              Chronological Investigation Notes ({incident.notes?.length || 0})
            </h4>

            {(!incident.notes || incident.notes.length === 0) ? (
              <div className="p-8 text-center text-[#64748B] dark:text-[#94A3B8] text-xs bg-white dark:bg-[#141820] rounded-2xl border border-[#E2E8F0] dark:border-[#222834]">
                No investigation notes logged yet. Use the form above to record diagnostic observations.
              </div>
            ) : (
              [...incident.notes].reverse().map((n: any, idx: number) => (
                <div key={n.id || idx} className="p-4 rounded-xl bg-white dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" />
                        {n.author || 'sre-engineer'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-semibold">
                        {n.note_type || 'note'}
                      </span>
                    </div>
                    <span className="text-[#94A3B8] text-[11px]">
                      {n.timestamp ? new Date(n.timestamp).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-[#172033] dark:text-[#F1F5F9] font-mono whitespace-pre-wrap leading-relaxed">
                    {n.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Audit Trail */}
      {activeTab === 'audit' && (
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
              <History className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
              <span>Immutable Operational Audit Trail</span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Tracks all lifecycle transitions, evidence additions, and Hindsight knowledge retentions.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {(!incident.audit_trail || incident.audit_trail.length === 0) ? (
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                No local audit entries recorded.
              </div>
            ) : (
              [...incident.audit_trail].reverse().map((a: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] flex items-start justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] font-bold text-[#172033] dark:text-[#F1F5F9] text-[11px]">
                        {a.action}
                      </span>
                      <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">• by {a.user || 'system'}</span>
                    </div>
                    <p className="text-[#172033] dark:text-[#F1F5F9] text-[11px]">{a.details}</p>
                  </div>
                  <span className="text-[#94A3B8] text-[10px] whitespace-nowrap">
                    {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

