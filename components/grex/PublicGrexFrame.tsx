import React from 'react'
import { Space_Grotesk } from 'next/font/google'

import { GREX_THEME, themeVars } from '@/lib/grex/theme'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--grex-font-grotesk',
  display: 'swap',
})

/** Public GREX chrome. No client-workspace gate and no marketing header. */
export function PublicGrexFrame({ children }: { children: React.ReactNode }) {
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
