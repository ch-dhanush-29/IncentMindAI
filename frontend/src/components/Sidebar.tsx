import type React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronRight,
  Radio
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hindsightConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, hindsightConnected }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'incidents', label: 'Incidents Feed', icon: Activity },
    { id: 'investigation', label: 'AI Investigation Studio', icon: BrainCircuit },
    { id: 'memory-explorer', label: 'Hindsight Memory Explorer', icon: ShieldAlert },
    { id: 'postmortem', label: 'Resolution & Retain', icon: FileText },
    { id: 'settings', label: 'System & Health', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col justify-between h-screen select-none">
      <div>
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BrainCircuit className="w-5 h-5 text-background font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              IncidentMind <span className="text-accent-cyan text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">AI</span>
            </h1>
            <p className="text-xs text-gray-400">Persistent Memory SRE</p>
          </div>
        </div>

        <div className="mx-3 mt-3 px-3 py-2 rounded-md bg-card/60 border border-border/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hindsightConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-gray-300 font-mono text-[11px]">Hindsight Bank</span>
          </div>
          <span className="text-[10px] text-accent-cyan font-mono bg-cyan-950/40 px-1 rounded">TEMPR Active</span>
        </div>

        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent-blue/15 text-accent-cyan border border-accent-cyan/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-card/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent-cyan" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border bg-sidebar/80 text-xs text-gray-400">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold text-xs">
            SRE
          </div>
          <div>
            <div className="text-gray-200 font-medium">Production On-Call</div>
            <div className="text-[11px] text-gray-500 font-mono">workspace: prod-east</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-border/50 font-mono">
          <span className="flex items-center gap-1"><Radio className="w-2.5 h-2.5 text-emerald-400" /> Groq Fast</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
