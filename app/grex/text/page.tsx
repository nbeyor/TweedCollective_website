import React from 'react'

import { PublicGrexFrame } from '@/components/grex/PublicGrexFrame'
import { mmsConfig } from '@/lib/grex/mms/config'
import { MMS_COPY } from '@/lib/grex/mms/copy'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'GREX by text',
  robots: { index: false, follow: false },
}

export default function GrexTextHelpPage() {
  const number = mmsConfig().displayNumber
  const smsHref = number ? `sms:${number}` : null
  return (
    <PublicGrexFrame>
      <main className="max-w-lg mx-auto px-5 py-12">
        <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--grex-muted)' }}>
          {MMS_COPY.helpKicker}
        </p>
        {number ? (
          <p
            className="mt-4 text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}
          >
            {number}
          </p>
        ) : (
          <p className="mt-4 text-[15px]" style={{ color: 'var(--grex-body)' }}>
            {MMS_COPY.helpUnpublished}
          </p>
        )}
        <ol className="mt-6 space-y-2 text-[16px] leading-relaxed" style={{ color: 'var(--grex-ink)' }}>
          {MMS_COPY.helpSteps.map((step, index) => (
            <li key={step}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>
        {smsHref && (
          <a
            href={smsHref}
            className="inline-block mt-6 px-4 py-2 text-[14px] font-medium"
            style={{
              background: 'var(--grex-accent)',
              color: 'var(--grex-accent-ink)',
              borderRadius: 'var(--grex-radius-chip)',
            }}
          >
            Add a text
          </a>
        )}
        <p className="mt-6 text-[13px] leading-relaxed" style={{ color: 'var(--grex-muted)' }}>
          {MMS_COPY.helpUsOnly} {MMS_COPY.helpSmsLink}
        </p>
      </main>
    </PublicGrexFrame>
  )
}
