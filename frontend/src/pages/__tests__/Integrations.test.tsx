import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Integrations } from '../Integrations';
import { api } from '../../services/api';

vi.mock('../../services/api');

const mockIntegrations = [
  { id: 'github', name: 'GitHub', description: 'Correlate commits', status: 'connected', permissions: 'repo:read', is_simulated: false },
  { id: 'cloudwatch', name: 'AWS CloudWatch', description: 'Metrics & alarms', status: 'simulated', permissions: 'read', is_simulated: true }
];

const mockRepos = [
  { full_name: 'causiq/auth-service', default_branch: 'main', is_simulated: false }
];

describe('Integrations Hub Page', () => {
  beforeEach(() => {
    vi.mocked(api.getIntegrations).mockResolvedValue(mockIntegrations);
    vi.mocked(api.getGitHubRepos).mockResolvedValue(mockRepos);
  });

  it('renders integration cards with live and simulated badges', async () => {
    render(
      <BrowserRouter>
        <Integrations />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Hub')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('AWS CloudWatch')).toBeInTheDocument();
      expect(screen.getByText('LIVE ADAPTER')).toBeInTheDocument();
      expect(screen.getByText('SIMULATED')).toBeInTheDocument();
    });
  });
});
