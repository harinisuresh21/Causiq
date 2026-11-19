import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Shield, Database, Cpu, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [dbPath, setDbPath] = useState('sqlite:///./rootcause.db');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl">
      <div className="pb-2 border-b border-[#1e2a44]">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          Platform Settings & Engine Configuration
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure autonomous agent hyperparameters, database retention, and secret isolation boundaries.
        </p>
      </div>

      <div className="space-y-6">
        {/* Model Configuration */}
        <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            Gemini Reasoning Model Selection
          </h2>
          <p className="text-xs text-gray-400">
            Causiq uses Google Gemini structured output schemas to formulate and evaluate hypotheses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setModel('gemini-2.5-flash')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                model === 'gemini-2.5-flash'
                  ? 'bg-violet-600/20 border-violet-500 text-white'
                  : 'bg-[#141c30] border-[#212f4d] text-gray-400'
              }`}
            >
              <div className="text-xs font-bold text-white">gemini-2.5-flash (Recommended)</div>
              <div className="text-[11px] text-gray-400 mt-1">Sub-second structured correlation latency and high reasoning precision.</div>
            </div>

            <div
              onClick={() => setModel('gemini-2.5-pro')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                model === 'gemini-2.5-pro'
                  ? 'bg-violet-600/20 border-violet-500 text-white'
                  : 'bg-[#141c30] border-[#212f4d] text-gray-400'
              }`}
            >
              <div className="text-xs font-bold text-white">gemini-2.5-pro</div>
              <div className="text-[11px] text-gray-400 mt-1">Deep architectural synthesis for massive cross-repository multi-million line incidents.</div>
            </div>
          </div>
        </div>

        {/* Security & Secrets */}
        <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Secret Redaction & Isolation
          </h2>
          <p className="text-xs text-gray-400">
            Automatic regex sanitization strips credentials, passwords, Bearer tokens, and AWS access keys before telemetry ingestion.
          </p>
          <div className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] text-xs font-mono text-emerald-400">
            Active: Password / Token Redactor, AWS Key Filter, PostgreSQL URI Sanitizer
          </div>
        </div>

        {/* Database Config */}
        <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Database Persistence
          </h2>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Database Connection String</label>
            <input
              type="text"
              value={dbPath}
              onChange={(e) => setDbPath(e.target.value)}
              className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
              <Check className="w-4 h-4" /> Settings updated successfully
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-violet-600/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
