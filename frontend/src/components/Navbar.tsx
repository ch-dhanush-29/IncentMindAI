import React, { useState, useEffect } from 'react';
import { Search, Database, Menu, Plus, LayoutGrid, Bell, HelpCircle, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ClerkAuthControl } from './ClerkAuth';

interface NavbarProps {
  onSearch?: (q: string) => void;
  openCreateModal: () => void;
  currentTab: string;
  onToggleMobileSidebar?: () => void;
  onNavigateLanding?: () => void;
  onOpenHelp?: () => void;
  onOpenUserHistory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  openCreateModal, 
  currentTab,
  onToggleMobileSidebar,
  onNavigateLanding,
  onOpenHelp,
  onOpenUserHistory
}) => {
  const [sseStatus, setSseStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events/stream');

        eventSource.onopen = () => {
          setSseStatus('connected');
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type !== 'PING') {
              setLastEvent(`${data.type}`);
              // Broadcast custom window event so all active views refresh immediately in real time
              window.dispatchEvent(new CustomEvent('incident_stream_update', { detail: data }));
            }
          } catch (e) {
            // heartbeats
          }
        };

        eventSource.onerror = () => {
          setSseStatus('connecting');
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect after 4s
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (e) {
        setSseStatus('error');
      }
    };

    connectSSE();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
    };
  }, []);

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    incidents: 'Incidents',
    'incident-detail': 'Incident Dossier',
    investigation: 'AI Investigation Studio',
    'after-action': 'After Action Reports',
    improvements: 'Improvement Items',
    'memory-explorer': 'Reports & Hindsight Memory',
    history: 'Incident Archive',
    analytics: 'Analytics',
    postmortem: 'Resolution & Retain',
    settings: 'Settings'
  };

  const currentTitle = tabTitles[currentTab] || 'Dashboard';

  return (
    <header className="h-16 border-b border-[#E2E8F0] dark:border-[#1E2430] bg-white dark:bg-[#0E1117] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] md:hidden cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] text-xs font-mono font-bold text-[#172033] dark:text-[#F1F5F9]">
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
            <span>IRHQ</span>
          </div>
          <span className="text-[#94A3B8] dark:text-[#475569] font-mono text-sm">/</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] dark:bg-indigo-400" />
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, CVEs, runbooks, memory... (⌘K)"
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] rounded-xl pl-9 pr-10 py-1.5 text-xs text-[#172033] dark:text-[#F1F5F9] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] focus:bg-white dark:focus:bg-[#111827] focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-colors font-sans"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#1E2430] border border-[#E2E8F0] dark:border-[#2D3545] text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Live SSE Telemetry Status Indicator */}
        <div 
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium font-mono ${
            sseStatus === 'connected'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400'
          }`}
          title={lastEvent ? `Last SSE Event: ${lastEvent}` : 'Live Real-time Event Stream'}
        >
          <span className={`w-2 h-2 rounded-full ${sseStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
          <span>{sseStatus === 'connected' ? 'SSE Live' : 'SSE Connecting'}</span>
          {lastEvent && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans hidden 2xl:inline">
              • {lastEvent}
            </span>
          )}
        </div>

        {/* Notifications Icon */}
        <button 
          className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#161B22] border border-[#E2E8F0] dark:border-[#222834] transition-colors relative cursor-pointer"
          title="Incident Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Operational Guide & Help Button */}
        {onOpenHelp && (
          <button 
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:bg-[#EEF2FF] dark:hover:bg-[#1E2536] border border-[#E2E8F0] dark:border-[#222834] transition-colors relative cursor-pointer"
            title="Operational User Guide & Live Manual"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* User Account Activity History Button */}
        {onOpenUserHistory && (
          <button 
            onClick={onOpenUserHistory}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:bg-[#EEF2FF] dark:hover:bg-[#1E2536] border border-[#E2E8F0] dark:border-[#222834] transition-colors relative cursor-pointer flex items-center gap-1.5"
            title="My Account Activity History & Persistent Audit Log"
          >
            <History className="w-4 h-4" />
            <span className="hidden xl:inline text-xs font-medium">My History</span>
          </button>
        )}

        {/* Theme Mode Toggle */}
        <ThemeToggle />

        {/* Clerk User Button / Sign In */}
        <ClerkAuthControl compact={false} />

        {/* Action Button: + New Incident */}
        <button
          onClick={openCreateModal}
          className="px-3.5 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Incident</span>
        </button>
      </div>
    </header>
  );
};
