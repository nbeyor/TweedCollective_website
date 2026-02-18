export interface DashboardData {
  generated: string;
  dataRange: string;
  pilotStart: string;
  rollingWindow: number;
  minTicketsThreshold: number;
  config: {
    pilotCount: number;
    nonPilotCount: number;
    workdaysPerWeek: number;
  };
  baseline: {
    tickets: number;
    authors: number;
    workdays: number;
    productivity: number;
    qa_churn_rate: number;
    date_range: string;
  };
  summary: {
    pilot_tickets: number;
    nonpilot_tickets: number;
    total_tickets: number;
    pilot_authors: number;
    nonpilot_authors: number;
    pilot_productivity: number;
    nonpilot_productivity: number;
    productivity_ratio: number;
    pilot_qa_churn: number;
    nonpilot_qa_churn: number;
    ai_output_share: number;
    weeks_of_data: number;
  };
  weekly: WeeklyEntry[];
  baselineWeekly: BaselineWeeklyEntry[];
  sizeComplexity: SizeComplexityEntry[];
  cumulative: CumulativeEntry[];
  availability: AvailabilityEntry[];
  survey: SurveyData | null;
}

export interface WeeklyEntry {
  week: string;
  totalTickets: number;
  pilotTickets: number;
  nonpilotTickets: number;
  pilotProductivity: number;
  nonpilotProductivity: number;
  pilotProductivityRolling: number | null;
  nonpilotProductivityRolling: number | null;
  pilotProductivityStd: number | null;
  nonpilotProductivityStd: number | null;
  pilotQARate: number | null;
  nonpilotQARate: number | null;
  pilotQARateRolling: number | null;
  nonpilotQARateRolling: number | null;
  aiOutputShare: number;
  lowConfidence: boolean;
}

export interface BaselineWeeklyEntry {
  week: string;
  totalTickets: number;
  nonpilotProductivity: number;
  nonpilotQARate: number | null;
  lowConfidence: boolean;
}

export interface SizeComplexityEntry {
  label: string;
  size: string;
  complexity: string;
  pilot_tickets: number;
  nonpilot_tickets: number;
  pilot_productivity: number;
  nonpilot_productivity: number;
}

export interface CumulativeEntry {
  week: string;
  pilot_cumulative: number;
  nonpilot_cumulative: number;
  total_cumulative: number;
  ai_share: number;
}

export interface AvailabilityEntry {
  week: string;
  active_pilot_devs: number;
  total_pilot_devs: number;
  availability_pct: number;
}

export interface SurveyData {
  respondents: number;
  total_pilot: number;
  response_rate: number;
  productivity_perception: {
    positive: number;
    neutral: number;
    negative: number;
    detail: Record<string, number>;
  };
  modification_frequency: Record<string, number>;
  tasks_used: { label: string; count: number; pct: number }[];
  scenarios_encouraged: { label: string; count: number; pct: number }[];
  risks_observed: { label: string; count: number; pct: number }[];
  quotes: {
    name: string;
    benefit?: string;
    drawback?: string;
    recommendation?: string;
  }[];
}
