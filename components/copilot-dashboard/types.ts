import type { SurveyData } from '../dashboard/types'

export type { SurveyData }

export interface CopilotDashboardData {
  generated: string
  dataRange: string
  baselineEnd: string
  matureStart: string
  rollingWindow: number
  minTicketsThreshold: number
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
  availability: AvailabilityEntry[]
  copilotAdoption: CopilotAdoption | null
  survey?: SurveyData | null
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
  copilotPct: number
  totalCodeGen: number
  totalCodeAccept: number
  agentUsers: number
  chatUsers: number
  locAdded: number
}
