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
  { id: 'product-asset-1', title: 'Product Asset Strength (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'product-asset-1' } } },
  { id: 'product-asset-2', title: 'Product Asset Strength (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'product-asset-2' } } },
  { id: 'budget-deep-dive-1', title: 'Budget Product Deep Dive (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'budget-deep-dive-1' } } },
  { id: 'budget-deep-dive-2', title: 'Budget Product Deep Dive (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'budget-deep-dive-2' } } },
  { id: 'data-asset', title: 'Data Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-asset' } } },
  { id: 'channel-asset', title: 'Channel Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'channel-asset' } } },
  { id: 'relationship-asset', title: 'Relationship Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'relationship-asset' } } },
  { id: 'team-ops-exec-1', title: 'Team + Operating Model — Executive Summary (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec-1' } } },
  { id: 'team-ops-exec-2', title: 'Team + Operating Model — Executive Summary (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec-2' } } },
  { id: 'people-roles-1', title: 'People & Roles (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'people-roles-1' } } },
  { id: 'people-roles-2', title: 'People & Roles (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'people-roles-2' } } },
  { id: 'functional-coverage-1', title: 'Functional Coverage & Resourcing (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'functional-coverage-1' } } },
  { id: 'functional-coverage-2', title: 'Functional Coverage & Resourcing (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'functional-coverage-2' } } },
  { id: 'operating-model-maturity', title: 'Operating Model Maturity', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'operating-model-maturity' } } },

  // ── Phase 4 — ROI Quantification & Synergy Roadmap (slides 30–39) ──
  { id: 'synergies-exec', title: 'Phase 4: Buyer ↔ Target Synergies — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergies-exec' } } },
  { id: 'synergy-detail-1', title: 'Synergy Detail (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-detail-1' } } },
  { id: 'synergy-detail-2', title: 'Synergy Detail (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-detail-2' } } },
  { id: 'ctms-synergy-1', title: 'CTMS Synergy (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ctms-synergy-1' } } },
  { id: 'ctms-synergy-2', title: 'CTMS Synergy (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ctms-synergy-2' } } },
  { id: 'synergy-waves-1', title: 'Synergy Pathways (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-waves-1' } } },
  { id: 'synergy-waves-2', title: 'Synergy Pathways (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-waves-2' } } },
  { id: 'internal-transformation-1', title: 'Internal WCG Transformation (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-transformation-1' } } },
  { id: 'internal-transformation-2', title: 'Internal WCG Transformation (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-transformation-2' } } },
  { id: 'build-vs-buy-1', title: 'Build vs. Buy (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-vs-buy-1' } } },
  { id: 'build-vs-buy-2', title: 'Build vs. Buy (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-vs-buy-2' } } },
  { id: 'data-flywheel-1', title: 'WCG Data Flywheel (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-flywheel-1' } } },
  { id: 'data-flywheel-2', title: 'WCG Data Flywheel (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-flywheel-2' } } },
  { id: 'priority-initiatives-1', title: 'Priority Initiatives (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'priority-initiatives-1' } } },
  { id: 'priority-initiatives-2', title: 'Priority Initiatives (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'priority-initiatives-2' } } },
  { id: 'sensitivity-1', title: 'Sensitivity: Impact on Growth Curve (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity-1' } } },
  { id: 'sensitivity-2', title: 'Sensitivity: Impact on Growth Curve (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity-2' } } },
  { id: 'ai-quantified-impact-1', title: 'AI Opportunity — Quantified Impact (1 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact-1' } } },
  { id: 'ai-quantified-impact-2', title: 'AI Opportunity — Quantified Impact (2 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact-2' } } },
  { id: 'ai-quantified-impact-3', title: 'AI Opportunity — Quantified Impact (3 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact-3' } } },
]

export default slides
