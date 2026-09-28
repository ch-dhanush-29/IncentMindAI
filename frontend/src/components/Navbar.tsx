import type React from 'react';
import { Search, Database } from 'lucide-react';

interface NavbarProps {
  onSearch?: (q: string) => void;
  openCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, openCreateModal }) => {
  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, services, logs, or past postmortems..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-background/80 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-background border border-border text-xs font-mono text-gray-300">
          <Database className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Hindsight Memory:</span>
          <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-1.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <span className="text-sm font-bold leading-none">+</span> Declare Incident
        </button>
      </div>
    </header>
  );
};
