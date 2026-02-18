'use client'

import React from 'react'
import type { DashboardData } from '../types'

interface Props {
  data: DashboardData
}

export function DashboardHeader({ data }: Props) {
  const formatDate = (s: string) => {
    const d = new Date(s + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const rangeStart = data.dataRange.split(' to ')[0]
  const rangeEnd = data.dataRange.split(' to ')[1]

  return (
    <div className="mb-8">
      <h1 className="text-[1.75rem] font-semibold text-[#1c1917] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        AI-Assisted Development — Pilot KPIs
      </h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <span>
          Data: {formatDate(rangeStart)} – {formatDate(rangeEnd)}
        </span>
        <span className="text-[#e7e5e4]">|</span>
        <span>Pilot Start: {formatDate(data.pilotStart)}</span>
        <span className="text-[#e7e5e4]">|</span>
        <span>
          Pilot: <strong className="font-mono text-[#1c1917]">{data.config.pilotCount}</strong> devs
        </span>
        <span className="text-[#e7e5e4]">|</span>
        <span>
          Non-Pilot: <strong className="font-mono text-[#1c1917]">{data.config.nonPilotCount}</strong> devs
        </span>
        <span className="text-[#e7e5e4]">|</span>
        <span>
          Rolling Window: <strong className="font-mono text-[#1c1917]">{data.rollingWindow}</strong> weeks
        </span>
      </div>
      <p className="text-xs text-[#a8a29e] mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Generated {data.generated}
      </p>
    </div>
  )
}
