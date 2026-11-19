import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  GitCommit,
  Server,
  Zap,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { api } from '../services/api';
import { DashboardStats, Incident } from '../types';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashData, incData] = await Promise.all([
          api.getDashboardStats(),
          api.getIncidents()
        ]);
        setStats(dashData);
        setIncidents(incData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading telemetry and incident state...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1e2a44]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Command Center
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Monitoring
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time incident blast radius, cross-service telemetry, and autonomous investigation workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/investigations?action=new')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Start Investigation
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] relative overflow-hidden">
          <div className="text-xs font-medium text-gray-400">Total Incidents</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.metrics.total_incidents}</div>
          <div className="text-[11px] text-gray-500 mt-1">Audited in current cycle</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-rose-400">
            <span>Critical Incidents</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300 mt-1">{stats.metrics.critical_incidents}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Requires immediate mitigation</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-amber-400">
            <span>Active Investigations</span>
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-1">{stats.metrics.active_incidents}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Under AI correlation</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-400">
            <span>Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.metrics.resolved_incidents}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Verified fixes verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-medium text-violet-400">
            <span>Avg Investigation Time</span>
            <Clock className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-violet-300 mt-1">{stats.metrics.avg_investigation_time}</div>
          <div className="text-[11px] text-violet-400/80 mt-1">94% faster than manual RCA</div>
        </div>
      </div>

      {/* Grid: Service Health & Incident Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Health Overview */}
        <div className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Service Health Overview
              </h2>
              <span className="text-[11px] text-gray-500">Live telemetry</span>
            </div>
            <div className="space-y-3">
              {stats.services.map((svc) => (
                <div
                  key={svc.name}
                  className="p-3 rounded-lg bg-[#141c30] border border-[#212f4d] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-gray-200">{svc.name}</div>
                    <div className="text-[10px] text-gray-500">Updated {svc.last_updated}</div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-mono text-gray-300">{svc.response_time}</div>
                      <div className="text-[10px] text-gray-500">P95 Latency</div>
                    </div>
                    <div>
                      <div className={`text-xs font-mono font-semibold ${svc.status === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {svc.error_rate}
                      </div>
                      <div className="text-[10px] text-gray-500">Error rate</div>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        svc.status === 'healthy' ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Frequency Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#111726] border border-[#1f2b48]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                Incident Frequency & Severity Trends
              </h2>
              <p className="text-[11px] text-gray-400">Chronological distribution of anomalies and resolutions</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Critical
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> High
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.incident_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="critical" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCritical)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Row: Active Incident Feed & Recent Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incident Feed */}
        <div className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              Active Incident Feed
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate(`/investigations?id=${inc.id}`)}
                className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] hover:border-violet-500/50 cursor-pointer transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-violet-400 font-semibold">{inc.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inc.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {inc.severity.toUpperCase()}
                    </span>
                    {inc.is_demo && (
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        DEMO DATA
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-200 group-hover:text-white">{inc.title}</div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Affected: {inc.affected_services.join(', ')}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      inc.status === 'resolved'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-300'
                    }`}
                  >
                    {inc.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-gray-500 mt-2">
                    {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Activity Feed */}
        <div className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              Deployment Activity Feed
            </h2>
            <span className="text-[11px] text-gray-500">Correlated CI/CD</span>
          </div>

          <div className="space-y-3">
            {stats.recent_deployments.map((dep) => (
              <div
                key={dep.id}
                className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{dep.id}</span>
                    <span className="text-xs font-medium text-gray-200">{dep.service}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono">
                      {dep.commit}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Deployed by {dep.author} • {dep.environment}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                    {dep.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-gray-500 mt-1">{dep.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
