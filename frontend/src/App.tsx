import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CommandCenter } from './pages/CommandCenter';
import { Investigations } from './pages/Investigations';
import { EvidenceGraph } from './pages/EvidenceGraph';
import { Integrations } from './pages/Integrations';
import { FixVerify } from './pages/FixVerify';
import { IncidentHistory } from './pages/IncidentHistory';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page as default root */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Shell routes under /app */}
        <Route
          path="/app/*"
          element={
            <div className="flex h-screen w-screen overflow-hidden bg-[#060913] text-[#e2e8f0]">
              <Sidebar activeCount={1} />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main id="main-content" className="flex-1 overflow-hidden relative" role="main" aria-label="Main Content">
                  <Routes>
                    <Route path="/" element={<CommandCenter />} />
                    <Route path="/investigations" element={<Investigations />} />
                    <Route path="/evidence-graph" element={<EvidenceGraph />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/fix-verify" element={<FixVerify />} />
                    <Route path="/history" element={<IncidentHistory />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
