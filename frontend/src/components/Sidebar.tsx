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
  ChevronLeft 
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
      className={`bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen select-none transition-all duration-300 relative z-30 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-9 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <h1 className="font-bold text-sm tracking-tight text-[#172033] flex items-center gap-1.5">
                  IncidentMind <span className="text-[#4F46E5] text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EEF2FF] border border-indigo-100 font-semibold">AI</span>
                </h1>
                <p className="text-[11px] text-[#64748B] truncate">Agentic SRE Memory</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors hidden md:block cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Hindsight Bank Indicator */}
        {!collapsed ? (
          <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hindsightConnected ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-400'}`} />
              <span className="text-[#172033] font-mono text-[11px] font-medium">Hindsight Bank</span>
            </div>
            <span className="text-[10px] text-[#4F46E5] font-mono bg-[#EEF2FF] border border-indigo-100 px-1.5 py-0.5 rounded font-medium">TEMPR Active</span>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${hindsightConnected ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-400'}`} title="Hindsight Connected" />
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
                } rounded-xl text-xs font-medium transition-colors duration-150 relative group cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-indigo-100'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                  }`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    isActive 
                      ? 'bg-white text-[#4F46E5] border-indigo-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!collapsed && !item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#4F46E5]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 mb-2.5 p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center text-[#4F46E5] font-mono font-bold text-xs">
                SRE
              </div>
              <div className="truncate flex-1">
                <div className="text-[#172033] font-semibold text-xs truncate flex items-center justify-between">
                  <span>Incident Commander</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono truncate">scope: prod-global</div>
              </div>
            </div>
            <div className="space-y-1 text-[10px] text-[#64748B] pt-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Radio className="w-2.5 h-2.5 text-emerald-600" /> Groq Fast Llama-70B</span>
                <span className="text-emerald-700 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Bank: incidentmind-prod</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center text-[#4F46E5] font-mono text-xs font-bold" title="Production SRE">
              SRE
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
