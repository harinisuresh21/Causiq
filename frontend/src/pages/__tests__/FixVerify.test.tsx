import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FixVerify } from '../FixVerify';
import { api } from '../../services/api';

vi.mock('../../services/api');

const mockIncidents = [
  {
    id: 'INC-401',
    title: 'Database Outage',
    severity: 'critical',
    status: 'identified',
    affected_services: ['Database'],
    created_at: new Date().toISOString(),
    is_demo: false
  }
];

const mockInvestigation = {
  investigation_id: 'INV-101',
  incident_id: 'INC-401',
  stages: [],
  result: {
    incident_summary: 'Connection timeout',
    severity: 'critical',
    likely_root_cause: 'Pool size too low',
    confidence: 0.95,
    affected_services: ['Database'],
    supporting_evidence: ['EV-1'],
    contradicting_evidence: [],
    alternative_hypotheses: [],
    business_impact: 'High',
    remediation_steps: [
      {
        action: 'Increase max_size to 50 in database.yaml',
        reason: 'Restores connection availability',
        priority: 'P0 - Immediate',
        risk_level: 'Low',
        required_permissions: 'DB Admin',
        verification_procedure: 'Query /health',
        status: 'planned'
      }
    ],
    verification_checklist: ['Check pool saturation'],
    missing_information: []
  }
};

describe('Fix & Verify Page', () => {
  beforeEach(() => {
    vi.mocked(api.getIncidents).mockResolvedValue(mockIncidents);
    vi.mocked(api.getInvestigation).mockResolvedValue(mockInvestigation);
  });

  it('renders remediation actions and safety guardrail callout', async () => {
    render(
      <BrowserRouter>
        <FixVerify />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Fix & Verify Remediation Workspace/i)).toBeInTheDocument();
      expect(screen.getByText(/Safety Guardrail Active/i)).toBeInTheDocument();
      expect(screen.getByText(/Increase max_size to 50 in database.yaml/i)).toBeInTheDocument();
    });
  });

  it('runs verification and displays passing telemetry report', async () => {
    vi.mocked(api.verifyIncident).mockResolvedValue({
      status: 'passed',
      previous_error_frequency: '64 errors/min',
      current_error_frequency: '0 errors/min',
      relevant_service_health: 'Healthy (200 OK)',
      remaining_failures: [],
      summary: 'Verification PASSED: Target services healthy.'
    });

    render(
      <BrowserRouter>
        <FixVerify />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Run Automated Verification/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Run Automated Verification/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/VERIFICATION PASSED/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Target services healthy/i)).toBeInTheDocument();
    });
  });
});
