import React from 'react'
import { requireClientAccess } from '@/lib/client-access'

import { NYT_TV_CLIENT_SLUG } from '@/lib/nyt-tv/access'

export default async function NytTvWatchLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess(NYT_TV_CLIENT_SLUG)
  return children
}
