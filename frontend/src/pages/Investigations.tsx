import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Play,
  FileText,
  AlertOctagon,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Upload,
  Cpu,
  Layers,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Incident, InvestigationResponse, DemoScenario } from '../types';

export const Investigations: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [investigationData, setInvestigationData] = useState<InvestigationResponse | null>(null);
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);

  // Workflow states
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New incident form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeverity, setNewSeverity] = useState('critical');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Authentication Service', 'Database']);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [uploadedLogText, setUploadedLogText] = useState<string>('');

  useEffect(() => {
    async function init() {
      try {
        const [incList, scList] = await Promise.all([
          api.getIncidents(),
          api.getScenarios()
        ]);
        setIncidents(incList);
        setScenarios(scList);

        const urlId = searchParams.get('id');
        const action = searchParams.get('action');

        if (action === 'new') {
          setShowCreateModal(true);
        }

        if (urlId) {
          setSelectedIncidentId(urlId);
          loadInvestigation(urlId);
        } else if (incList.length > 0) {
          setSelectedIncidentId(incList[0].id);
          loadInvestigation(incList[0].id);
        }
      } catch (err) {
        console.error('Failed to initialize investigations:', err);
      }
    }
    init();
  }, [searchParams]);

  async function loadInvestigation(id: string) {
    try {
      const data = await api.getInvestigation(id);
      setInvestigationData(data);
    } catch (err) {
      console.error('Error fetching investigation:', err);
    }
  }

  async function handleRunInvestigation() {
    if (!selectedIncidentId) return;
    setIsInvestigating(true);
    setCurrentStageIndex(0);

    // Simulate multi-stage progression UX tied to actual execution
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < 8) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);

    try {
      const res = await api.investigateIncident(selectedIncidentId);
      clearInterval(interval);
      setCurrentStageIndex(8);
      setInvestigationData(res);
      // Refresh incidents
      const updatedList = await api.getIncidents();
      setIncidents(updatedList);
    } catch (err) {
      console.error('Investigation failed:', err);
    } finally {
      setIsInvestigating(false);
    }
  }

  async function handleCreateIncident() {
    try {
      let customEvents = undefined;
      if (uploadedLogText.trim()) {
        customEvents = [
          {
            event_id: 'EV-MAN-01',
            source: 'application_logs',
            service: selectedServices[0] || 'app-service',
            timestamp: new Date().toISOString(),
            severity: 'error',
            event_type: 'app_error',
            description: uploadedLogText.trim()
          }
        ];
      }

      const res = await api.createIncident({
        title: newTitle || (selectedScenario ? scenarios.find(s => s.id === selectedScenario)?.title : 'Custom Incident'),
        description: newDesc,
        severity: newSeverity,
        affected_services: selectedServices,
        scenario_id: selectedScenario || undefined,
        custom_events: customEvents
      });

      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setUploadedLogText('');
      setSelectedScenario('');

      // Refresh and select
      const incList = await api.getIncidents();
      setIncidents(incList);
      setSelectedIncidentId(res.id);
      await loadInvestigation(res.id);
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  }

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Workspace Header */}
      <div className="p-6 border-b border-[#1e2a44] bg-[#0d1322] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <select
            value={selectedIncidentId}
            onChange={(e) => {
              setSelectedIncidentId(e.target.value);
              loadInvestigation(e.target.value);
            }}
            className="bg-[#131b2f] border border-[#233152] rounded-lg px-3 py-2 text-xs font-semibold text-gray-200 focus:outline-none focus:border-violet-500 max-w-sm"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} - {inc.title.slice(0, 45)}...
              </option>
            ))}
          </select>

          {selectedIncident && (
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedIncident.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {selectedIncident.severity.toUpperCase()}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-medium">
                {selectedIncident.status.toUpperCase()}
              </span>
              {selectedIncident.is_demo && (
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                  DEMO SCENARIO
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#141c30] border border-[#233152] hover:bg-[#1a2540] text-xs font-semibold text-gray-200 transition-colors"
          >
            + New Incident
          </button>
          <button
            onClick={handleRunInvestigation}
            disabled={isInvestigating}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isInvestigating ? 'Correlating Telemetry...' : 'Run Autonomous Investigation'}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Col: Investigation Stages & Progression */}
        <div className="w-80 border-r border-[#1e2a44] bg-[#0c1220] p-5 overflow-y-auto shrink-0 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              Investigation Pipeline
            </h3>
            <div className="space-y-2">
              {investigationData?.stages?.map((st, idx) => {
                const isPassed = !isInvestigating || idx <= currentStageIndex;
                const isCurrent = isInvestigating && idx === currentStageIndex;
                return (
                  <div
                    key={st.stage}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-violet-600/15 border-violet-500/50 shadow-sm'
                        : isPassed
                        ? 'bg-[#111726] border-[#1e2a44]'
                        : 'bg-[#090d16]/50 border-transparent opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-gray-300 font-mono">STAGE {st.stage}</span>
                      {isPassed && !isCurrent ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Clock className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5">{st.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{st.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#111726] border border-[#1f2b48] mt-4">
            <div className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Evidence-First Rigor
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Hypotheses require supporting telemetry IDs. Gemini validates correlations against raw event traces.
            </div>
          </div>
        </div>

        {/* Right Col: AI Finding & Hypothesis Workspace */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#090d16]">
          {investigationData?.result ? (
            <>
              {/* Primary Root Cause Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#12192d] via-[#101728] to-[#151c32] border border-violet-500/30 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-400">
                      IDENTIFIED LIKELY ROOT CAUSE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Calibrated Confidence:</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
                      {Math.round(investigationData.result.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-2 leading-snug">
                  {investigationData.result.likely_root_cause}
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {investigationData.result.incident_summary}
                </p>

                {/* Supporting Evidence Chips */}
                <div className="mt-4 pt-4 border-t border-[#1e2a44] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-medium">Supporting Evidence:</span>
                  {investigationData.result.supporting_evidence.map((evId) => (
                    <span
                      key={evId}
                      onClick={() => navigate(`/evidence-graph?highlight=${evId}`)}
                      className="px-2.5 py-0.5 rounded-md bg-[#18233c] hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-mono font-semibold cursor-pointer transition-colors"
                    >
                      {evId}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid: Alternative Hypotheses & Remediation Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alternative Hypotheses */}
                <div className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Alternative Hypothesis Evaluation
                  </h3>

                  <div className="space-y-3">
                    {investigationData.result.alternative_hypotheses.map((hyp, i) => (
                      <div key={i} className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{hyp.title}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              hyp.likelihood === 'high'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {hyp.likelihood.toUpperCase()} LIKELIHOOD
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">{hyp.explanation}</p>
                        <div className="text-[10px] text-gray-500 flex flex-wrap gap-2 pt-1 border-t border-[#1d2944]">
                          <span>Supporting: {hyp.supporting_evidence_ids.join(', ') || 'None'}</span>
                          {hyp.missing_evidence.length > 0 && (
                            <span className="text-amber-400/90">
                              Missing: {hyp.missing_evidence.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation Playbook */}
                <div className="p-5 rounded-xl bg-[#111726] border border-[#1f2b48] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" />
                      Remediation Playbook (Human-in-the-Loop)
                    </h3>
                    <button
                      onClick={() => navigate(`/fix-verify?id=${selectedIncidentId}`)}
                      className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                    >
                      Remediate <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {investigationData.result.remediation_steps.map((rem, i) => (
                      <div key={i} className="p-3.5 rounded-lg bg-[#141c30] border border-[#212f4d] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-400">{rem.priority}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                            Risk: {rem.risk_level}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-white">{rem.action}</div>
                        <div className="text-[11px] text-gray-400">{rem.reason}</div>
                        <div className="text-[10px] text-gray-500 pt-1 border-t border-[#1d2944]">
                          Requires: {rem.required_permissions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Verification Checklist & Missing Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48]">
                  <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Verification Checklist
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-400">
                    {investigationData.result.verification_checklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#111726] border border-[#1f2b48]">
                  <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    Missing Evidence / Observability Gaps
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-400">
                    {investigationData.result.missing_information.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-3">
              <Sparkles className="w-8 h-8 text-violet-400 animate-bounce" />
              <div className="text-sm font-semibold text-white">No active investigation findings yet</div>
              <p className="text-xs max-w-sm text-gray-500">
                Click "Run Autonomous Investigation" to correlate timeline telemetry, logs, and commits.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Incident Creation Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-[#212f4d] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div>
              <h2 className="text-lg font-bold text-white">Start a New Investigation</h2>
              <p className="text-xs text-gray-400 mt-1">
                Bring your engineering evidence together. Let RootCause AI investigate.
              </p>
            </div>

            {/* Choose Mode: Demo Scenario or Custom */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-300">
                A. Select a Realistic Demo Scenario (Instant Demonstration)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {scenarios.map((sc) => (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenario(sc.id);
                      setNewTitle(sc.title);
                      setNewDesc(sc.description);
                      setNewSeverity(sc.severity);
                      setSelectedServices(sc.affected_services);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedScenario === sc.id
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-[#141c30] border-[#212f4d] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-200">{sc.title.slice(0, 30)}...</div>
                    <div className="text-[10px] text-gray-500 mt-1">{sc.service}</div>
                    <span className="inline-block mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      DEMO DATA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident Details Form */}
            <div className="space-y-4 pt-4 border-t border-[#1e2a44]">
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cascading HTTP 500 Outage on Auth API"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">Symptoms Description</label>
                <textarea
                  placeholder="Describe failure signs, alert notifications, and user symptoms..."
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">
                  B. Paste Application Logs / Evidence Text (Optional)
                </label>
                <textarea
                  placeholder="Paste log lines e.g. '2026-11-19 10:04:12 [ERROR] [auth-service] Connection timed out'..."
                  rows={3}
                  value={uploadedLogText}
                  onChange={(e) => setUploadedLogText(e.target.value)}
                  className="w-full font-mono bg-[#141c30] border border-[#212f4d] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e2a44]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-xs font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIncident}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/20"
              >
                Create & Ingest Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
