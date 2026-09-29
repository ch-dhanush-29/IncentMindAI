import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  User, 
  ExternalLink, 
  Search, 
  Database, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';

export const AfterActionReports: React.FC<{
  onSelectIncident?: (id: string) => void;
}> = ({ onSelectIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'verified' | 'retained'>('all');

  const reports = [
    {
      id: 'AAR-2026-089',
      incidentId: 'INC-11790C',
      title: 'PostgreSQL Connection Pool Saturation Under Peak Checkout Load',
      service: 'payment-api',
      severity: 'Critical',
      leadResponder: 'Ryan Cox (Administrator)',
      leadRole: 'Lead Security Engineer',
      duration: '18 minutes',
      resolvedDate: '5/17/2025',
      rootCause: 'HikariCP connection leak in webhook retry executor combined with max_connections ceiling of 100 in RDS parameter group.',
      fix: 'Patched PaymentWebhookClient with try-with-resources; scaled RDS connections and deployed pgbouncer pooling layer.',
      isRetainedInHindsight: true,
      hindsightMemoryId: 'mem-0001',
      lessonsCount: 3,
      preventionTickets: ['INFRA-4421', 'PAY-904']
    },
    {
      id: 'AAR-2026-074',
      incidentId: 'INC-24748B',
      title: 'Auth Service JWT Cache Stampede on Redis Cluster Partition',
      service: 'auth-service',
      severity: 'High',
      leadResponder: 'Ryan Cox (Analyst)',
      leadRole: 'Security Analyst',
      duration: '24 minutes',
      resolvedDate: '7/28/2025',
      rootCause: 'Redis cluster failover caused missing cache entries to flood Postgres with 4,200 req/sec JWT verification queries.',
      fix: 'Implemented probabilistic early cache expiration (XFetch) and local in-memory L1 LRU cache with 60s TTL.',
      isRetainedInHindsight: true,
      hindsightMemoryId: 'mem-0002',
      lessonsCount: 4,
      preventionTickets: ['SEC-8812', 'AUTH-301']
    },
    {
      id: 'AAR-2026-052',
      incidentId: 'INC-FE828E',
      title: 'Checkout Worker Container Terminated by Kernel OOMKilled',
      service: 'checkout-worker',
      severity: 'Medium',
      leadResponder: 'Sam Hassanzadeh',
      leadRole: 'Sales Engineer',
      duration: '12 minutes',
      resolvedDate: '8/24/2025',
      rootCause: 'Unbounded in-memory queue buffer during upstream Kafka consumer rebalance.',
      fix: 'Configured Backpressure bounded ring buffer and increased container memory request limit to 1.5Gi.',
      isRetainedInHindsight: true,
      hindsightMemoryId: 'mem-0003',
      lessonsCount: 2,
      preventionTickets: ['JIRA-123', 'KAFKA-402']
    },
    {
      id: 'AAR-2026-031',
      incidentId: 'INC-SEC-019',
      title: 'Generic Phishing Incident & Credential Harvesting Protection',
      service: 'identity-gateway',
      severity: 'Critical',
      leadResponder: 'Ryan Cox Administrator',
      leadRole: 'Lead Security Engineer',
      duration: '35 minutes',
      resolvedDate: '5/17/2025',
      rootCause: 'Targeted spear-phishing campaign directed at marketing team credentials.',
      fix: 'Revoked affected session tokens, enforced FIDO2 WebAuthn hardware keys, and quarantined sender domains at MX gateway.',
      isRetainedInHindsight: true,
      hindsightMemoryId: 'mem-0004',
      lessonsCount: 5,
      preventionTickets: ['SEC-9901', 'IT-2041']
    }
  ];

  const filtered = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.leadResponder.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterRole === 'retained') return matchesSearch && r.isRetainedInHindsight;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            After Action Reports (Postmortems & Retrospectives)
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Verified post-incident analyses, confirmed root causes, and persistent knowledge stored into Hindsight memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-[#F8FAFC] dark:bg-[#161B22] p-1 border border-[#E2E8F0] dark:border-[#222834] text-xs">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterRole === 'all' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => setFilterRole('retained')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterRole === 'retained' 
                  ? 'bg-white dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 shadow-xs' 
                  : 'text-[#64748B] dark:text-[#94A3B8]'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>Hindsight Retained</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by report title, service, root cause, or lead investigator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-2xl pl-10 pr-4 py-2 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#4F46E5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                    {report.id}
                  </span>
                  <span className="font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
                    ref: {report.incidentId}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Retained in Hindsight
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172033] dark:text-[#F1F5F9] group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                  {report.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-mono">
                  <span>Service: <strong className="text-[#172033] dark:text-[#F1F5F9]">{report.service}</strong></span>
                  <span>•</span>
                  <span>Duration: {report.duration}</span>
                  <span>•</span>
                  <span>{report.resolvedDate}</span>
                </div>
              </div>

              {/* Root Cause & Fix Box */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#181D26] border border-[#E2E8F0] dark:border-[#222834] text-xs space-y-2">
                <div>
                  <div className="font-semibold text-xs text-[#172033] dark:text-[#F1F5F9]">Verified Root Cause:</div>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">{report.rootCause}</p>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#222834]">
                  <div className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">Permanent Resolution:</div>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5 leading-relaxed">{report.fix}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#222834] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{report.leadResponder}</span>
              </div>

              <button
                onClick={() => onSelectIncident && onSelectIncident(report.incidentId)}
                className="flex items-center gap-1 font-mono text-[11px] text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <span>View Incident Dossier</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
