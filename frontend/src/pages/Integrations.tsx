import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Cloud,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { Integration } from '../types';

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  // GitHub token state
  const [ghToken, setGhToken] = useState('');
  const [ghConnected, setGhConnected] = useState(false);
  const [showGhModal, setShowGhModal] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [integData, repoData] = await Promise.all([
          api.getIntegrations(),
          api.getGitHubRepos()
        ]);
        setIntegrations(integData);
        setRepos(repoData);
      } catch (err) {
        console.error('Failed to load integrations:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleConnectGitHub() {
    try {
      await api.connectGitHub(ghToken || 'ghp_demo_pat_token');
      setGhConnected(true);
      setShowGhModal(false);
      const updatedRepos = await api.getGitHubRepos();
      setRepos(updatedRepos);
    } catch (err) {
      console.error(err);
    }
  }

  function getIcon(id: string) {
    switch (id) {
      case 'github': return GitBranch;
      case 'cloudwatch': return Cloud;
      case 'docker': return Layers;
      case 'jenkins': return Terminal;
      default: return Activity;
    }
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1e2a44]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Integration Hub
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
              5 Adapters Available
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Connect source code repositories, cloud observability, CI/CD pipelines, and runtime container metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Read-only sandboxed permissions strictly enforced</span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = getIcon(item.id);
          const isLive = !item.is_simulated;

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48] flex flex-col justify-between space-y-4 hover:border-violet-500/40 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#18233c] border border-[#26375c] flex items-center justify-center text-violet-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <span className="text-[10px] text-gray-500 font-mono">ID: {item.id}</span>
                    </div>
                  </div>

                  {item.is_simulated ? (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      SIMULATED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      LIVE ADAPTER
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#1d2944] space-y-1.5 text-[11px] text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Permissions:</span>
                    <span className="font-mono text-gray-300">{item.permissions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Telemetry Sync:</span>
                    <span className="text-gray-300">{item.last_sync || 'Continuous'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {item.id === 'github' ? (
                  <button
                    onClick={() => setShowGhModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    {ghConnected ? 'Reconfigure GitHub Token' : 'Connect GitHub Token'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-lg bg-[#141c30] text-gray-400 text-xs font-semibold border border-[#212f4d] flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Adapter Active (Demo Sandbox)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected GitHub Repositories Section */}
      <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-violet-400" />
              Ingested Repository Traces & Commits
            </h3>
            <p className="text-xs text-gray-400">Repositories monitored for deployment-correlated code diffs</p>
          </div>
          <span className="text-xs font-mono text-gray-400">{repos.length} Repositories Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {repos.map((r, i) => (
            <div key={i} className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] space-y-1">
              <div className="text-xs font-semibold text-white truncate">{r.full_name || r.name}</div>
              <div className="text-[10px] text-gray-500 flex items-center justify-between">
                <span>Branch: {r.default_branch}</span>
                <span>{r.is_simulated ? 'SIMULATED' : 'LIVE'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Connect Modal */}
      {showGhModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-[#212f4d] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-violet-400" />
              Connect GitHub Personal Access Token
            </h3>
            <p className="text-xs text-gray-400">
              Provide a read-only GitHub token with <code className="text-violet-300">repo:read</code> scope to correlate live commit diffs.
            </p>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Personal Access Token</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#0d1322] border border-[#1e2a44] text-[11px] text-gray-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Tokens are stored server-side only in memory or encrypted environment sessions. Never exposed to browser clients.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGhModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-xs font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectGitHub}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-md shadow-violet-600/20"
              >
                Save & Authenticate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
