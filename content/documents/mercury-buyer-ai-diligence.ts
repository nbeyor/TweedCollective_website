/**
 * Mercury: AI Diligence — Buyer Acquisition Analysis
 *
 * Content file for the Mercury due diligence document.
 * Each slide uses type: 'custom' with componentId: 'MercuryDiligenceSlide',
 * which renders via the MercuryDiligenceSlides component.
 *
 * The slide data (text, metrics, charts) is co-located with the rendering
 * component for now due to the complexity of the 32-slide document.
 * Future refactor: progressively extract text/data into this file's props.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'mercury-buyer-ai-diligence'

export const slides: SlideData[] = [
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
  { id: 'executive-summary', title: 'Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'executive-summary' } } },
  { id: 'growth-thesis-exec', title: 'Growth Thesis Alignment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-thesis-exec' } } },
  { id: 'growth-projections', title: 'Growth Projections — Snapshot + Assumptions', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'growth-projections' } } },
  { id: 'offering-ai-growth-matrix', title: 'Offering + AI Initiatives ↔ Growth Drivers', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'offering-ai-growth-matrix' } } },
  { id: 'ai-roadmap-fit', title: 'AI Roadmap Fit to Growth Thesis', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-roadmap-fit' } } },
  { id: 'scenarios', title: 'Scenarios for Growth & Disruption Outcomes', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'scenarios' } } },
  { id: 'disruption-risk-exec', title: 'Disruption Risk — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'disruption-risk-exec' } } },
  { id: 'who-could-disrupt', title: 'Who Could Disrupt', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'who-could-disrupt' } } },
  { id: 'what-they-would-build', title: 'What the Disruptor Would Build', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-they-would-build' } } },
  { id: 'what-must-change', title: 'What Must Change for Disruption to Be True', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'what-must-change' } } },
  { id: 'build-it-today', title: '"Build-It-Today" Replicability', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'build-it-today' } } },
  { id: 'asset-value-exec', title: 'Underlying Asset Value — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'asset-value-exec' } } },
  { id: 'product-asset', title: 'Product Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'product-asset' } } },
  { id: 'data-asset', title: 'Data Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'data-asset' } } },
  { id: 'channel-asset', title: 'Channel Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'channel-asset' } } },
  { id: 'relationship-asset', title: 'Relationship Asset Strength', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'relationship-asset' } } },
  { id: 'team-ops-exec', title: 'Team + Operating Model — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'team-ops-exec' } } },
  { id: 'people-roles', title: 'People & Roles', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'people-roles' } } },
  { id: 'functional-coverage', title: 'Functional Coverage & Resourcing', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'functional-coverage' } } },
  { id: 'operating-model-maturity', title: 'Operating Model Maturity', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'operating-model-maturity' } } },
  { id: 'ai-assessment-exec', title: 'AI Assessment — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-assessment-exec' } } },
  { id: 'ai-inventory', title: 'AI Inventory (What Exists)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-inventory' } } },
  { id: 'architecture-readiness', title: 'Architecture Snapshot + Readiness', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'architecture-readiness' } } },
  { id: 'ai-value-framework', title: 'AI Value Framework', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-framework' } } },
  { id: 'ai-value-proof', title: 'AI Value & Proof — Examples', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'ai-value-proof' } } },
  { id: 'synergies-exec', title: 'Buyer ↔ Target Synergies — Executive Summary', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergies-exec' } } },
  { id: 'synergy-matrix', title: 'Synergy Connections Mapped to Assets', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-matrix' } } },
  { id: 'synergy-detail', title: 'Synergy Detail (Selected Connections)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-detail' } } },
  { id: 'synergy-waves', title: 'Synergy Pathways (3 Waves)', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'synergy-waves' } } },
  { id: 'priority-initiatives', title: 'Priority Initiatives — Assumptions + Uplift', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'priority-initiatives' } } },
  { id: 'sensitivity', title: 'Sensitivity: Impact on Growth Curve', type: 'custom', content: { type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'sensitivity' } } },
]

export default slides
