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
 * Structure: Front Matter → Phase 1–4 (51 slides)
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

  // ── Phase 1 — Business Value & Growth Thesis (slides 4–8) ──────────
  { id: 'growth-thesis-exec', title: 'Phase 1: Growth Thesis Alignment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-thesis-exec' } } },
  { id: 'growth-projections', title: 'Growth Projections — Snapshot + Assumptions', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-projections' } } },
  { id: 'offering-ai-growth-matrix', title: 'Offering + AI Initiatives ↔ Growth Drivers', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix' } } },
  { id: 'ai-roadmap-fit', title: 'AI Roadmap Fit to Growth Thesis', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-roadmap-fit' } } },
  { id: 'scenarios', title: 'Scenarios for Growth & Disruption Outcomes', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'scenarios' } } },

  // ── Phase 2 — AI Initiatives & Disruption Risk (slides 9–19) ───────
  { id: 'disruption-risk-exec', title: 'Phase 2: Disruption Risk — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'disruption-risk-exec' } } },
  { id: 'who-could-disrupt', title: 'Who Could Disrupt', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'who-could-disrupt' } } },
  { id: 'what-they-would-build', title: 'What the Disruptor Would Build', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-they-would-build' } } },
  { id: 'what-must-change', title: 'What Must Change for Disruption to Be True', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-must-change' } } },
  { id: 'build-it-today', title: '"Build-It-Today" Replicability (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-it-today' } } },
  { id: 'build-it-today-2', title: '"Build-It-Today" Replicability (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-it-today-2' } } },
  { id: 'ai-assessment-exec', title: 'AI Assessment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-assessment-exec' } } },
  { id: 'ai-inventory', title: 'AI Inventory (What Exists) (1 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory' } } },
  { id: 'ai-inventory-2', title: 'AI Inventory (What Exists) (2 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory-2' } } },
  { id: 'ai-inventory-3', title: 'AI Inventory (What Exists) (3 of 3)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory-3' } } },
  { id: 'architecture-readiness', title: 'Architecture Snapshot + Readiness', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'architecture-readiness' } } },
  { id: 'ai-value-framework', title: 'AI Value Framework', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-framework' } } },
  { id: 'ai-value-proof', title: 'AI Value & Proof — External Examples (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-proof' } } },
  { id: 'ai-value-proof-2', title: 'AI Value & Proof — External Examples (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-proof-2' } } },
  { id: 'internal-value-proofs', title: 'Internal Value Proofs', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-value-proofs' } } },

  // ── Phase 3 — Team, Assets & Defensibility (slides 20–29) ──────────
  { id: 'asset-value-exec', title: 'Phase 3: Underlying Asset Value — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'asset-value-exec' } } },
  { id: 'product-asset', title: 'Product Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'product-asset' } } },
  { id: 'budget-deep-dive', title: 'Budget Product Deep Dive (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'budget-deep-dive' } } },
  { id: 'budget-deep-dive-2', title: 'Budget Product Deep Dive (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'budget-deep-dive-2' } } },
  { id: 'data-asset', title: 'Data Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-asset' } } },
  { id: 'channel-asset', title: 'Channel Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'channel-asset' } } },
  { id: 'relationship-asset', title: 'Relationship Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'relationship-asset' } } },
  { id: 'team-ops-exec', title: 'Team + Operating Model — Executive Summary (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec' } } },
  { id: 'team-ops-exec-2', title: 'Team + Operating Model — Executive Summary (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec-2' } } },
  { id: 'people-roles', title: 'People & Roles', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'people-roles' } } },
  { id: 'functional-coverage', title: 'Functional Coverage & Resourcing', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'functional-coverage' } } },
  { id: 'operating-model-maturity', title: 'Operating Model Maturity', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'operating-model-maturity' } } },

  // ── Phase 4 — ROI Quantification & Synergy Roadmap (slides 30–39) ──
  { id: 'synergies-exec', title: 'Phase 4: Buyer ↔ Target Synergies — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergies-exec' } } },
  { id: 'synergy-detail', title: 'Synergy Detail (Selected Connections)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-detail' } } },
  { id: 'ctms-synergy', title: 'CTMS Synergy — Mercury as the Missing ClinSphere Module (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ctms-synergy' } } },
  { id: 'ctms-synergy-2', title: 'CTMS Synergy — Mercury as the Missing ClinSphere Module (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ctms-synergy-2' } } },
  { id: 'synergy-waves', title: 'Synergy Pathways (3 Waves)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-waves' } } },
  { id: 'internal-transformation', title: 'Internal WCG Transformation Opportunity (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-transformation' } } },
  { id: 'internal-transformation-2', title: 'Internal WCG Transformation Opportunity (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'internal-transformation-2' } } },
  { id: 'build-vs-buy', title: 'Build vs. Buy — Cost to Replicate (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-vs-buy' } } },
  { id: 'build-vs-buy-2', title: 'Build vs. Buy — Cost to Replicate (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-vs-buy-2' } } },
  { id: 'data-flywheel', title: 'WCG Data Flywheel (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-flywheel' } } },
  { id: 'data-flywheel-2', title: 'WCG Data Flywheel (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-flywheel-2' } } },
  { id: 'priority-initiatives', title: 'Priority Initiatives — Assumptions + Uplift', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'priority-initiatives' } } },
  { id: 'sensitivity', title: 'Sensitivity: Impact on Growth Curve (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity' } } },
  { id: 'sensitivity-2', title: 'Sensitivity: Impact on Growth Curve (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity-2' } } },
  { id: 'ai-quantified-impact', title: 'AI Opportunity — Quantified Impact (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact' } } },
  { id: 'ai-quantified-impact-2', title: 'AI Opportunity — Quantified Impact (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-quantified-impact-2' } } },
]

export default slides
