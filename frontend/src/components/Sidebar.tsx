import type React from 'react';
import { 
  Eye,
  Home, 
  ShieldAlert, 
  FileText, 
  Lightbulb, 
  BarChart2, 
  Layers, 
  Settings, 
  ChevronLeft,
  ChevronRight, 
  Radio, 
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ClerkAuthControl } from './ClerkAuth';

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
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'incidents', label: 'Incidents', icon: ShieldAlert, badge: 'Live' },
    { id: 'after-action', label: 'After Action Reports', icon: FileText },
    { id: 'improvements', label: 'Improvement Items', icon: Lightbulb, badge: '6' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'memory-explorer', label: 'Reports', icon: Layers, badge: 'TEMPR' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white dark:bg-[#0E1117] border-r border-[#E2E8F0] dark:border-[#1E2430] flex flex-col justify-between h-screen select-none transition-all duration-300 relative z-30 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#1E2430] flex items-center justify-between">
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 overflow-hidden cursor-pointer group"
            title="IRHQ IncidentMind AI"
          >
            <div className="w-9 h-9 min-w-9 rounded-xl bg-slate-950 dark:bg-[#161B22] border border-indigo-500/30 dark:border-indigo-500/40 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="font-bold text-sm tracking-tight text-[#172033] dark:text-[#F1F5F9] flex items-center gap-1.5 font-mono">
                  <span>IRHQ</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 font-semibold">AI</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">Incident Command Center</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#161B22] border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#2D3545] transition-colors hidden md:block cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Section Title */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] dark:text-[#64748B]">
            Navigation
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
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
                    ? 'bg-[#EEF2FF] dark:bg-[#1E2536] text-[#4F46E5] dark:text-indigo-400 font-semibold border border-indigo-100 dark:border-indigo-900/50'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F1F5F9] hover:bg-[#F8FAFC] dark:hover:bg-[#161B22] border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#4F46E5] dark:text-indigo-400' : 'text-[#94A3B8] dark:text-[#64748B] group-hover:text-[#64748B] dark:group-hover:text-[#94A3B8]'
                  }`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    isActive 
                      ? 'bg-white dark:bg-[#111827] text-[#4F46E5] dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                      : 'bg-slate-100 dark:bg-[#1F2937] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!collapsed && !item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" />
                )}
              </button>
            );
          })}

          {/* Landing page link */}
          <div className="pt-2 mt-2 border-t border-[#E2E8F0] dark:border-[#1E2430]">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center py-2.5' : 'px-3 py-2'
              } rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-indigo-400 hover:bg-[#EEF2FF]/60 dark:hover:bg-[#1E2536]/50 transition-colors cursor-pointer`}
              title="Product Landing Page"
            >
              <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400 mr-2 flex-shrink-0" />
              {!collapsed && <span>Product Overview</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1E2430] bg-[#F8FAFC] dark:bg-[#0B0D11] text-xs text-[#64748B] dark:text-[#94A3B8]">
        {!collapsed ? (
          <>
            {/* Theme Toggle row */}
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">Theme</span>
              <ThemeToggle showLabel={true} className="py-1 px-2 text-[11px]" />
            </div>

            {/* Clerk User / SRE Profile Card */}
            <div className="p-2 mb-2 rounded-xl bg-white dark:bg-[#141820] border border-[#E2E8F0] dark:border-[#222834] shadow-xs">
              <ClerkAuthControl compact={false} />
            </div>

            {/* Live Infrastructure Status */}
            <div className="space-y-1 text-[10px] text-[#64748B] dark:text-[#94A3B8] pt-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" /> 
                  <span>Groq Fast Inference</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vectorize Hindsight</span>
                <span className={`font-semibold ${hindsightConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                  {hindsightConnected ? 'CLOUD ACTIVE' : 'SANDBOX'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <ThemeToggle className="p-1.5" />
            <ClerkAuthControl compact={true} />
            <div className={`w-2.5 h-2.5 rounded-full ${hindsightConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} title="Hindsight Connected" />
          </div>
        )}
      </div>
    </aside>
  );
};
