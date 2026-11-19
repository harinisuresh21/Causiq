import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EvidenceGraph } from '../EvidenceGraph';
import { api } from '../../services/api';

vi.mock('../../services/api');

const mockIncidents = [
  {
    id: 'INC-401',
    title: 'Database Outage',
    severity: 'critical',
    status: 'identified',
    affected_services: ['Database'],
    created_at: new Date().toISOString()
  }
];

const mockGraphData = {
  incident_id: 'INC-401',
  nodes: [
    {
      id: 'EV-1',
      data: {
        label: 'Commit a7b8c9d',
        service: 'Database',
        source: 'github',
        description: 'Reduced pool max size to 5',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        is_simulated: true
      }
    }
  ],
  edges: []
};

describe('EvidenceGraph Page Component', () => {
  beforeEach(() => {
    vi.mocked(api.getIncidents).mockResolvedValue(mockIncidents);
    vi.mocked(api.getEvidenceGraph).mockResolvedValue(mockGraphData);
  });

  it('renders graph header, legend, and active incident selector', async () => {
    render(
      <BrowserRouter>
        <EvidenceGraph />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Interactive Evidence Relationship Graph')).toBeInTheDocument();
      expect(screen.getByText(/INC-401/i)).toBeInTheDocument();
      expect(screen.getByText(/Evidence Inspector/i)).toBeInTheDocument();
    });
  });
});
