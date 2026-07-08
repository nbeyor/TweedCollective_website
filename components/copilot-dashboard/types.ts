import type { SurveyData } from '../dashboard/types'

export type { SurveyData }

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

// Per-developer record. `alias` (e.g. "Dev-07") is the stable display label. `uuid`
// is the underlying author identifier; it is NOT present in the public dashboard JSON
// and is merged in client-side only for signed-in, authorized viewers via the
// auth-gated /api/copilot-user-map route — hence optional.
export interface PerUserEntry {
  alias: string
  uuid?: string
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
  copilotPct: number | null
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
