import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Home, Sparkles, Activity } from 'lucide-react';

interface NavbarProps {
  onSearch?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-[#1a253e] bg-[#0a0f1d]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10" role="banner">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search Causiq incidents, trace IDs, and commits"
            placeholder="Search Causiq incidents, trace IDs, commits (Press /)..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-[#12192d] border border-[#212f4d] rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#1a233c] px-1.5 py-0.5 rounded text-gray-400 border border-[#263557]" aria-hidden="true">
            /
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Return to Home Landing Page */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12192d] hover:bg-[#1a243e] border border-[#212f4d] text-xs font-semibold text-gray-300 transition-colors cursor-pointer focus:ring-2 focus:ring-violet-500 focus:outline-none"
          title="Return to Landing Page"
          aria-label="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        {/* Environment Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12192d] border border-[#212f4d] text-xs text-gray-300" role="status" aria-label="Current Cluster Environment">
          <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
          <span className="font-semibold text-[11px]">production-us-east-1</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" aria-hidden="true" />
        </div>

        {/* Live Mode Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-mono font-semibold" aria-live="polite">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
          <span>CAUSIQ LIVE</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1a253e]" aria-label="User Account: Vivek Sundar">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20" aria-label="Initials VS">
            VS
          </div>
          <div className="text-left hidden md:block">
            <span className="sr-only">Logged in as Vivek Sundar</span>
          </div>
        </div>
      </div>
    </header>
  );
};
