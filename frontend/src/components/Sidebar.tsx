import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Network,
  Boxes,
  ShieldCheck,
  History,
  Settings,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCount = 1 }) => {
  const navItems = [
    { name: 'Command Center', path: '/', icon: LayoutDashboard },
    { name: 'Investigations', path: '/investigations', icon: Search, badge: activeCount > 0 ? `${activeCount} Active` : undefined },
    { name: 'Evidence Graph', path: '/evidence-graph', icon: Network },
    { name: 'Integrations', path: '/integrations', icon: Boxes },
    { name: 'Fix & Verify', path: '/fix-verify', icon: ShieldCheck },
    { name: 'Incident History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0c1220] border-r border-[#1e2a44] flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-[#1e2a44]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
              ROOTCAUSE <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-mono">AI</span>
            </div>
            <div className="text-[10px] text-gray-400 tracking-wider">AUTONOMOUS SRE</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-inner'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#131b2f]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Telemetry Status */}
      <div className="p-4 border-t border-[#1e2a44] bg-[#090d16]/60">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-medium">Engine Online</span>
          </span>
          <span className="font-mono text-[11px] text-gray-500">v1.4.2</span>
        </div>
        <div className="text-[11px] text-gray-500 leading-tight">
          AI Investigation Core connected with verified telemetry sandbox.
        </div>
      </div>
    </aside>
  );
};
