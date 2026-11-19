import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Network,
  Boxes,
  ShieldCheck,
  History,
  Settings,
  Radar,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCount = 1 }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Command Center', path: '/app', icon: LayoutDashboard },
    { name: 'Investigations', path: '/app/investigations', icon: Search, badge: activeCount > 0 ? `${activeCount} Active` : undefined },
    { name: 'Evidence Graph', path: '/app/evidence-graph', icon: Network },
    { name: 'Integrations', path: '/app/integrations', icon: Boxes },
    { name: 'Fix & Verify', path: '/app/fix-verify', icon: ShieldCheck },
    { name: 'Incident History', path: '/app/history', icon: History },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#1a253e] flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header with Return to Landing Link */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1a253e]">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
            title="Return to Causiq Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                CAUSIQ <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">AI</span>
              </div>
              <div className="text-[10px] text-gray-400 tracking-wider">SRE INVESTIGATOR</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#141d34] transition-colors"
            title="Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white border border-violet-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#121a2f]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Telemetry Status */}
      <div className="p-4 border-t border-[#1a253e] bg-[#070b16]">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold text-[11px]">Causiq Core Online</span>
          </span>
          <span className="font-mono text-[10px] text-gray-500">v2.4.0</span>
        </div>
        <div className="text-[10px] text-gray-500 leading-tight">
          Live correlation sandbox active. Secrets redacted in-memory.
        </div>
      </div>
    </aside>
  );
};
