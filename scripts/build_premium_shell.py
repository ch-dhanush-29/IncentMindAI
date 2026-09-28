# 1. Sidebar.tsx
sidebar_code = """import type React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronRight,
  Radio,
  Archive,
  LineChart,
  Layers,
  ChevronLeft,
  Server
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hindsightConnected: boolean;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  hindsightConnected,
  collapsed,
  setCollapsed
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: BarChart3, badge: 'Live' },
    { id: 'incidents', label: 'Incidents Feed', icon: Activity },
    { id: 'investigation', label: 'AI Investigation', icon: BrainCircuit, badge: 'Hindsight' },
    { id: 'memory-explorer', label: 'Memory Explorer', icon: ShieldAlert, badge: 'TEMPR' },
    { id: 'history', label: 'Incident Archive', icon: Archive },
    { id: 'analytics', label: 'Deep Analytics', icon: LineChart },
    { id: 'postmortem', label: 'Resolution & Retain', icon: FileText },
    { id: 'settings', label: 'System & Health', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-sidebar border-r border-border flex flex-col justify-between h-screen select-none transition-all duration-300 relative z-30 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-9 rounded-xl bg-gradient-to-tr from-accent-blue via-blue-600 to-accent-cyan flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <BrainCircuit className="w-5 h-5 text-white font-bold" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  IncidentMind <span className="text-accent-cyan text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-700/60">AI</span>
                </h1>
                <p className="text-[11px] text-gray-400 truncate">Agentic SRE Memory</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-card border border-transparent hover:border-border transition-colors hidden md:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Hindsight Bank Indicator */}
        {!collapsed ? (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-card/70 border border-border/90 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hindsightConnected ? 'bg-emerald-400 ring-2 ring-emerald-500/20 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-gray-300 font-mono text-[11px]">Hindsight Bank</span>
            </div>
            <span className="text-[10px] text-accent-cyan font-mono bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded font-medium">TEMPR Active</span>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${hindsightConnected ? 'bg-emerald-400 ring-2 ring-emerald-500/20 animate-pulse' : 'bg-amber-400'}`} title="Hindsight Connected" />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center ${
                  collapsed ? 'justify-center py-3' : 'justify-between px-3 py-2.5'
                } rounded-lg text-xs font-medium transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-accent-blue/15 text-accent-cyan border border-accent-cyan/35 shadow-sm shadow-cyan-950/30 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-card/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent-cyan' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    isActive ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60' : 'bg-card text-gray-400 border-border'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!collapsed && !item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-accent-cyan" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-border bg-sidebar/90 text-xs text-gray-400">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-accent-cyan font-mono font-bold text-xs shadow-inner">
                SR
              </div>
              <div className="truncate">
                <div className="text-gray-200 font-medium text-xs truncate">Production SRE</div>
                <div className="text-[10px] text-gray-500 font-mono truncate">workspace: prod-east</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-border/50 font-mono">
              <span className="flex items-center gap-1.5"><Radio className="w-2.5 h-2.5 text-emerald-400" /> Groq Fast</span>
              <span>v1.0.0</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-accent-cyan font-mono text-xs" title="Production SRE">
              SR
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
"""

# 2. Navbar.tsx
navbar_code = """import type React from 'react';
import { Search, Database, Bell, Sun, Moon, Shield, Radio, Menu } from 'lucide-react';
import { Badge } from './ui';

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
    investigation: { title: 'AI Investigation Studio', subtitle: 'Grounded diagnosis powered by Hindsight' },
    'memory-explorer': { title: 'Hindsight Memory Explorer', subtitle: 'TEMPR memory bank records & audit logs' },
    history: { title: 'Incident Knowledge Archive', subtitle: 'Searchable historical incidents & postmortems' },
    analytics: { title: 'SRE Performance Analytics', subtitle: 'Recurrence rates, MTTR analysis, and service health' },
    postmortem: { title: 'Resolution Verification & Retain', subtitle: 'Human-confirmed knowledge persistence' },
    settings: { title: 'System & Connectivity Settings', subtitle: 'Hindsight, Groq, and MongoDB health' }
  };

  const current = tabTitles[currentTab] || { title: 'IncidentMind AI', subtitle: 'Persistent Memory SRE Platform' };

  return (
    <header className="h-15 border-b border-border bg-card/70 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-background border border-border md:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
            <span>IncidentMind</span>
            <span>/</span>
            <span className="text-accent-cyan font-medium">{current.title}</span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-none mt-0.5">{current.title}</h2>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search symptoms, services, error traces, or postmortems..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-background/90 border border-border/90 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-mono text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cluster: <span className="text-gray-200 font-semibold">prod-east-1</span></span>
        </div>

        {/* Hindsight Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/60 text-xs font-mono text-purple-300">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span>Hindsight TEMPR</span>
        </div>

        {/* Action Button */}
        <button
          onClick={openCreateModal}
          className="px-3 py-1.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium text-xs shadow-sm shadow-blue-500/25 border border-blue-400/30 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span className="text-sm font-bold leading-none">+</span> Declare Incident
        </button>
      </div>
    </header>
  );
};
"""

with open(r"d:\IncidentMind AI\frontend\src\components\Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(sidebar_code)
print("Updated Sidebar.tsx")

with open(r"d:\IncidentMind AI\frontend\src\components\Navbar.tsx", "w", encoding="utf-8") as f:
    f.write(navbar_code)
print("Updated Navbar.tsx")
