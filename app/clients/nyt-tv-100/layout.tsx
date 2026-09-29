import React from 'react'
import { requireClientAccess } from '@/lib/client-access'

export default async function NytTvLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess('nyt-tv-100')
  return <>{children}</>
}
