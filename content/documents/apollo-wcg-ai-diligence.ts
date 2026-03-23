/**
 * Apollo: AI Diligence — Buyer Acquisition Analysis
 *
 * Content file for the Apollo due diligence document.
 * Each slide uses type: 'custom' with componentId: 'ApolloDiligenceSlide',
 * which renders via the ApolloDiligenceSlides component.
 *
 * The slide data (text, metrics, charts) is co-located with the rendering
 * component for now due to the complexity of the document.
 *
 * SLIDE SIZING RULE: Each slide must fit within letter landscape
 * (10in × 7.5in, ~6in usable content height after header).
 * If content exceeds this, split into multiple slides with
 * "(1 of N)" / "(2 of N)" title suffixes.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'apollo-wcg-ai-diligence'

export const slides: SlideData[] = [
  // Front Matter (slides 1–3)
  {
    id: 'cover',
    title: 'Cover',
    type: 'title',
    content: {
      type: 'title',
      badge: 'AI Due Diligence',
      headline: 'Apollo: AI Diligence',
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
  { id: 'framework-overview', title: 'How We Evaluated Apollo\'s AI Portfolio', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'framework-overview' } } },
  { id: 'executive-summary', title: 'Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'executive-summary' } } },

  // Phase 1 — Business Value & Growth Thesis
  { id: 'growth-thesis-exec-1', title: 'Growth Thesis Alignment — Executive Summary (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'growth-thesis-exec-1' } } },
  { id: 'growth-thesis-exec-2', title: 'Growth Thesis Alignment — Executive Summary (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'growth-thesis-exec-2' } } },
  { id: 'growth-projections-1', title: 'Growth Projections — Snapshot + Assumptions (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'growth-projections-1' } } },
  { id: 'growth-projections-2', title: 'Growth Projections — Snapshot + Assumptions (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'growth-projections-2' } } },
  { id: 'offering-ai-growth-matrix-1', title: 'Offering + AI Initiatives ↔ Growth Drivers (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix-1' } } },
  { id: 'offering-ai-growth-matrix-2', title: 'Offering + AI Initiatives ↔ Growth Drivers (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix-2' } } },
  { id: 'ai-roadmap-fit', title: 'AI Roadmap Fit to Growth Thesis', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-roadmap-fit' } } },
  { id: 'scenarios', title: 'Scenarios for Growth & Disruption Outcomes', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'scenarios' } } },

  // Phase 2 — AI Initiatives & Disruption Risk
  { id: 'disruption-risk-exec', title: 'Phase 2: Disruption Risk — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'disruption-risk-exec' } } },
  { id: 'who-could-disrupt', title: 'Who Could Disrupt', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'who-could-disrupt' } } },
  { id: 'what-they-would-build', title: 'What the Disruptor Would Build', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'what-they-would-build' } } },
  { id: 'what-must-change', title: 'What Must Change for Disruption to Be True', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'what-must-change' } } },
  { id: 'build-it-today', title: '"Build-It-Today" Replicability', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'build-it-today' } } },
  { id: 'dd-veeva-consolidation-1', title: 'Veeva — Long-Term Platform Consolidation Threat (1 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-veeva-consolidation-1' } } },
  { id: 'dd-veeva-consolidation-2', title: 'Veeva — Long-Term Platform Consolidation Threat (2 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-veeva-consolidation-2' } } },
  { id: 'dd-veeva-consolidation-3', title: 'Veeva — Long-Term Platform Consolidation Threat (3 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-veeva-consolidation-3' } } },
  { id: 'dd-econsent-landscape-1', title: 'eICF & eConsent — Competitive Landscape (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-econsent-landscape-1' } } },
  { id: 'dd-econsent-landscape-2', title: 'eICF & eConsent — Competitive Landscape (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-econsent-landscape-2' } } },
  { id: 'ai-assessment-exec', title: 'AI Assessment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-assessment-exec' } } },
  { id: 'ai-inventory-1', title: 'AI Inventory — What Exists (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-inventory-1' } } },
  { id: 'ai-inventory-2', title: 'AI Inventory — What Exists (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-inventory-2' } } },
  { id: 'architecture-readiness-1', title: 'Architecture Snapshot + Readiness (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'architecture-readiness-1' } } },
  { id: 'architecture-readiness-2', title: 'Architecture Snapshot + Readiness (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'architecture-readiness-2' } } },
  { id: 'ai-value-framework', title: 'AI Value Framework', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-value-framework' } } },
  { id: 'ai-value-proof', title: 'AI Value & Proof — Examples', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-value-proof' } } },

  // Phase 3 — Team, Assets & Defensibility
  { id: 'asset-value-exec', title: 'Phase 3: Underlying Asset Value — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'asset-value-exec' } } },
  { id: 'product-asset', title: 'Product Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'product-asset' } } },
  { id: 'data-asset', title: 'Data Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'data-asset' } } },
  { id: 'channel-asset', title: 'Channel Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'channel-asset' } } },
  { id: 'relationship-asset', title: 'Relationship Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'relationship-asset' } } },
  { id: 'team-ops-exec', title: 'Team + Operating Model — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'team-ops-exec' } } },
  { id: 'people-roles-1', title: 'People & Roles (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'people-roles-1' } } },
  { id: 'people-roles-2', title: 'People & Roles (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'people-roles-2' } } },
  { id: 'functional-coverage-1', title: 'Functional Coverage & Resourcing (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'functional-coverage-1' } } },
  { id: 'functional-coverage-2', title: 'Functional Coverage & Resourcing (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'functional-coverage-2' } } },
  { id: 'operating-model-maturity-1', title: 'Operating Model Maturity (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'operating-model-maturity-1' } } },
  { id: 'operating-model-maturity-2', title: 'Operating Model Maturity (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'operating-model-maturity-2' } } },
  { id: 'dd-data-rights-1', title: 'Data Rights — Content vs. Metadata (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-data-rights-1' } } },
  { id: 'dd-data-rights-2', title: 'Data Rights — Content vs. Metadata (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-data-rights-2' } } },
  { id: 'dd-data-architecture-1', title: 'Data Architecture Gap Assessment & Modernization Cost (1 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-data-architecture-1' } } },
  { id: 'dd-data-architecture-2', title: 'Data Architecture Gap Assessment & Modernization Cost (2 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-data-architecture-2' } } },
  { id: 'dd-data-architecture-3', title: 'Data Architecture Gap Assessment & Modernization Cost (3 of 3)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'dd-data-architecture-3' } } },

  // Phase 4 — ROI Quantification & Synergy Roadmap
  { id: 'synergies-exec', title: 'Phase 4: Buyer ↔ Target Synergies — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergies-exec' } } },
  { id: 'synergy-matrix-1', title: 'Synergy Connections Mapped to Assets (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-matrix-1' } } },
  { id: 'synergy-matrix-2', title: 'Synergy Connections Mapped to Assets (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-matrix-2' } } },
  { id: 'synergy-detail-1', title: 'Synergy Detail — Selected Connections (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-detail-1' } } },
  { id: 'synergy-detail-2', title: 'Synergy Detail — Selected Connections (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-detail-2' } } },
  { id: 'synergy-waves-1', title: 'Synergy Pathways — 3 Waves (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-waves-1' } } },
  { id: 'synergy-waves-2', title: 'Synergy Pathways — 3 Waves (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'synergy-waves-2' } } },
  { id: 'priority-initiatives-1', title: 'Priority Initiatives — Assumptions + Uplift (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'priority-initiatives-1' } } },
  { id: 'priority-initiatives-2', title: 'Priority Initiatives — Assumptions + Uplift (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'priority-initiatives-2' } } },
  { id: 'sensitivity-1', title: 'Sensitivity: Impact on Growth Curve (1 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'sensitivity-1' } } },
  { id: 'sensitivity-2', title: 'Sensitivity: Impact on Growth Curve (2 of 2)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'sensitivity-2' } } },
  { id: 'ai-impact-summary-1', title: 'AI Opportunity — Quantified Impact (1 of 4)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-impact-summary-1' } } },
  { id: 'ai-impact-summary-2', title: 'AI Opportunity — Quantified Impact (2 of 4)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-impact-summary-2' } } },
  { id: 'ai-impact-summary-3', title: 'AI Opportunity — Quantified Impact (3 of 4)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-impact-summary-3' } } },
  { id: 'ai-impact-summary-4', title: 'AI Opportunity — Quantified Impact (4 of 4)', type: 'custom', content: { type: 'custom', componentId: 'ApolloDiligenceSlide', props: { slideId: 'ai-impact-summary-4' } } },
]

export default slides
