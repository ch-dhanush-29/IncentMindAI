import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  User, 
  MoreHorizontal, 
  AlertCircle, 
  Search, 
  Plus, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export const ImprovementItems: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const items = [
    {
      id: 'IMP-101',
      title: '123 Test - Jira Assign ID Test',
      sourceIncident: 'Jira Assign ID Test',
      assignee: 'Ryan Cox (Analyst)',
      role: 'Security Analyst',
      priority: 'High',
      status: 'In Progress',
      jiraKey: 'IR-1042',
      dueDate: 'Oct 15, 2026',
      description: 'Implement automated Jira issue binding on incident declaration and webhook status sync.'
    },
    {
      id: 'IMP-102',
      title: 'Testing Improvement Items - Jira Assign ID Test',
      sourceIncident: 'Jira Assign ID Test',
      assignee: 'Ryan Cox (Analyst)',
      role: 'Security Analyst',
      priority: 'Medium',
      status: 'In Progress',
      jiraKey: 'IR-1043',
      dueDate: 'Oct 18, 2026',
      description: 'Validate postmortem action item escalation and automated assignment triggers.'
    },
    {
      id: 'IMP-103',
      title: '789 improve 10 - Generic Phishing Incident',
      sourceIncident: 'Generic Phishing Incident',
      assignee: 'Unassigned',
      role: 'Security Operations',
      priority: 'Critical',
      status: 'In Progress',
      jiraKey: 'SEC-4412',
      dueDate: 'Oct 12, 2026',
      description: 'Enforce mandatory hardware security keys (WebAuthn/FIDO2) across all admin access portals.'
    },
    {
      id: 'IMP-104',
      title: 'Deploy pgbouncer pool buffer for checkout surge',
      sourceIncident: 'PostgreSQL Pool Saturation',
      assignee: 'Carlos Ruiz',
      role: 'Infrastructure SRE',
      priority: 'Critical',
      status: 'Completed',
      jiraKey: 'INFRA-4421',
      dueDate: 'Sep 29, 2026',
      description: 'Deploy pgbouncer sidecar with transaction pooling to eliminate direct JDBC exhaustion.'
    },
    {
      id: 'IMP-105',
      title: 'Add HikariCP thread pool alert & leak detection threshold',
      sourceIncident: 'Payment API Latency Spike',
      assignee: 'Jane Smith',
      role: 'Database Engineer',
      priority: 'High',
      status: 'In Progress',
      jiraKey: 'PAY-904',
      dueDate: 'Oct 20, 2026',
      description: 'Emit Prometheus gauge for HikariCP active connection ratio; page oncall when > 80% for 3m.'
    },
    {
      id: 'IMP-106',
      title: 'Enforce hardware MFA & token rotation on executive endpoints',
      sourceIncident: 'Data Leak Suspected',
      assignee: 'John Doe',
      role: 'Identity SecOps',
      priority: 'High',
      status: 'In Progress',
      jiraKey: 'SEC-8812',
      dueDate: 'Oct 22, 2026',
      description: 'Rotate compromised credential scopes and deploy automated token expiration policies.'
    }
  ];

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.jiraKey.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'in_progress') return matchesSearch && item.status === 'In Progress';
    if (statusFilter === 'completed') return matchesSearch && item.status === 'Completed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Improvement Items & Preventive Actions
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Track corrective actions, Jira integrations, and preventive tasks to eliminate recurring incident patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] p-1 border border-[#E2E8F0] dark:border-[#222834] text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'in_progress' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              In Progress (5)
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'completed' 
                  ? 'bg-white dark:bg-[#1E2536] text-emerald-600 dark:text-emerald-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              Completed (1)
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search improvement items, assignees, or Jira keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl pl-10 pr-4 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
        />
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] dark:bg-[#181D26] border-b border-[#E2E8F0] dark:border-[#222834] text-[#64748B] dark:text-[#94A3B8] font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-medium">Task & Context</th>
                <th className="py-3 px-4 font-medium">Assignee</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Jira Ref</th>
                <th className="py-3 px-4 font-medium">Due Date</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#222834]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#181D26]/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#172033] dark:text-[#F1F5F9]">{item.title}</div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">{item.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[#172033] dark:text-[#F1F5F9]">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-medium">{item.assignee}</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">{item.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.priority === 'Critical' 
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        : item.priority === 'High'
                        ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                      item.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                    }`}>
                      {item.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#4F46E5] dark:text-indigo-400">
                    <span className="hover:underline cursor-pointer flex items-center gap-1">
                      {item.jiraKey}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    {item.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded-md text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#1E2536] cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
