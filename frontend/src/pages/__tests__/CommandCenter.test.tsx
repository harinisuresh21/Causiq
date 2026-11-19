import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CommandCenter } from '../CommandCenter';
import { api } from '../../services/api';

vi.mock('../../services/api');

const mockDashboardStats = {
  metrics: {
    total_incidents: 4,
    active_incidents: 2,
    critical_incidents: 1,
    resolved_incidents: 2,
    avg_investigation_time: '1m 45s'
  },
  services: [
    { name: 'API Gateway', status: 'healthy', error_rate: '0.01%', response_time: '38ms', last_updated: 'Just now' },
    { name: 'Database Cluster', status: 'degraded', error_rate: '3.8%', response_time: '120ms', last_updated: 'Just now' }
  ],
  recent_deployments: [
    { id: 'DEP-412', service: 'API Gateway', commit: 'a7b8c9d', environment: 'Production', time: '10:00 AM', author: 'dev-lead', status: 'success' }
  ],
  incident_trend: [
    { time: '10:00', critical: 1, high: 2, resolved: 0 }
  ]
};

const mockIncidents = [
  {
    id: 'INC-401',
    title: 'Database Pool Exhaustion Outage',
    severity: 'critical',
    status: 'identified',
    affected_services: ['Database'],
    created_at: new Date().toISOString(),
    is_demo: true
  }
];

describe('CommandCenter Dashboard Page', () => {
  beforeEach(() => {
    vi.mocked(api.getDashboardStats).mockResolvedValue(mockDashboardStats);
    vi.mocked(api.getIncidents).mockResolvedValue(mockIncidents);
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <CommandCenter />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading telemetry and incident state/i)).toBeInTheDocument();
  });

  it('renders dashboard metrics and services after API loads', async () => {
    render(
      <BrowserRouter>
        <CommandCenter />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Command Center')).toBeInTheDocument();
      expect(screen.getByText('API Gateway')).toBeInTheDocument();
      expect(screen.getByText('Database Cluster')).toBeInTheDocument();
      expect(screen.getByText('Database Pool Exhaustion Outage')).toBeInTheDocument();
    });
  });
});
