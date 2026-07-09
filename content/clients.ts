/**
 * Client workspace registry
 *
 * Each client gets a slug, a display name, and a list of deliverables.
 * Deliverables point at dashboards under /clients/[slug]/ or gated
 * documents under /insights/[documentId].
 *
 * To add a client:
 * 1. Add a ClientConfig entry below
 * 2. Grant users access via Clerk public metadata: { "clientSlugs": ["slug"] }
 */

export interface ClientDeliverable {
  title: string
  description?: string
  href: string
  kind: 'dashboard' | 'document'
  date?: string // YYYY-MM
}

export interface ClientConfig {
  slug: string
  name: string
  deliverables: ClientDeliverable[]
}

export const CLIENT_CONFIGS: ClientConfig[] = [
  {
    slug: 'ecs',
    name: 'eCS',
    deliverables: [
      {
        title: 'SDLC Dashboard',
        description: 'Copilot adoption and team productivity against the pre-AI baseline.',
        href: '/clients/ecs/sdlc-dashboard',
        kind: 'dashboard',
        date: '2026-03',
      },
      {
        title: 'AI-Enabled Product, Development, and SQA Transformation',
        description: 'Target operating model, KPI system, and dual-track roadmap.',
        href: '/insights/ecs-sqa-plan',
        kind: 'document',
        date: '2026-04',
      },
    ],
  },
  // Additional clients land here as slugs are assigned, for example:
  // mercury-buyer-ai-diligence, ai-opportunity-roadmap (MKG),
  // salmon-ai-genomics, ai-adoption-by-function-health-tech
]

export function getClientConfig(slug: string): ClientConfig | undefined {
  return CLIENT_CONFIGS.find((client) => client.slug === slug)
}
