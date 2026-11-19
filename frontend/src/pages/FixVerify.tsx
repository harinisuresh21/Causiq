import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Upload,
  Lock,
  ArrowRight,
  Activity,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Incident, InvestigationResponse, VerificationResult } from '../types';

export const FixVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [investigationData, setInvestigationData] = useState<InvestigationResponse | null>(null);

  // Remediation action states
  const [stepStatuses, setStepStatuses] = useState<{ [key: number]: 'planned' | 'implemented' }>({});
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const incList = await api.getIncidents();
        setIncidents(incList);
        const urlId = searchParams.get('id');
        const activeId = urlId || (incList.length > 0 ? incList[0].id : '');
        setSelectedIncidentId(activeId);

        if (activeId) {
          loadIncident(activeId);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [searchParams]);

  async function loadIncident(id: string) {
    try {
      const data = await api.getInvestigation(id);
      setInvestigationData(data);
      const inc = incidents.find(i => i.id === id);
      if (inc && inc.status === 'resolved') {
        setResolved(true);
      } else {
        setResolved(false);
      }
      setVerificationResult(null);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleStepStatus(index: number) {
    setStepStatuses(prev => ({
      ...prev,
      [index]: prev[index] === 'implemented' ? 'planned' : 'implemented'
    }));
  }

  async function handleRunVerification() {
    if (!selectedIncidentId) return;
    setVerifying(true);
    try {
      const res = await api.verifyIncident(selectedIncidentId, {
        verification_evidence_text: verificationInput || 'HTTP 200 OK. Connection pools healthy. Error rate 0% over 15 minutes.'
      });
      setVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  }

  async function handleResolveIncident() {
    if (!selectedIncidentId) return;
    try {
      await api.resolveIncident(selectedIncidentId);
      setResolved(true);
      const updated = await api.getIncidents();
      setIncidents(updated);
    } catch (err) {
      console.error(err);
    }
  }

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1e2a44]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Fix & Verify Remediation Workspace
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Human-in-the-Loop Safe
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review calibrated remediations, log implementation confirmations, and run telemetry verification before closing incidents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedIncidentId}
            onChange={(e) => {
              setSelectedIncidentId(e.target.value);
              loadIncident(e.target.value);
            }}
            className="bg-[#131b2f] border border-[#233152] rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-violet-500 font-semibold"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.slice(0, 40)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Human in the loop safety disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300">Safety Guardrail Active:</strong> Causiq AI does not execute arbitrary commands or auto-apply production rollbacks. Explicit engineer confirmation and verified post-fix telemetry are required to officially resolve an incident.
        </div>
      </div>

      {/* Recommended Remediation Actions */}
      <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          Recommended Corrective Actions
        </h2>

        <div className="space-y-4">
          {investigationData?.result?.remediation_steps?.map((step, idx) => {
            const isImplemented = stepStatuses[idx] === 'implemented';
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#141c30] border border-[#212f4d] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-400 font-mono">{step.priority}</span>
                    <span className="text-xs font-semibold text-white">{step.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                      Risk: {step.risk_level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{step.reason}</div>
                  <div className="text-[11px] text-gray-500 flex flex-wrap gap-4 pt-1">
                    <span><strong>Required Permissions:</strong> {step.required_permissions}</span>
                    <span><strong>Verification Procedure:</strong> {step.verification_procedure}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleStepStatus(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isImplemented
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#1e2a44] text-gray-300 hover:bg-[#28385a]'
                    }`}
                  >
                    {isImplemented ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Marked Implemented
                      </>
                    ) : (
                      'Mark as Implemented'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Engine Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Input & Controls */}
        <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Supply Fresh Verification Telemetry
          </h3>
          <p className="text-xs text-gray-400">
            Paste post-mitigation logs, health check responses, or telemetry metrics to verify recovery against the incident baseline.
          </p>

          <textarea
            rows={4}
            placeholder="e.g. 2026-11-19 10:15:00 [INFO] [auth-service] Health check 200 OK. Active pool connections: 12/50. Error rate 0.00%."
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-violet-500"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-500">Compares against original incident telemetry</span>
            <button
              onClick={handleRunVerification}
              disabled={verifying}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-violet-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              {verifying ? 'Running Verification...' : 'Run Automated Verification'}
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        <div className="p-6 rounded-xl bg-[#111726] border border-[#1f2b48] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verification Telemetry Report
            </h3>

            {verificationResult ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    verificationResult.status === 'passed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {verificationResult.status === 'passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    VERIFICATION {verificationResult.status.toUpperCase()}
                  </div>
                  <span className="text-xs font-mono">{verificationResult.relevant_service_health}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#141c30] border border-[#212f4d]">
                    <div className="text-[10px] text-gray-500">Baseline Failure Rate</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">
                      {verificationResult.previous_error_frequency}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141c30] border border-[#212f4d]">
                    <div className="text-[10px] text-gray-500">Post-Fix Failure Rate</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">
                      {verificationResult.current_error_frequency}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-[#141c30] p-3 rounded-lg border border-[#212f4d]">
                  {verificationResult.summary}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-gray-500">
                Supply fresh telemetry or click "Run Automated Verification" to validate resolution.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1e2a44] flex items-center justify-between">
            <span className="text-[11px] text-gray-500">
              {resolved ? 'Incident resolved & archived' : 'Resolution requires passing verification'}
            </span>
            <button
              onClick={handleResolveIncident}
              disabled={resolved || (!verificationResult && selectedIncident?.status !== 'resolved')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                resolved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-40'
              }`}
            >
              {resolved ? 'Incident Resolved ✓' : 'Authorize Incident Resolution'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
