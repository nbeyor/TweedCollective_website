import React from 'react'
import { requireClientAccess } from '@/lib/client-access'

export default async function ProtocolAuthoringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireClientAccess('protocol-authoring')
  return <>{children}</>
}
