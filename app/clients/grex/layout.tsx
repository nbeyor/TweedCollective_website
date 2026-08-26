import React from 'react'
import { Space_Grotesk } from 'next/font/google'

import { requireClientAccess } from '@/lib/client-access'
import { GREX_THEME, themeVars } from '@/lib/grex/theme'

// GREX's display face (Inter + JetBrains Mono are already global).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--grex-font-grotesk',
  display: 'swap',
})

export default async function GrexLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess('grex')
  return (
    <div
      className={spaceGrotesk.variable}
      style={{
        ...themeVars(GREX_THEME),
        background: 'var(--grex-page)',
        color: 'var(--grex-body)',
        fontFamily: 'var(--grex-font-body)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}
