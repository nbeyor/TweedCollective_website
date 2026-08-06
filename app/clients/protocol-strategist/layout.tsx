import React from 'react'
import { requireClientAccess } from '@/lib/client-access'

export default async function ProtocolStrategistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireClientAccess('protocol-strategist')
  return <>{children}</>
}
