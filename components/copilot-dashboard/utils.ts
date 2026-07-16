import type { CopilotDashboardData } from './types'

export function formatWeekLabel(w: string) {
  const d = new Date(w + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// A week (labeled by its Sunday end date) is complete only if the whole
// Mon-Sun window falls within the export's coverage. `dataCutoff` is the last
// day covered by the PR export; older JSONs predate that field and may carry
// a partial trailing week, for which the last PR merge date from `dataRange`
// is the only available bound.
export function weekCutoff(data: CopilotDashboardData): string {
  return data.dataCutoff ?? data.dataRange.split(' to ')[1] ?? ''
}

// Drop any week ending past the cutoff from every weekly-shaped series, so
// all pages work from the same set of complete weeks. Apply once, right after
// fetching the dashboard JSON.
export function trimIncompleteWeeks(data: CopilotDashboardData): CopilotDashboardData {
  const cutoff = weekCutoff(data)
  if (!cutoff) return data
  const keep = (week: string) => week <= cutoff
  return {
    ...data,
    weekly: data.weekly.filter(w => keep(w.week)),
    availability: data.availability.filter(w => keep(w.week)),
    sizeComplexityWeekly: data.sizeComplexityWeekly.filter(w => keep(w.week)),
    copilotAdoption: data.copilotAdoption
      ? { ...data.copilotAdoption, weekly: data.copilotAdoption.weekly.filter(w => keep(w.week)) }
      : null,
    copilotPrCorrelation: data.copilotPrCorrelation
      ? {
          ...data.copilotPrCorrelation,
          weeklyComparison: data.copilotPrCorrelation.weeklyComparison.filter(w => keep(w.week)),
        }
      : null,
    perUser: data.perUser
      ? data.perUser.map(u => ({ ...u, weekly: u.weekly.filter(w => keep(w.week)) }))
      : data.perUser,
  }
}
