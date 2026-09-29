import type { Incident, InvestigationResult } from '../types/incident';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// High-speed client cache for sub-millisecond tab switching
let incidentsCache: { data: Incident[]; timestamp: number } | null = null;
let analyticsSummaryCache: { data: any; timestamp: number } | null = null;
let analyticsTrendsCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 20000; // 20s TTL

if (typeof window !== 'undefined') {
  window.addEventListener('incident_stream_update', () => {
    incidentsCache = null;
    analyticsSummaryCache = null;
    analyticsTrendsCache = null;
  });
}

export const api = {
  clearCache() {
    incidentsCache = null;
    analyticsSummaryCache = null;
    analyticsTrendsCache = null;
  },

  async getIncidents(service?: string, severity?: string, status?: string, q?: string, assignee?: string, forceRefresh = false): Promise<Incident[]> {
    const isUnfiltered = !service && !severity && !status && !assignee && !q;
    if (isUnfiltered && !forceRefresh && incidentsCache && (Date.now() - incidentsCache.timestamp) < CACHE_TTL_MS) {
      return incidentsCache.data;
    }
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (severity) params.append('severity', severity);
    if (status) params.append('status', status);
    if (assignee) params.append('assignee', assignee);
    if (q) params.append('q', q);
    const res = await fetch(`${BASE_URL}/incidents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const data = await res.json();
    if (isUnfiltered) {
      incidentsCache = { data, timestamp: Date.now() };
    }
    return data;
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch incident');
    return res.json();
  },

  async createIncident(data: any): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async updateIncident(id: string, data: any): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return res.json();
  },

  async addNote(id: string, content: string, author: string = 'sre-engineer', note_type: string = 'investigation_note'): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author, note_type }),
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  async reopenIncident(id: string, reason: string = 'Reopened for investigation', engineer: string = 'sre-engineer'): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, engineer }),
    });
    if (!res.ok) throw new Error('Failed to reopen incident');
    return res.json();
  },

  async analyzeIncident(id: string, useMemory: boolean = true): Promise<InvestigationResult> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/analyze?use_memory=${useMemory}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Investigation failed');
    return res.json();
  },

  async askQuestion(id: string, question: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Failed to query agent');
    return res.json();
  },

  async resolveIncident(id: string, resolution: any): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resolution),
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    return res.json();
  },

  async getMemories(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/memory/records`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async getMemoryAudit(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/memory/audit`);
    if (!res.ok) throw new Error('Failed to fetch memory audit');
    return res.json();
  },

  async getAnalyticsSummary(forceRefresh = false): Promise<any> {
    if (!forceRefresh && analyticsSummaryCache && (Date.now() - analyticsSummaryCache.timestamp) < CACHE_TTL_MS) {
      return analyticsSummaryCache.data;
    }
    const res = await fetch(`${BASE_URL}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics summary');
    const data = await res.json();
    analyticsSummaryCache = { data, timestamp: Date.now() };
    return data;
  },

  async getAnalyticsTrends(forceRefresh = false): Promise<any> {
    if (!forceRefresh && analyticsTrendsCache && (Date.now() - analyticsTrendsCache.timestamp) < CACHE_TTL_MS) {
      return analyticsTrendsCache.data;
    }
    const res = await fetch(`${BASE_URL}/analytics/trends`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    const data = await res.json();
    analyticsTrendsCache = { data, timestamp: Date.now() };
    return data;
  },

  async getHealthReady(): Promise<any> {
    const res = await fetch(`${BASE_URL}/health/ready`);
    if (!res.ok) throw new Error('Failed to fetch health');
    return res.json();
  },

  async getSettings(): Promise<any> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async getAudit(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit');
    return res.json();
  },

  async getSlackStatus(): Promise<any> {
    const res = await fetch(`${BASE_URL}/webhooks/slack/status`);
    if (!res.ok) throw new Error('Failed to fetch Slack status');
    return res.json();
  },

  async testSlackAlert(): Promise<any> {
    const res = await fetch(`${BASE_URL}/webhooks/slack/test`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to test Slack alert');
    return res.json();
  }
};
