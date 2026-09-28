import type React from 'react';
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
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-accent-cyan' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    isActive 
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_8px_rgba(0,210,255,0.2)]' 
                      : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!collapsed && !item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-border bg-[#060911]/90 text-xs text-slate-400">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 mb-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/40 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-cyan-950/50">
                SRE
              </div>
              <div className="truncate flex-1">
                <div className="text-slate-200 font-semibold text-xs truncate flex items-center justify-between">
                  <span>Incident Commander</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">scope: prod-global</div>
              </div>
            </div>
            <div className="space-y-1 text-[10px] text-slate-400 pt-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> Groq Fast Llama-70B</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Bank: incidentmind-prod</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-accent-cyan font-mono text-xs" title="Production SRE">
              SRE
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

