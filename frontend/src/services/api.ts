const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText || res.statusText}`);
  }

  return res.json();
}

export const api = {
  getHealth: () => fetchApi<{ status: string }>('/api/health'),
  getDashboardStats: () => fetchApi<any>('/api/dashboard/stats'),
  getIntegrations: () => fetchApi<any[]>('/api/integrations'),
  connectGitHub: (token: string, owner?: string, repo?: string) =>
    fetchApi('/api/integrations/github/connect', {
      method: 'POST',
      body: JSON.stringify({ token, owner, repo }),
    }),
  getGitHubRepos: () => fetchApi<any[]>('/api/integrations/github/repositories'),
  getGitHubCommits: () => fetchApi<any[]>('/api/integrations/github/commits'),
  getScenarios: () => fetchApi<any[]>('/api/scenarios'),
  getIncidents: () => fetchApi<any[]>('/api/incidents'),
  getIncident: (id: string) => fetchApi<any>(`/api/incidents/${id}`),
  createIncident: (data: any) =>
    fetchApi('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  investigateIncident: (id: string) =>
    fetchApi<any>(`/api/incidents/${id}/investigate`, {
      method: 'POST',
    }),
  getInvestigation: (id: string) => fetchApi<any>(`/api/incidents/${id}/investigation`),
  getTimeline: (id: string) => fetchApi<any[]>(`/api/incidents/${id}/timeline`),
  getEvidenceGraph: (id: string) => fetchApi<any>(`/api/incidents/${id}/evidence-graph`),
  verifyIncident: (id: string, data: { verification_evidence_text?: string; manual_override?: boolean }) =>
    fetchApi<any>(`/api/incidents/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resolveIncident: (id: string) =>
    fetchApi<any>(`/api/incidents/${id}/resolve`, {
      method: 'POST',
    }),
  getReport: (id: string) => fetchApi<any>(`/api/incidents/${id}/report`),
};
