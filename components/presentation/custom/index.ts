/**
 * Custom Component Registry
 *
 * Maps componentId strings (used in content files) to React components.
 * When a SlideData has type: 'custom', the SlideRenderer looks up the
 * componentId in this registry to find the rendering component.
 *
 * When adding a new document with custom slides:
 * 1. Create {DocumentName}Components.tsx in this directory
 * 2. Import and register the components below
 */

import type React from 'react'
import { TimelineSlide, AdoptionStancesDetailedSlide } from './VibeCodingComponents'
import { StageSlide, SegmentSlide } from './HealthTechComponents'
import { RegulatoryMapSlide } from './SalmonComponents'
import {
  EvaluationFrameworkSlide, ExecutiveSummarySlide, BusinessDriversSlide, AssessmentTableSlide,
  DiffusionSlide, DifferentiatingAssetsSlide, GovernanceSlide,
  RouteReagentSlide, PantheonSlide, RoadmapSlide,
  ChangeManagementSlide, QuantifyingUpsideSlide, FinalRecommendationSlide,
  ProductValueStorySlide, ProductValueStoryCompactSlide,
  ValueFrameworkSlide, SuperProductSlide,
  ValueQuantificationSlide, InternalProductivityValueSlide, ExternalRevenueSlide,
  LeadingIndicatorsSlide, RoadmapPhasedSlide,
  IonDataLakeSlide, CombinedValueWaterfallSlide,
} from './AiOpportunityComponents'
import { DiligenceChartSlide, DiligenceAssessmentGrid, DiligenceSynergySlide } from './DiligenceComponents'
import { MercuryDiligenceSlide } from './MercuryDiligenceSlides'
import { ThreeLaneSortSlide, SplitDashboardSlide, PortfolioScatterSlide, RoleAnatomySlide } from './ActionableLessonsComponents'
import { EcsSqaDeliveryModelSlide, EcsSqaRoadmapSlide } from './EcsSqaPlanComponents'
import type { CustomComponentRegistry } from '../SlideRenderer'

export const customComponentRegistry: CustomComponentRegistry = {
  // Vibe Coding document
  'TimelineSlide': TimelineSlide as React.ComponentType<Record<string, unknown>>,
  'AdoptionStancesDetailedSlide': AdoptionStancesDetailedSlide as React.ComponentType<Record<string, unknown>>,

  // Health Tech Market document
  'StageSlide': StageSlide as React.ComponentType<Record<string, unknown>>,
  'SegmentSlide': SegmentSlide as React.ComponentType<Record<string, unknown>>,

  // Salmon AI Genomics document
  'regulatory-map': RegulatoryMapSlide as React.ComponentType<Record<string, unknown>>,

  // AI Opportunity Roadmap document (MKG)
  'EvaluationFrameworkSlide': EvaluationFrameworkSlide as React.ComponentType<Record<string, unknown>>,
  'ExecutiveSummarySlide': ExecutiveSummarySlide as React.ComponentType<Record<string, unknown>>,
  'BusinessDriversSlide': BusinessDriversSlide as React.ComponentType<Record<string, unknown>>,
  'AssessmentTableSlide': AssessmentTableSlide as React.ComponentType<Record<string, unknown>>,
  'DiffusionSlide': DiffusionSlide as React.ComponentType<Record<string, unknown>>,
  'DifferentiatingAssetsSlide': DifferentiatingAssetsSlide as React.ComponentType<Record<string, unknown>>,
  'GovernanceSlide': GovernanceSlide as React.ComponentType<Record<string, unknown>>,
  'RouteReagentSlide': RouteReagentSlide as React.ComponentType<Record<string, unknown>>,
  'PantheonSlide': PantheonSlide as React.ComponentType<Record<string, unknown>>,
  'RoadmapSlide': RoadmapSlide as React.ComponentType<Record<string, unknown>>,
  'ChangeManagementSlide': ChangeManagementSlide as React.ComponentType<Record<string, unknown>>,
  'QuantifyingUpsideSlide': QuantifyingUpsideSlide as React.ComponentType<Record<string, unknown>>,
  'FinalRecommendationSlide': FinalRecommendationSlide as React.ComponentType<Record<string, unknown>>,
  'ProductValueStorySlide': ProductValueStorySlide as React.ComponentType<Record<string, unknown>>,
  'ProductValueStoryCompactSlide': ProductValueStoryCompactSlide as React.ComponentType<Record<string, unknown>>,
  'ValueFrameworkSlide': ValueFrameworkSlide as React.ComponentType<Record<string, unknown>>,
  'SuperProductSlide': SuperProductSlide as React.ComponentType<Record<string, unknown>>,
  'ValueQuantificationSlide': ValueQuantificationSlide as React.ComponentType<Record<string, unknown>>,
  'InternalProductivityValueSlide': InternalProductivityValueSlide as React.ComponentType<Record<string, unknown>>,
  'ExternalRevenueSlide': ExternalRevenueSlide as React.ComponentType<Record<string, unknown>>,
  'LeadingIndicatorsSlide': LeadingIndicatorsSlide as React.ComponentType<Record<string, unknown>>,
  'RoadmapPhasedSlide': RoadmapPhasedSlide as React.ComponentType<Record<string, unknown>>,
  'IonDataLakeSlide': IonDataLakeSlide as React.ComponentType<Record<string, unknown>>,
  'CombinedValueWaterfallSlide': CombinedValueWaterfallSlide as React.ComponentType<Record<string, unknown>>,

  // Shared diligence components (used by mercury)
  'DiligenceChartSlide': DiligenceChartSlide as React.ComponentType<Record<string, unknown>>,
  'DiligenceAssessmentGrid': DiligenceAssessmentGrid as React.ComponentType<Record<string, unknown>>,
  'DiligenceSynergySlide': DiligenceSynergySlide as React.ComponentType<Record<string, unknown>>,

  // Mercury AI Diligence document
  'MercuryDiligenceSlide': MercuryDiligenceSlide as React.ComponentType<Record<string, unknown>>,

  // Actionable Lessons in Corporate Innovation
  'ThreeLaneSortSlide': ThreeLaneSortSlide as React.ComponentType<Record<string, unknown>>,
  'SplitDashboardSlide': SplitDashboardSlide as React.ComponentType<Record<string, unknown>>,
  'PortfolioScatterSlide': PortfolioScatterSlide as React.ComponentType<Record<string, unknown>>,
  'RoleAnatomySlide': RoleAnatomySlide as React.ComponentType<Record<string, unknown>>,

  // eCS SQA Plan document
  'EcsSqaDeliveryModelSlide': EcsSqaDeliveryModelSlide as React.ComponentType<Record<string, unknown>>,
  'EcsSqaRoadmapSlide': EcsSqaRoadmapSlide as React.ComponentType<Record<string, unknown>>,
}

export default customComponentRegistry
