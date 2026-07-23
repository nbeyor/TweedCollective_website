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

export interface CopilotDashboardData {
  generated: string
  dataRange: string
  dataCutoff?: string | null
  baselineEnd: string
  matureStart: string
  rollingWindow: number
  minTicketsThreshold: number
  bucketing?: {
    sizeCut: number
    filesCut: number
    sizeLabels: string[]
    filesLabels: string[]
  }
  config: {
    teamSize: number
    workdaysPerWeek: number
    totalCopilotUsers: number | null
    copilotCoveragePct: number | null
  }
  baseline: {
    tickets: number
    authors: number
    workdays: number
    productivity: number
    qa_churn_rate: number
    date_range: string
  }
  summary: {
    total_tickets: number
    team_authors: number
    team_productivity: number
    productivity_vs_baseline: string
    team_qa_churn: number
    qa_vs_baseline: string
    weeks_of_data: number
    copilot_users?: number
    copilot_adoption_current?: number
  }
  weekly: WeeklyEntry[]
  baselineWeekly: BaselineWeeklyEntry[]
  sizeComplexity: SizeComplexityEntry[]
  sizeComplexityWeekly: SizeComplexityWeeklyEntry[]
  availability: AvailabilityEntry[]
  copilotAdoption: CopilotAdoption | null
  copilotPrCorrelation: CopilotPrCorrelation | null
  projects?: ProjectTrackingData | null
  perUser?: PerUserEntry[] | null
  survey?: SurveyData | null
}

export interface PerUserWeekly {
  week: string
  phase: 'baseline' | 'transition' | 'mature'
  tickets: number
  productivity: number
  qaTickets: number
  copilotActive: number
  suggestions: number
  acceptances: number
  acceptanceRate: number | null
  locAdded: number
}

export interface PerUserSummary {
  matureTickets: number
  baselineTickets: number
  matureProductivity: number
  baselineProductivity: number
  prodVsBaseline: string
  adoptionPct: number
  acceptanceRate: number | null
  activeDays: number
  intensityTier: 'heavy' | 'medium' | 'light' | 'none'
}

// Per-developer record. `email` (the local part of the user's address, e.g.
// "pnagpal") is the display label; `alias` (e.g. "Dev-07") is a stable key that
// doubles as the fallback label for users with no email in the export; `uuid`
// is the underlying author identifier.
export interface PerUserEntry {
  alias: string
  uuid: string
  /** Email local part (text before "@"), e.g. "pnagpal". */
  email?: string | null
  /** Modal Department from PR rows, falling back to AI telemetry. */
  department?: string | null
  summary: PerUserSummary
  weekly: PerUserWeekly[]
}

export interface WeeklyEntry {
  week: string
  phase: 'baseline' | 'transition' | 'mature'
  totalTickets: number
  teamAuthors: number
  teamProductivity: number
  teamQARate: number | null
  /** Raw PRs merged this week (a ticket can span several PRs). */
  totalPRs?: number
  /** Total PR lines across the week's tickets. */
  totalLines?: number
  copilotPct: number | null
  /** Adoption % within the Development department only. */
  copilotPctDev?: number | null
  copilotActiveUsers: number | null
  copilotCodeGen: number | null
  lowConfidence: boolean
}

export interface BaselineWeeklyEntry {
  week: string
  totalTickets: number
  teamProductivity: number
  teamQARate: number | null
  lowConfidence: boolean
}

export interface SizeComplexityEntry {
  label: string
  size: string
  complexity: string
  post_tickets: number
  baseline_tickets: number
  post_productivity: number
  baseline_productivity: number
  post_qa_churn?: number
  baseline_qa_churn?: number
}

export interface SizeComplexityWeeklyEntry {
  week: string
  phase: 'baseline' | 'transition' | 'mature'
  size: string
  complexity: string
  tickets: number
  authors: number
  productivity: number
  qaChurn: number | null
  lowConfidence: boolean
}

export interface AvailabilityEntry {
  week: string
  copilot_active_users: number
  copilot_total_users: number
  copilot_pct: number
  code_gen: number
  loc_added: number
}

export interface CopilotAdoption {
  totalCopilotUsers: number
  userTiers: { heavy: number; medium: number; light: number }
  avgDailyUsersRecent: number
  adoptionTrend: string
  weekly: CopilotWeeklyEntry[]
}

export interface CopilotWeeklyEntry {
  week: string
  activeUsers: number
  rollingActiveUsers?: number
  copilotPct: number
  totalCodeGen: number
  totalCodeAccept: number
  agentUsers?: number
  chatUsers?: number
  locAdded: number
  /** Development-department cohort (omitted when the export has no Department column). */
  devActiveUsers?: number
  devRollingActiveUsers?: number
  devCopilotPct?: number
}

export interface CopilotPrCorrelation {
  totalTickets: number
  assistedTickets: number
  nonAssistedTickets: number
  assistedProductivity: number
  nonAssistedProductivity: number
  productivityLift: string
  assistedQAChurn: number
  nonAssistedQAChurn: number
  qaChurnDelta: string
  weeklyComparison: CopilotCorrelationWeekly[]
  copilotIntensity: Record<string, IntensityBucket>
}

export interface CopilotCorrelationWeekly {
  week: string
  assistedTickets: number
  nonAssistedTickets: number
  assistedProductivity: number | null
  nonAssistedProductivity: number | null
  assistedQARate: number | null
  nonAssistedQARate: number | null
}

export interface IntensityBucket {
  tickets: number
  productivity: number
  qaChurn: number
  avgSuggestions: number
}

export interface ProjectPeriodSummary {
  unique_projects: number
  total_tickets: number
  tickets_per_project: number
  avg_projects_per_week: number
}

export interface ProjectWeeklyEntry {
  week: string
  phase: 'baseline' | 'transition' | 'mature'
  activeProjects: number
  totalTickets: number
  ticketsPerProject: number
}

export interface ProjectRow {
  project: string
  baselineTickets: number
  matureTickets: number
  baselineWeeksActive: number
  matureWeeksActive: number
  baselineVelocity: number
  matureVelocity: number
  velocityDelta: string
}

export interface ProjectTrackingData {
  baseline: ProjectPeriodSummary
  mature: ProjectPeriodSummary
  delta: {
    projects_vs_baseline: string
    velocity_vs_baseline: string
    breadth_vs_baseline: string
  }
  weekly: ProjectWeeklyEntry[]
  topProjects: ProjectRow[]
}
