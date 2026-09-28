import type React from 'react';
import { Search, Database, Menu, Plus, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onSearch?: (q: string) => void;
  openCreateModal: () => void;
  currentTab: string;
  onToggleMobileSidebar?: () => void;
  onNavigateLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  openCreateModal, 
  currentTab,
  onToggleMobileSidebar,
  onNavigateLanding
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
    <header className="h-16 border-b border-[#E2E8F0] bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-[#E2E8F0] md:hidden cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
            <button 
              onClick={onNavigateLanding} 
              className="hover:text-[#4F46E5] hover:underline cursor-pointer"
              title="Return to Product Landing Page"
            >
              IncidentMind
            </button>
            <span>/</span>
            <span className="text-[#4F46E5] font-semibold">{current.title}</span>
          </div>
          <h2 className="text-sm font-bold text-[#172033] tracking-tight leading-none mt-1">{current.title}</h2>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search symptoms, services, error traces, or postmortems..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-10 py-1.5 text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-colors font-sans"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#64748B] font-mono">
            <span>/</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Product Landing Link */}
        {onNavigateLanding && (
          <button
            onClick={onNavigateLanding}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#EEF2FF] hover:border-indigo-200 text-xs font-medium text-[#64748B] hover:text-[#4F46E5] transition-colors cursor-pointer"
            title="View Product Landing Page"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Product Tour</span>
          </button>
        )}

        {/* Environment Badge */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#64748B]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Cluster: <span className="text-[#172033] font-semibold">prod-east-1</span></span>
          <span className="text-[10px] text-[#94A3B8] font-sans border-l border-[#E2E8F0] pl-1.5">3ms</span>
        </div>

        {/* Hindsight Status */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EEF2FF] border border-indigo-100 text-xs font-mono text-[#4F46E5] font-medium">
          <Database className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>Hindsight TEMPR</span>
        </div>

        {/* Theme Mode Toggle */}
        <ThemeToggle />

        {/* Action Button */}
        <button
          onClick={openCreateModal}
          className="px-3.5 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Declare Incident</span>
        </button>
      </div>
    </header>
  );
};
