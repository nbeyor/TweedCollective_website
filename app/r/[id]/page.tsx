import React from 'react'

import { PublicGrexFrame } from '@/components/grex/PublicGrexFrame'
import { MmsReportUnavailable, MmsReportView } from '@/components/grex/mms/MmsReportView'
import { getStore } from '@/lib/grex/mms/store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'GREX evidence report',
  robots: { index: false, follow: false },
}

export default async function PublicReportPage({ params }: { params: { id: string } }) {
  const report = isReportId(params.id) ? await getStore().getReport(params.id) : null
  return <PublicGrexFrame>{report ? <MmsReportView report={report} /> : <MmsReportUnavailable />}</PublicGrexFrame>
}

function isReportId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id)
}
