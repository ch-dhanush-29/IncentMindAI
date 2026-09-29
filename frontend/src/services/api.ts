import type { Incident, InvestigationResult } from '../types/incident';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getIncidents(service?: string, severity?: string, status?: string, q?: string): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (severity) params.append('severity', severity);
    if (status) params.append('status', status);
    if (q) params.append('q', q);
    const res = await fetch(`${BASE_URL}/incidents?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
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

  async getAnalyticsSummary(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics summary');
    return res.json();
  },

  async getAnalyticsTrends(): Promise<any> {
    const res = await fetch(`${BASE_URL}/analytics/trends`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    return res.json();
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
