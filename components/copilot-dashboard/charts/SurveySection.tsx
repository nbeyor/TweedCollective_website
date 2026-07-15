'use client'

import React from 'react'
import type { SurveyData } from '../types'

interface Props {
  survey: SurveyData
}

function QuoteBlock({ name, text }: { name: string; text: string }) {
  return (
    <blockquote className="mt-3 border-l-2 border-[#e7e5e4] pl-3 text-xs italic text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      &ldquo;{text.length > 200 ? text.slice(0, 200) + '…' : text}&rdquo;
      <span className="block mt-1 text-[10px] not-italic text-[#a8a29e]">— {name}</span>
    </blockquote>
  )
}

export function SurveySection({ survey }: Props) {
  const { productivity_perception, modification_frequency, tasks_used, scenarios_encouraged, risks_observed, quotes, respondents } = survey

  const topTasks = tasks_used.slice(0, 3).map(t => t.label)
  const benefitQuote = quotes.find(q => q.benefit)
  const drawbackQuote = quotes.find(q => q.drawback)
  const recQuote = quotes.find(q => q.recommendation)

  const oftenAlways = (modification_frequency['Often'] || 0) + (modification_frequency['Almost always'] || 0)

  const topScenario = scenarios_encouraged[0]
  const noIssuesCount = risks_observed.find(r => r.label === 'None observed')?.count ?? 0

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-[#1c1917] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Experience — Developer Survey ({respondents} respondents)
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Panel 1: Productivity */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm" style={{ borderTopColor: '#15803d', borderTopWidth: 3 }}>
          <p className="text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Productivity
          </p>
          <p className="text-2xl font-semibold text-[#15803d] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {productivity_perception.positive}/{respondents}
          </p>
          <p className="text-xs text-[#57534e] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            report increased productivity
          </p>
          <p className="text-[11px] text-[#57534e] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Top tasks: {topTasks.join(', ')}.{' '}
            {productivity_perception.positive} positive, {productivity_perception.neutral} neutral, {productivity_perception.negative} negative perception.
          </p>
          {benefitQuote?.benefit && (
            <QuoteBlock name={benefitQuote.name} text={benefitQuote.benefit} />
          )}
        </div>

        {/* Panel 2: Quality */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm" style={{ borderTopColor: '#d97706', borderTopWidth: 3 }}>
          <p className="text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Quality
          </p>
          <p className="text-2xl font-semibold text-[#d97706] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {oftenAlways}/{respondents}
          </p>
          <p className="text-xs text-[#57534e] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            often modify AI-generated code
          </p>
          <p className="text-[11px] text-[#57534e] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Top risks: {risks_observed.slice(0, 3).map(r => r.label).join(', ')}.
            Measured QA churn remains comparable between groups.
          </p>
          {drawbackQuote?.drawback && (
            <QuoteBlock name={drawbackQuote.name} text={drawbackQuote.drawback} />
          )}
        </div>

        {/* Panel 3: Overall Experience */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm" style={{ borderTopColor: '#94a3b8', borderTopWidth: 3 }}>
          <p className="text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Overall Experience
          </p>
          <p className="text-2xl font-semibold text-[#57534e] mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {topScenario?.count}/{respondents}
          </p>
          <p className="text-xs text-[#57534e] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            recommend AI for {topScenario?.label.toLowerCase()}
          </p>
          <p className="text-[11px] text-[#57534e] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Top scenarios: {scenarios_encouraged.slice(0, 3).map(s => s.label).join(', ')}.
            {noIssuesCount > 0 && ` ${noIssuesCount} respondent${noIssuesCount > 1 ? 's' : ''} observed no issues.`}
          </p>
          {recQuote?.recommendation && (
            <QuoteBlock name={recQuote.name} text={recQuote.recommendation} />
          )}
        </div>
      </div>
    </div>
  )
}
