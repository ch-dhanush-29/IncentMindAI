import type React from 'react';
import { Search, Database, Bell, Shield, Radio, Menu, Plus, Sparkles, Command } from 'lucide-react';
import { Button } from './ui';

interface NavbarProps {
  onSearch?: (q: string) => void;
  openCreateModal: () => void;
  currentTab: string;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  openCreateModal, 
  currentTab,
  onToggleMobileSidebar
}) => {
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Operations Dashboard', subtitle: 'Live incident metrics & MTTR trends' },
    incidents: { title: 'Production Incidents Feed', subtitle: 'Active alerts & telemetry triage' },
    'incident-detail': { title: 'Incident Dossier', subtitle: 'War room timeline, telemetry & root cause analysis' },
    investigation: { title: 'AI Investigation Studio', subtitle: 'Grounded diagnosis powered by Hindsight' },
    'memory-explorer': { title: 'Hindsight Memory Explorer', subtitle: 'TEMPR memory bank records & audit logs' },
    history: { title: 'Incident Knowledge Archive', subtitle: 'Searchable historical incidents & postmortems' },
    analytics: { title: 'SRE Performance Analytics', subtitle: 'Recurrence rates, MTTR analysis, and service health' },
    postmortem: { title: 'Resolution Verification & Retain', subtitle: 'Human-confirmed knowledge persistence' },
    settings: { title: 'System & Connectivity Settings', subtitle: 'Hindsight, Groq, and MongoDB health' }
  };

  const current = tabTitles[currentTab] || { title: 'IncidentMind AI', subtitle: 'Persistent Memory SRE Platform' };

  return (
    <header className="h-16 border-b border-border bg-[#0B0F19]/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-border md:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className="text-slate-400">IncidentMind</span>
            <span>/</span>
            <span className="text-accent-cyan font-semibold">{current.title}</span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-none mt-1">{current.title}</h2>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search symptoms, services, error traces, or postmortems..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all font-sans"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cluster: <span className="text-white font-semibold">prod-east-1</span></span>
          <span className="text-[10px] text-slate-400 font-sans border-l border-slate-700 pl-1.5">3ms</span>
        </div>

        {/* Hindsight Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 text-xs font-mono text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
          <Database className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Hindsight TEMPR</span>
        </div>

        {/* Action Button */}
        <button
          onClick={openCreateModal}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-accent-blue hover:from-blue-500 hover:to-blue-600 text-white font-medium text-xs shadow-md shadow-blue-500/25 border border-blue-400/40 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Declare Incident</span>
        </button>
      </div>
    </header>
  );
};

