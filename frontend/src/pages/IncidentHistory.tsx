import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Download,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const IncidentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getIncidents();
        setIncidents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.affected_services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  async function handleExportReport(id: string) {
    try {
      const rep = await api.getReport(id);
      const blob = new Blob([JSON.stringify(rep, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `causiq-report-${id}.json`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1e2a44]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Incident Audit History
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
              {incidents.length} Records Persisted
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Complete historical audit trail of investigations, correlated evidence graphs, and verified fixes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by title, ID, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Statuses</option>
            <option value="investigating">Investigating</option>
            <option value="identified">Identified</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl bg-[#111726] border border-[#1f2b48] overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e1424] text-gray-400 font-semibold border-b border-[#1f2b48] uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Incident ID</th>
              <th className="p-4">Title & Symptoms</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Affected Services</th>
              <th className="p-4">Created Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18233a]">
            {filtered.map((inc) => (
              <tr key={inc.id} className="hover:bg-[#141c30] transition-colors">
                <td className="p-4 font-mono font-bold text-violet-400">
                  {inc.id}
                  {inc.is_demo && (
                    <span className="block text-[9px] text-cyan-400 font-normal">DEMO SCENARIO</span>
                  )}
                </td>
                <td className="p-4 max-w-sm">
                  <div className="font-semibold text-white">{inc.title}</div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">{inc.description}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      inc.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {inc.severity.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      inc.status === 'resolved'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-300'
                    }`}
                  >
                    {inc.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-[11px]">
                  {inc.affected_services.join(', ')}
                </td>
                <td className="p-4 text-gray-400 text-[11px]">
                  {new Date(inc.created_at).toLocaleString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/app/investigations?id=${inc.id}`)}
                    className="p-1.5 rounded bg-[#18233c] hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors"
                    title="View Investigation"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleExportReport(inc.id)}
                    className="p-1.5 rounded bg-[#18233c] hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                    title="Export Audit Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
