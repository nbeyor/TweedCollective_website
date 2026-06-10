import type { CopilotDashboardData } from '../types'

/**
 * Derive the size / complexity bucket labels for the charts.
 *
 * Prefers the explicit `bucketing` block emitted by the pipeline (so changing
 * the cut-points in refresh_copilot.py automatically flows through the UI).
 * Falls back to the distinct values present in the data for older JSON files
 * generated before `bucketing` was added.
 */
export function getBuckets(data: CopilotDashboardData): { sizes: string[]; complexities: string[] } {
  if (data.bucketing?.sizeLabels?.length && data.bucketing?.filesLabels?.length) {
    return { sizes: data.bucketing.sizeLabels, complexities: data.bucketing.filesLabels }
  }
  const sizes = Array.from(new Set(data.sizeComplexity.map(e => e.size)))
  const complexities = Array.from(new Set(data.sizeComplexity.map(e => e.complexity)))
  // Small bucket first ("0-150" < "151+", "1-5" < "6+"): the leading number sorts correctly.
  const byLeadingNumber = (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10)
  return { sizes: sizes.sort(byLeadingNumber), complexities: complexities.sort(byLeadingNumber) }
}
