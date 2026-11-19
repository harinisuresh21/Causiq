import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Network,
  GitCommit,
  Server,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Radar,
  Bug,
  Terminal,
  Clock,
  Database,
  Search,
  Check,
  Flame,
  Radio,
  Share2,
  FileCode,
  ShieldAlert,
  BarChart3,
  Globe2,
  Eye,
  GitPullRequest
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [liveLogIndex, setLiveLogIndex] = useState<number>(0);

  // Live Simulated Telemetry Stream in Terminal Mockup
  const telemetryLogs = [
    { source: 'AWS RDS', msg: 'CloudWatch: HighConnectionLatency > 5210ms on db-auth-primary', sev: 'warning', color: 'text-amber-400' },
    { source: 'GITHUB', msg: 'Commit a7b8c9d merged: pool.max_size reduced (50 -> 5)', sev: 'info', color: 'text-cyan-400' },
    { source: 'K8S', msg: 'Liveness probe failed for pod auth-service-prod-1 (HTTP 503)', sev: 'critical', color: 'text-rose-400' },
    { source: 'CAUSIQ', msg: 'Causality Identified: EV-102 config starve triggered cascade. Confidence 91%', sev: 'success', color: 'text-emerald-400' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveLogIndex((prev) => (prev + 1) % telemetryLogs.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#060913] text-gray-100 flex flex-col relative overflow-hidden bg-grid-pattern selection:bg-violet-500/30 selection:text-violet-200">
      {/* Dynamic Ambient Blur Glows */}
      <div className="absolute top-[-160px] left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-violet-600/25 via-indigo-600/20 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-[45%] right-[-140px] w-[600px] h-[500px] bg-gradient-to-bl from-cyan-500/15 to-violet-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[400px] bg-gradient-to-tr from-rose-600/10 to-violet-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Top Navbar */}
      <nav className="h-20 border-b border-[#1a253e]/80 glass-panel sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between" aria-label="Landing Page Navigation">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20 animate-float" aria-hidden="true">
            <Radar className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '16s' }} />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-sans">
              CAUSIQ <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30 font-bold">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest font-mono block">AUTONOMOUS SRE SYSTEM</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <a href="#problem" className="hover:text-violet-400 transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none rounded">The Problem</a>
          <a href="#interactive-flow" className="hover:text-cyan-400 transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none rounded">How It Investigates</a>
          <a href="#live-sandbox" className="hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none rounded">Incident Telemetry</a>
          <a href="#guardrails" className="hover:text-rose-400 transition-colors focus:ring-2 focus:ring-violet-500 focus:outline-none rounded">Human-In-The-Loop</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            aria-label="Launch Causiq Studio Application"
            className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold tracking-wide shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.03] transition-all cursor-pointer ring-1 ring-white/25 focus:ring-2 focus:ring-violet-500 focus:outline-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} aria-hidden="true" />
            <span>Try Causiq</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <main id="main-content">

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 sm:px-12 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Release Pill with Live Pulsing Dot */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-semibold text-violet-300 mb-8 backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Causiq 2.0 Autonomous Engine Online</span>
          <span className="text-gray-500 font-mono">•</span>
          <span className="text-cyan-300 font-mono">Zero Chatbot Hallucinations</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-5xl">
          When Production Breaks, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Causiq Isolates The Failure Truth
          </span>.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
          Not another generic AI chat wrapper. <strong className="text-white">Causiq</strong> ingest authorized telemetry across commits, CI/CD deploys, CloudWatch metrics, and container events to build an evidence-grounded causality graph that proves why your services failed.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-2xl shadow-violet-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer ring-1 ring-white/20"
          >
            <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
            <span>Launch Causiq Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/app/investigations?action=new')}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#0f172a]/90 hover:bg-[#1a2540] border border-[#26375c] text-gray-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Run Scenario Simulation (Pool Exhaustion)</span>
          </button>
        </div>

        {/* Live Terminal & Interactive Telemetry Card */}
        <div className="mt-16 w-full max-w-4xl p-2 rounded-2xl bg-gradient-to-b from-violet-500/20 via-indigo-500/10 to-transparent border border-[#233152] shadow-2xl">
          <div className="rounded-xl bg-[#0a0f1d] border border-[#1a253e] p-5 text-left font-mono text-xs">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c273e]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-gray-400 text-[11px]">causiq-telemetry-engine --session=active-rca</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>STREAMING EVENT CORRELATIONS</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="space-y-2 py-1">
              <div className="text-gray-500 text-[11px]">&gt; Initializing cross-source correlation pipeline across 5 telemetry adapters...</div>
              {telemetryLogs.map((log, idx) => {
                const isActive = idx === liveLogIndex;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'bg-violet-950/30 border-violet-500/50 shadow-sm shadow-violet-500/10'
                        : 'bg-[#0d1428]/60 border-[#19243d] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 ${log.color} border border-current/20`}>
                        {log.source}
                      </span>
                      <span className="text-gray-200">{log.msg}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                      {isActive ? 'JUST NOW' : `${idx * 4}m ago`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The SRE Dilemma vs Causiq Solution */}
      <section id="problem" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-violet-400">THE INCIDENT GAP</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Why SRE War Rooms Waste Hours</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
            Traditional monitoring only sounds the alarm. Developers are left manually hunting across disconnected systems during high-stress outages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Old Way */}
          <div className="p-7 rounded-2xl bg-[#0e1220]/70 border border-rose-500/20 space-y-5 text-left relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Manual Chaos in the War Room</h3>
                <span className="text-[11px] text-gray-500">How incidents are resolved today</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Developers copy-pasting cryptic stack traces into public AI chatbots without security redaction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Context switching between GitHub commits, AWS RDS dashboards, Jenkins pipelines, and Datadog.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Guessing root causes based on log noise without verifying temporal commit-to-deployment sequences.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Unverified hotfixes pushed to production that accidentally re-trigger downstream outages.</span>
              </li>
            </ul>
          </div>

          {/* The Causiq Way */}
          <div className="p-7 rounded-2xl bg-[#0f182f]/80 border border-emerald-500/30 space-y-5 text-left relative overflow-hidden shadow-xl shadow-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Autonomous Telemetry Correlation</h3>
                <span className="text-[11px] text-emerald-400 font-mono">The Causiq Standard</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automatic secret scrubbing strips passwords, JWT tokens, and AWS access keys in memory.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Unifies commits, Docker container status, RDS latencies, and alerts onto a single chronological axis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pydantic-enforced Gemini structured reasoning cites real telemetry IDs (EV-101, EV-102).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated regex verification evaluates post-fix metrics before authorizing incident resolution.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Architecture Walkthrough */}
      <section id="interactive-flow" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">HOW CAUSIQ WORKS</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">From Alert Fire to Verified Resolution</p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { step: 1, title: '1. Ingestion & Redaction', icon: Lock },
            { step: 2, title: '2. Graph Correlation', icon: Network },
            { step: 3, title: '3. Evidence Reasoning', icon: Cpu },
            { step: 4, title: '4. Fix Verification', icon: CheckCircle2 }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                activeStep === s.step
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-[#0d1428] border-[#1e2a44] text-gray-400 hover:border-gray-600'
              }`}
            >
              <s.icon className={`w-4 h-4 ${activeStep === s.step ? 'text-violet-400' : 'text-gray-500'}`} />
              <span className="text-xs font-bold">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step Detail Card */}
        <div className="glass-panel-glow rounded-2xl p-8 border border-[#26375c] text-left">
          {activeStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  STEP 01 — ZERO-TRUST TELEMETRY INGESTION
                </span>
                <h3 className="text-2xl font-bold text-white">Automatic In-Memory Secret Sanitization</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Causiq accepts application logs, Docker lifecycle signals, CloudWatch alarms, and GitHub commits. Before telemetry is persisted or processed by reasoning engines, our regex scrubber strips secrets, database credentials, API keys, and Bearer tokens.
                </p>
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" /> Sandboxed read-only permissions by default
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#090e1a] border border-[#1e2a44] font-mono text-xs space-y-2">
                <div className="text-gray-500 text-[10px]">REDACTION PIPELINE AUDIT</div>
                <div className="text-rose-400/90 line-through">postgres://admin:SuperSecret2026!@rds.cluster:5432</div>
                <div className="text-emerald-400">postgres://admin:[REDACTED_SECRET]@rds.cluster:5432</div>
                <div className="text-rose-400/90 line-through">Authorization: Bearer ghp_9182aBcDeFgHiJkLmNo</div>
                <div className="text-emerald-400">Authorization: Bearer [REDACTED_GITHUB_PAT]</div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  STEP 02 — TEMPORAL GRAPH ENGINE
                </span>
                <h3 className="text-2xl font-bold text-white">Full React Flow Interactive Visual Graph</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Events are arranged on an interactive 2D canvas showing how release DEP-412 preceded RDS connection queue saturation, which cascaded to auth timeouts, order service failures, and container liveness probe restarts.
                </p>
                <div className="text-xs text-cyan-300 font-mono flex items-center gap-2">
                  <Network className="w-4 h-4" /> Drag, zoom, pan, and inspect event metadata live
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1e2a44] space-y-2 font-mono text-xs">
                <div className="text-[10px] text-gray-400">TOPOLOGICAL FAILURE CHAIN</div>
                <div className="p-2 rounded bg-violet-950/40 border border-violet-500/40 text-violet-300">
                  Commit a7b8c9d (pool max_size 5)
                </div>
                <div className="text-center text-gray-500 text-[10px]">↓ Triggered by deploy</div>
                <div className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300">
                  RDS Acquisition Latency &gt; 5000ms
                </div>
                <div className="text-center text-gray-500 text-[10px]">↓ Starved downstream workers</div>
                <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300">
                  Auth API HTTP 500 &amp; Container Restart
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  STEP 03 — PYDANTIC GEMINI SYNTHESIS
                </span>
                <h3 className="text-2xl font-bold text-white">Evidence-Grounded Root Cause &amp; Confidence</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Gemini evaluates alternative hypotheses against explicit evidence IDs. Causiq provides calibrated confidence scores, flags missing information (like missing heap dumps), and synthesizes step-by-step remediation procedures.
                </p>
                <div className="text-xs text-indigo-300 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Zero hallucinations: Every hypothesis requires telemetry citations
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#090e1a] border border-[#1e2a44] text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Identified Root Cause</span>
                  <span className="text-violet-300 font-mono bg-violet-500/20 px-2 py-0.5 rounded">Confidence: 91%</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  "Database pool reduction (commit a7b8c9d) created connection starvation under nominal load, leading to QueuePool timeout errors."
                </p>
                <div className="text-[10px] text-gray-400 pt-2 border-t border-[#1c273e]">
                  Supporting: INC-DB-401-EV-102, INC-DB-401-EV-103
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  STEP 04 — CLOSED-LOOP VERIFICATION
                </span>
                <h3 className="text-2xl font-bold text-white">Telemetry Proof Before Incident Closure</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Remediation actions are executed safely by authorized engineers. Fresh verification telemetry (logs, health checks) is evaluated by Causiq's regex engine to prove error rates reached 0.00% before allowing resolution.
                </p>
                <div className="text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Human-in-the-loop: Zero unsafe autonomous production mutations
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#090e1a] border border-emerald-500/30 text-xs space-y-3">
                <div className="text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> VERIFICATION PASSED (P95: 35ms)
                </div>
                <div className="text-[11px] text-gray-300">
                  Error rate dropped from 64 errors/min to 0.00%. All service health checks stabilized.
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Audit report exported to causiq-report-INC-401.json
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final Launch Banner */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/20 border border-violet-500/40 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-600/30">
            <Radar className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Experience Causiq in Action</h2>
          <p className="text-sm sm:text-base text-gray-300 mt-3 max-w-xl mx-auto">
            Explore live incident command metrics, inspect interactive React Flow evidence graphs, and test automated fix verification workflows.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-violet-600/40 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer ring-1 ring-white/25"
            >
              <span>Try Causiq Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1a253e] bg-[#070b16] py-10 px-6 sm:px-12" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Radar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-white">CAUSIQ AI</span>
            <span className="text-xs text-gray-500 font-mono">Autonomous SRE Platform</span>
          </div>

          <div className="text-xs text-gray-400">
            © 2026 Causiq AI Systems Inc. Built for Autonomous SRE Engineering.
          </div>

          <div>
            <button
              onClick={() => navigate('/app')}
              className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Try Causiq Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
