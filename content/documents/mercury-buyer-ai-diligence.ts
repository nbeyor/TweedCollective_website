/**
 * Mercury: AI Diligence — Buyer Acquisition Analysis
 *
 * Content file for the Mercury due diligence document.
 * Each slide uses type: 'custom' with componentId: 'MercuryDiligenceSlide',
 * which renders via the MercuryDiligenceSlides component.
 *
 * The slide data (text, metrics, charts) is co-located with the rendering
 * component for now due to the complexity of the 40-slide document.
 * Future refactor: progressively extract text/data into this file's props.
 *
 * Structure: Front Matter → Phase 1–4 (39 slides)
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'mercury-buyer-ai-diligence'

export const slides: SlideData[] = [
  // ── Front Matter (slides 1–3) ──────────────────────────────────────
  {
    id: 'cover',
    title: 'Cover',
    type: 'title',
    content: {
      type: 'title',
      badge: 'AI Due Diligence',
      headline: 'Mercury: AI Diligence',
      subtitle: 'Buyer — Potential Acquisition Analysis',
      metrics: [
        { value: 'WCG Clinical', label: 'Prepared for' },
        { value: 'Tweed Collective', label: 'Prepared by' },
        { value: 'March 2026', label: 'Date' },
      ],
      insightBox: {
        label: 'Confidential',
        text: 'Public Sources + Diligence Call Materials',
      },
    },
  },
  {
    id: 'framework-overview',
    title: 'How We Evaluated Mercury\'s AI Portfolio',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'MercuryDiligenceSlide',
      props: { slideId: 'framework-overview' }
    }
  },
  { id: 'executive-summary', title: 'Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'executive-summary' } } },

  // ── Phase 1 — Business Value & Growth Thesis (slides 4–13) ─────────
  { id: 'growth-thesis-exec-1', title: 'Phase 1: Growth Thesis Alignment — Executive Summary (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-thesis-exec-1' } } },
  { id: 'growth-thesis-exec-2', title: 'Phase 1: Growth Thesis Alignment — Executive Summary (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-thesis-exec-2' } } },
  { id: 'growth-projections-1', title: 'Growth Projections — Snapshot + Assumptions (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-projections-1' } } },
  { id: 'growth-projections-2', title: 'Growth Projections — Snapshot + Assumptions (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-projections-2' } } },
  { id: 'offering-ai-growth-matrix-1', title: 'Offering + AI Initiatives ↔ Growth Drivers (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix-1' } } },
  { id: 'offering-ai-growth-matrix-2', title: 'Offering + AI Initiatives ↔ Growth Drivers (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix-2' } } },
  { id: 'ai-roadmap-fit-1', title: 'AI Roadmap Fit to Growth Thesis (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-roadmap-fit-1' } } },
  { id: 'ai-roadmap-fit-2', title: 'AI Roadmap Fit to Growth Thesis (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-roadmap-fit-2' } } },
  { id: 'scenarios-1', title: 'Scenarios for Growth & Disruption Outcomes (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'scenarios-1' } } },
  { id: 'scenarios-2', title: 'Scenarios for Growth & Disruption Outcomes (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'scenarios-2' } } },

  // ── Phase 2 — AI Initiatives & Disruption Risk (slides 9–19) ───────
  { id: 'disruption-risk-exec', title: 'Phase 2: Disruption Risk — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'disruption-risk-exec' } } },
  { id: 'who-could-disrupt-1', title: 'Who Could Disrupt (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'who-could-disrupt-1' } } },
  { id: 'who-could-disrupt-2', title: 'Who Could Disrupt (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'who-could-disrupt-2' } } },
  { id: 'what-they-would-build-1', title: 'What the Disruptor Would Build (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-they-would-build-1' } } },
  { id: 'what-they-would-build-2', title: 'What the Disruptor Would Build (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-they-would-build-2' } } },
  { id: 'what-must-change', title: 'What Must Change for Disruption to Be True', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-must-change' } } },
  { id: 'build-it-today-1', title: '"Build-It-Today" Replicability (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-it-today-1' } } },
  { id: 'build-it-today-2', title: '"Build-It-Today" Replicability (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-it-today-2' } } },
  { id: 'ai-assessment-exec', title: 'AI Assessment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-assessment-exec' } } },
  { id: 'ai-inventory-1', title: 'AI Inventory (What Exists) (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory-1' } } },
  { id: 'ai-inventory-2', title: 'AI Inventory (What Exists) (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory-2' } } },
  { id: 'architecture-readiness', title: 'Architecture Snapshot + Readiness', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'architecture-readiness' } } },
  { id: 'ai-value-framework-1', title: 'AI Value Framework (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-framework-1' } } },
  { id: 'ai-value-framework-2', title: 'AI Value Framework (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-framework-2' } } },
  { id: 'ai-value-proof-1', title: 'External Value Examples (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-proof-1' } } },
  { id: 'ai-value-proof-2', title: 'External Value Examples (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-proof-2' } } },
  { id: 'internal-value-proofs-1', title: 'Internal Value Proofs (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-value-proofs-1' } } },
  { id: 'internal-value-proofs-2', title: 'Internal Value Proofs (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-value-proofs-2' } } },

  // ── Phase 3 — Team, Assets & Defensibility (slides 20–29) ──────────
  { id: 'asset-value-exec', title: 'Phase 3: Underlying Asset Value — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'asset-value-exec' } } },
  { id: 'product-asset', title: 'Product Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'product-asset' } } },
  { id: 'budget-deep-dive', title: 'Budget Product Deep Dive', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'budget-deep-dive' } } },
  { id: 'data-asset', title: 'Data Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-asset' } } },
  { id: 'channel-asset', title: 'Channel Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'channel-asset' } } },
  { id: 'relationship-asset', title: 'Relationship Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'relationship-asset' } } },
  { id: 'team-ops-exec', title: 'Team + Operating Model — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec' } } },
  { id: 'people-roles', title: 'People & Roles', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'people-roles' } } },
  { id: 'functional-coverage', title: 'Functional Coverage & Resourcing', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'functional-coverage' } } },
  { id: 'operating-model-maturity', title: 'Operating Model Maturity', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'operating-model-maturity' } } },

  // ── Phase 4 — ROI Quantification & Synergy Roadmap (slides 30–39) ──
  { id: 'synergies-exec', title: 'Phase 4: Buyer ↔ Target Synergies — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergies-exec' } } },
  { id: 'synergy-detail', title: 'Synergy Detail (Selected Connections)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-detail' } } },
  { id: 'ctms-synergy', title: 'CTMS Synergy — Mercury as the Missing ClinSphere Module', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ctms-synergy' } } },
  { id: 'synergy-waves', title: 'Synergy Pathways (3 Waves)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-waves' } } },
  { id: 'internal-transformation', title: 'Internal WCG Transformation Opportunity', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-transformation' } } },
  { id: 'build-vs-buy', title: 'Build vs. Buy — Cost to Replicate', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-vs-buy' } } },
  { id: 'data-flywheel', title: 'WCG Data Flywheel', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-flywheel' } } },
  { id: 'priority-initiatives', title: 'Priority Initiatives — Assumptions + Uplift', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'priority-initiatives' } } },
  { id: 'sensitivity', title: 'Sensitivity: Impact on Growth Curve', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity' } } },
  { id: 'ai-quantified-impact', title: 'AI Opportunity — Quantified Impact', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact' } } },
]

export default slides
