import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ridgeline } from '@/data/work'
import HarveyBall, { HarveyLegend } from '@/components/HarveyBall'
import WorkDisclaimer from '@/components/WorkDisclaimer'

export const metadata: Metadata = {
  title: 'Project Ridgeline',
  description:
    'Illustrative AI diligence example in clinical trial technology. Four-phase cover, one Value page, asset scoring rule, and value scenarios. Figures invented.',
}

const gradeTone: Record<string, string> = {
  Strong: 'bg-sage/15 text-sage-light',
  Conditional: 'bg-gold/15 text-gold',
  'High-risk': 'bg-rust/15 text-rust-light',
}

export default function RidgelinePage() {
  return (
    <div className="pt-32 bg-void min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-gold/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="mb-4">
              <Link href="/work" className="text-sm text-stone hover:text-cream transition-colors">
                ← Work
              </Link>
            </p>
            <span className="mono-label mb-4 block">Illustrative worked example</span>
            <h1 className="text-cream mb-3">{ridgeline.name}</h1>
            <p className="text-gold mb-6">{ridgeline.sector}</p>
            <p className="body-large text-stone">{ridgeline.dek}</p>
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Cover map</span>
            <h2 className="text-cream mb-4">Four phases. Four grades.</h2>
            <p className="text-stone">
              This is the first page of the memo. Conditional names the condition. High-risk is
              not a soft no. It is a line that is not priced at entry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ridgeline.cover.map((row) => (
              <div key={row.phase} className="card p-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-cream">{row.phase}</h3>
                  <span className={`badge ${gradeTone[row.grade]}`}>{row.grade}</span>
                </div>
                <p className="text-stone text-sm leading-relaxed">{row.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-void">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="mono-label mb-4 block">// One phase, written through</span>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-cream">{ridgeline.phaseDeepDive.phase}</h2>
              <span className={`badge ${gradeTone[ridgeline.phaseDeepDive.grade]}`}>
                {ridgeline.phaseDeepDive.grade}
              </span>
            </div>

            <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-2">Answer</p>
            <p className="text-cream text-lg leading-relaxed mb-10">
              {ridgeline.phaseDeepDive.answer}
            </p>

            <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-3">Risks</p>
            <ul className="space-y-3 mb-10">
              {ridgeline.phaseDeepDive.risks.map((risk) => (
                <li key={risk} className="text-stone leading-relaxed flex gap-3">
                  <span className="text-gold font-mono shrink-0">–</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-mono uppercase tracking-wider text-zinc mb-3">Actions</p>
            <ul className="space-y-3">
              {ridgeline.phaseDeepDive.actions.map((action) => (
                <li key={action} className="text-stone leading-relaxed flex gap-3">
                  <span className="text-gold font-mono shrink-0">–</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-carbon">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Assets</span>
            <h2 className="text-cream mb-4">The Harvey-ball rule</h2>
            <ul className="space-y-2 mb-8">
              {ridgeline.harveyRule.map((rule) => (
                <li key={rule} className="text-stone text-sm leading-relaxed flex gap-3">
                  <span className="text-gold font-mono shrink-0">–</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <HarveyLegend />
          </div>

          <div className="max-w-3xl divide-y divide-slate/40 border border-slate/40 rounded-2xl">
            {ridgeline.assets.map((asset) => (
              <div key={asset.name} className="flex items-start gap-4 p-5">
                <HarveyBall value={asset.value} />
                <div>
                  <p className="text-cream text-sm font-medium mb-1">{asset.name}</p>
                  <p className="text-stone text-sm leading-relaxed">{asset.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-graphite">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="mono-label mb-4 block">// Value</span>
            <h2 className="text-cream mb-4">Scenarios versus the budget assumption</h2>
            <p className="text-stone">
              The seller budget is a productivity case. Diligence writes a hold case. Those are
              not the same number, and only one of them is an entry assumption.
            </p>
          </div>

          <div className="max-w-3xl space-y-4">
            {ridgeline.valueScenarios.map((row) => (
              <div key={row.name} className="card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                  <h3 className="text-cream text-lg">{row.name}</h3>
                  <span className="text-sm text-gold">{row.underwritten}</span>
                </div>
                <p className="text-cream text-sm mb-2">{row.productivity}</p>
                <p className="text-stone text-sm leading-relaxed">{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-void border-t border-slate/20">
        <div className="container mx-auto px-4">
          <WorkDisclaimer />
        </div>
      </section>
    </div>
  )
}
