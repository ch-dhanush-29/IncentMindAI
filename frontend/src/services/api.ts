import type { Incident, InvestigationResult } from '../types/incident';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// High-speed client cache for sub-millisecond tab switching
let incidentsCache: { data: Incident[]; timestamp: number } | null = null;
let analyticsSummaryCache: { data: any; timestamp: number } | null = null;
let analyticsTrendsCache: { data: any; timestamp: number } | null = null;
let memoriesCache: { data: any[]; timestamp: number } | null = null;
let memoryAuditCache: { data: any[]; timestamp: number } | null = null;
let healthReadyCache: { data: any; timestamp: number } | null = null;
let settingsCache: { data: any; timestamp: number } | null = null;
let auditCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 25000; // 25s TTL

if (typeof window !== 'undefined') {
  window.addEventListener('incident_stream_update', () => {
    incidentsCache = null;
    analyticsSummaryCache = null;
    analyticsTrendsCache = null;
    memoriesCache = null;
    memoryAuditCache = null;
    auditCache = null;
  });
}

export const api = {
  clearCache() {
    incidentsCache = null;
    analyticsSummaryCache = null;
    analyticsTrendsCache = null;
    memoriesCache = null;
    memoryAuditCache = null;
    healthReadyCache = null;
    settingsCache = null;
    auditCache = null;
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

  async addNote(
    id: string, 
    content: string, 
    author: string = 'sre-engineer', 
    note_type: string = 'investigation_note',
    userContext?: { email?: string; userId?: string }
  ): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content, 
        author, 
        note_type,
        author_email: userContext?.email,
        author_id: userContext?.userId
      }),
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  async reopenIncident(
    id: string, 
    reason: string = 'Reopened for investigation', 
    engineer: string = 'sre-engineer',
    userContext?: { email?: string; userId?: string }
  ): Promise<Incident> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        reason, 
        engineer,
        engineer_email: userContext?.email,
        engineer_id: userContext?.userId
      }),
    });
    if (!res.ok) throw new Error('Failed to reopen incident');
    return res.json();
  },

  async analyzeIncident(
    id: string, 
    useMemory: boolean = true,
    userContext?: { email?: string; name?: string; userId?: string }
  ): Promise<InvestigationResult> {
    const params = new URLSearchParams();
    params.append('use_memory', String(useMemory));
    if (userContext?.email) params.append('user_email', userContext.email);
    if (userContext?.name) params.append('user_name', userContext.name);
    if (userContext?.userId) params.append('user_id', userContext.userId);

    const res = await fetch(`${BASE_URL}/incidents/${id}/analyze?${params.toString()}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Investigation failed');
    return res.json();
  },

  async askQuestion(
    id: string, 
    question: string,
    userContext?: { email?: string; name?: string; userId?: string }
  ): Promise<any> {
    const res = await fetch(`${BASE_URL}/incidents/${id}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question,
        user_email: userContext?.email,
        user_name: userContext?.name,
        user_id: userContext?.userId
      }),
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

  // User Activity Persistence & History Tracking
  async recordUserActivity(activity: {
    user_id?: string;
    user_email: string;
    user_name?: string;
    action_type: string;
    details: string;
    incident_id?: string;
    incident_title?: string;
    metadata?: Record<string, any>;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/user/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async getUserHistory(
    userEmail?: string,
    userId?: string,
    actionType?: string,
    limit: number = 100
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (userEmail) params.append('user_email', userEmail);
    if (userId) params.append('user_id', userId);
    if (actionType && actionType !== 'ALL') params.append('action_type', actionType);
    params.append('limit', String(limit));

    const res = await fetch(`${BASE_URL}/user/history?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch user activity history');
    return res.json();
  },

  async getUserSummary(userEmail?: string, userId?: string): Promise<any> {
    const params = new URLSearchParams();
    if (userEmail) params.append('user_email', userEmail);
    if (userId) params.append('user_id', userId);

    const res = await fetch(`${BASE_URL}/user/summary?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch user summary statistics');
    return res.json();
  },

  async getMemories(forceRefresh = false): Promise<any[]> {
    if (!forceRefresh && memoriesCache && (Date.now() - memoriesCache.timestamp) < CACHE_TTL_MS) {
      return memoriesCache.data;
    }
    const res = await fetch(`${BASE_URL}/memory/records`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    const data = await res.json();
    memoriesCache = { data, timestamp: Date.now() };
    return data;
  },

  async getMemoryAudit(forceRefresh = false): Promise<any[]> {
    if (!forceRefresh && memoryAuditCache && (Date.now() - memoryAuditCache.timestamp) < CACHE_TTL_MS) {
      return memoryAuditCache.data;
    }
    const res = await fetch(`${BASE_URL}/memory/audit`);
    if (!res.ok) throw new Error('Failed to fetch memory audit');
    const data = await res.json();
    memoryAuditCache = { data, timestamp: Date.now() };
    return data;
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

  async getHealthReady(forceRefresh = false): Promise<any> {
    if (!forceRefresh && healthReadyCache && (Date.now() - healthReadyCache.timestamp) < CACHE_TTL_MS) {
      return healthReadyCache.data;
    }
    const res = await fetch(`${BASE_URL}/health/ready`);
    if (!res.ok) throw new Error('Failed to fetch health');
    const data = await res.json();
    healthReadyCache = { data, timestamp: Date.now() };
    return data;
  },

  async getSettings(forceRefresh = false): Promise<any> {
    if (!forceRefresh && settingsCache && (Date.now() - settingsCache.timestamp) < CACHE_TTL_MS) {
      return settingsCache.data;
    }
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const data = await res.json();
    settingsCache = { data, timestamp: Date.now() };
    return data;
  },

  async getAudit(forceRefresh = false): Promise<any[]> {
    if (!forceRefresh && auditCache && (Date.now() - auditCache.timestamp) < CACHE_TTL_MS) {
      return auditCache.data;
    }
    const res = await fetch(`${BASE_URL}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit');
    const data = await res.json();
    auditCache = { data, timestamp: Date.now() };
    return data;
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
