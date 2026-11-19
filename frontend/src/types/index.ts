export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'investigating' | 'identified' | 'verifying' | 'resolved';
  affected_services: string[];
  created_at: string;
  resolved_at?: string | null;
  is_demo: boolean;
  scenario_id?: string | null;
}

export interface Evidence {
  event_id: string;
  source: string;
  service: string;
  timestamp: string;
  severity: string;
  event_type: string;
  description: string;
  metadata?: Record<string, any>;
  is_simulated?: boolean;
}

export interface Hypothesis {
  title: string;
  explanation: string;
  likelihood: 'high' | 'medium' | 'low';
  supporting_evidence_ids: string[];
  contradicting_evidence_ids: string[];
  missing_evidence: string[];
}

export interface RemediationStep {
  action: string;
  reason: string;
  priority: string;
  risk_level: string;
  required_permissions: string;
  verification_procedure: string;
  status: 'planned' | 'implemented';
}

export interface InvestigationResult {
  incident_summary: string;
  severity: string;
  likely_root_cause: string;
  confidence: number;
  affected_services: string[];
  supporting_evidence: string[];
  contradicting_evidence: string[];
  alternative_hypotheses: Hypothesis[];
  business_impact: string;
  remediation_steps: RemediationStep[];
  verification_checklist: string[];
  missing_information: string[];
}

export interface InvestigationResponse {
  investigation_id: string;
  incident_id: string;
  stages: { stage: number; name: string; description: string }[];
  result: InvestigationResult;
  correlations?: {
    correlations_count: number;
    correlations: Array<{
      type: string;
      source_id: string;
      target_id: string;
      relationship: string;
    }>;
  };
}

export interface VerificationResult {
  status: 'passed' | 'failed';
  previous_error_frequency: string;
  current_error_frequency: string;
  relevant_service_health: string;
  remaining_failures: string[];
  summary: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'simulated';
  last_sync?: string;
  permissions: string;
  is_simulated: boolean;
}

export interface DashboardStats {
  metrics: {
    total_incidents: number;
    active_incidents: number;
    critical_incidents: number;
    resolved_incidents: number;
    avg_investigation_time: string;
  };
  services: Array<{
    name: string;
    status: string;
    error_rate: string;
    response_time: string;
    last_updated: string;
  }>;
  recent_deployments: Array<{
    id: string;
    service: string;
    commit: string;
    environment: string;
    time: string;
    author: string;
    status: string;
  }>;
  incident_trend: Array<{
    time: string;
    critical: number;
    high: number;
    resolved: number;
  }>;
}

export interface DemoScenario {
  id: string;
  title: string;
  service: string;
  severity: string;
  description: string;
  affected_services: string[];
  events: Evidence[];
}
