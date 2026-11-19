import React from 'react';
import { Search, Bell, Shield, Terminal, Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onSearch?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <header className="h-16 border-b border-[#1e2a44] bg-[#0c1220]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incidents, commits, trace IDs, services (Press /)..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-[#131b2f] border border-[#233152] rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#1a243e] px-1.5 py-0.5 rounded text-gray-400 border border-[#2b3c63]">
            /
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Environment Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131b2f] border border-[#233152] text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium">production-us-east-1</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
        </div>

        {/* Demo / Live Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>SANDBOX MODE</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#131b2f] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1e2a44]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
            VS
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-medium text-gray-200">Vivek Sundar</div>
            <div className="text-[10px] text-gray-500">Staff SRE Architect</div>
          </div>
        </div>
      </div>
    </header>
  );
};
