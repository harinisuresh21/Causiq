import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Investigations } from '../Investigations';
import { api } from '../../services/api';

vi.mock('../../services/api');

const mockIncidents = [
  {
    id: 'INC-401',
    title: 'Database Pool Exhaustion Outage',
    severity: 'critical',
    status: 'identified',
    affected_services: ['Database', 'Auth'],
    created_at: new Date().toISOString(),
    is_demo: true
  }
];

const mockScenarios = [
  {
    id: 'db_pool_exhaustion',
    title: 'Scenario 1: DB Pool Exhaustion',
    severity: 'critical',
    category: 'Database / Resource Contention',
    description: 'Reduced pool max size leads to cascading queue timeouts.',
    suggested_services: ['Auth Service', 'PostgreSQL Primary']
  }
];

const mockInvestigation = {
  incident_id: 'INC-401',
  stages: [
    { stage: 1, name: 'Ingestion', description: 'Log ingestion and secret scrubbing' },
    { stage: 2, name: 'Correlation', description: 'Cross-service graph assembly' }
  ],
  result: {
    root_cause: 'PostgreSQL connection pool max size reduced from 50 to 5 in commit a7b8c9d.',
    confidence: 0.94,
    affected_services: ['Database', 'Auth'],
    supporting_evidence: ['EV-101', 'EV-102'],
    contradicting_evidence: [],
    alternative_hypotheses: [
      {
        title: 'DDoS Attack on Auth Port',
        likelihood: 'low',
        explanation: 'Network ingress rates were within normal distribution.',
        supporting_evidence_ids: [],
        missing_evidence: ['Volumetric packet capture']
      }
    ],
    business_impact: '99.8% of user logins failing across region us-east-1.',
    remediation_steps: [
      {
        action: 'Revert pool configuration in database.yaml to max_size: 50',
        reason: 'Restores connection ceiling',
        priority: 'P0 - Immediate',
        risk_level: 'Low',
        required_permissions: 'DBA',
        verification_procedure: 'Curl /health'
      }
    ],
    verification_checklist: ['Check pool saturation', 'Verify latency < 200ms'],
    missing_information: []
  }
};

describe('Investigations Page Component', () => {
  beforeEach(() => {
    vi.mocked(api.getIncidents).mockResolvedValue(mockIncidents);
    vi.mocked(api.getScenarios).mockResolvedValue(mockScenarios);
    vi.mocked(api.getInvestigation).mockResolvedValue(mockInvestigation);
  });

  it('renders investigation workspace and selected incident details', async () => {
    render(
      <BrowserRouter>
        <Investigations />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Investigation Pipeline/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Run Autonomous Investigation/i })).toBeInTheDocument();
      expect(screen.getByText(/\+ New Incident/i)).toBeInTheDocument();
    });
  });

  it('opens and closes new incident modal on button click', async () => {
    render(
      <BrowserRouter>
        <Investigations />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ New Incident/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /\+ New Incident/i }));

    expect(screen.getByText(/Start a New Causiq Investigation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cascading HTTP 500 Outage on Auth API/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText(/Start a New Causiq Investigation/i)).not.toBeInTheDocument();
  });
});
