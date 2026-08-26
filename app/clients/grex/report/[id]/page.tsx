import React from 'react'

import { ExplanationView } from '@/components/grex/ExplanationView'
import { GREX_BRAND } from '@/lib/grex/brand'
import { getScenario } from '@/lib/grex/scenarios'

export const metadata = {
  title: `${GREX_BRAND.name} — Report`,
}

/**
 * The shared explanation page. Canned scenario ids resolve server-side;
 * anything else (live-run ids) resolves client-side from sessionStorage,
 * with a graceful expiry state for dead deep links.
 */
export default function GrexReportPage({ params }: { params: { id: string } }) {
  const scenario = getScenario(params.id)
  if (scenario) {
    return <ExplanationView result={scenario.result} />
  }
  return <ExplanationView lookupId={params.id} />
}
