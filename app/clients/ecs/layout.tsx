import React from 'react'
import { requireClientAccess } from '@/lib/client-access'

export default async function EcsLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess('ecs')
  return <>{children}</>
}
