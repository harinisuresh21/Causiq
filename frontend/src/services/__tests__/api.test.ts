import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, fetchApi } from '../api';

describe('API Service Layer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchApi performs a successful GET request', async () => {
    const mockData = { status: 'healthy', service: 'Causiq AI Core' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const res = await api.getHealth();
    expect(res).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/health'),
      expect.any(Object)
    );
  });

  it('fetchApi throws an error on non-ok responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Incident not found',
    } as Response);

    await expect(api.getIncident('INC-INVALID')).rejects.toThrow('API Error 404: Incident not found');
  });

  it('createIncident calls POST /api/incidents with payload', async () => {
    const mockPayload = { title: 'Test Outage' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'INC-NEW-01', ...mockPayload }),
    } as Response);

    const res = await api.createIncident(mockPayload);
    expect(res.id).toBe('INC-NEW-01');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/incidents'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockPayload),
      })
    );
  });

  it('verifyIncident calls POST /api/incidents/{id}/verify with evidence', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'passed', current_error_frequency: '0 errors/min' }),
    } as Response);

    const res = await api.verifyIncident('INC-101', { verification_evidence_text: '200 OK' });
    expect(res.status).toBe('passed');
  });
});
