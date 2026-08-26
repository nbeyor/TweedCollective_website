import React from 'react'
import { Fraunces, Space_Grotesk } from 'next/font/google'

import { requireClientAccess } from '@/lib/client-access'
import { GREX_THEME, themeVars } from '@/lib/grex/theme'

// Brand-direction fonts (Inter + JetBrains Mono are already global). All
// directions' faces load here so the brand page renders each faithfully.
const fraunces = Fraunces({ subsets: ['latin'], variable: '--grex-font-serif', display: 'swap' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--grex-font-grotesk',
  display: 'swap',
})

export default async function GrexLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess('grex')
  return (
    <div
      className={`${fraunces.variable} ${spaceGrotesk.variable}`}
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
