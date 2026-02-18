'use client'

import React, { useMemo } from 'react'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
}

const SIZES = ['0-300', '301-1000', '1001+']
const COMPLEXITIES = ['1-3', '4-10', '11+']

function getDiffColor(diff: number): string {
  if (diff >= 1.0) return '#15803d'
  if (diff >= 0.5) return '#22c55e'
  if (diff >= 0.2) return '#86efac'
  if (diff > 0) return '#dcfce7'
  if (diff <= -1.0) return '#dc2626'
  if (diff <= -0.5) return '#ef4444'
  if (diff <= -0.2) return '#fca5a5'
  return '#fee2e2'
}

function getDiffTextColor(diff: number): string {
  if (Math.abs(diff) >= 0.5) return '#ffffff'
  if (diff > 0) return '#15803d'
  return '#dc2626'
}

export function SizeComplexityHeatmap({ data }: Props) {
  const grid = useMemo(() => {
    const lookup: Record<string, typeof data.sizeComplexity[0]> = {}
    for (const entry of data.sizeComplexity) {
      lookup[`${entry.size}|${entry.complexity}`] = entry
    }
    return lookup
  }, [data.sizeComplexity])

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Size × Complexity
      </h3>
      <p className="text-[10px] text-[#a8a29e] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Differential: green = pilot faster, red = non-pilot faster
      </p>

      <div className="overflow-auto">
        <table className="w-full border-collapse" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <thead>
            <tr>
              <th className="text-[10px] text-[#a8a29e] font-normal p-1 text-left" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Lines \ PRs
              </th>
              {COMPLEXITIES.map(c => (
                <th key={c} className="text-[10px] text-[#a8a29e] font-medium p-1 text-center">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map(size => (
              <tr key={size}>
                <td className="text-[10px] font-medium text-[#57534e] p-1 whitespace-nowrap">
                  {size}
                </td>
                {COMPLEXITIES.map(comp => {
                  const key = `${size}|${comp}`
                  const entry = grid[key]

                  if (!entry || entry.pilot_tickets === 0) {
                    return (
                      <td
                        key={key}
                        className="p-1 text-center"
                        style={{ backgroundColor: '#fafaf9' }}
                      >
                        <div className="rounded-md py-2 px-1">
                          <span className="text-xs text-[#a8a29e]">—</span>
                        </div>
                      </td>
                    )
                  }

                  const diff = (entry.pilot_productivity - entry.nonpilot_productivity) / entry.nonpilot_productivity
                  const bgColor = getDiffColor(diff)
                  const textColor = getDiffTextColor(diff)

                  return (
                    <td key={key} className="p-1 text-center">
                      <div
                        className="rounded-md py-2 px-1"
                        style={{ backgroundColor: bgColor }}
                        title={`Pilot: ${entry.pilot_productivity.toFixed(4)} (${entry.pilot_tickets} tix)\nNon-pilot: ${entry.nonpilot_productivity.toFixed(4)} (${entry.nonpilot_tickets} tix)`}
                      >
                        <div className="text-xs font-semibold" style={{ color: textColor }}>
                          {diff >= 0 ? '+' : ''}{(diff * 100).toFixed(0)}%
                        </div>
                        <div className="text-[9px] mt-0.5" style={{ color: textColor, opacity: 0.7 }}>
                          {entry.pilot_tickets}/{entry.nonpilot_tickets}
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
