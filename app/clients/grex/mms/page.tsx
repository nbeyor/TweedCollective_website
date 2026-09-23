import React from 'react'

import { mmsEnvStatus } from '@/lib/grex/mms/config'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'GREX MMS',
}

export default function GrexMmsOperatorPage() {
  const rows = mmsEnvStatus()
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--grex-muted)' }}>
        Operator
      </p>
      <h1 className="mt-2 text-3xl font-semibold" style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}>
        GREX by text
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
        The phone webhook and the report link are public. This page stays inside the client workspace. Spec: docs/grex-mms-v1-spec.md.
      </p>
      <dl className="mt-6 text-[14px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
        <div className="mt-2">
          <dt className="font-medium" style={{ color: 'var(--grex-ink)' }}>Webhook</dt>
          <dd>POST /api/grex/mms/webhook</dd>
        </div>
        <div className="mt-2">
          <dt className="font-medium" style={{ color: 'var(--grex-ink)' }}>Report</dt>
          <dd>/r/&lt;32-hex-id&gt;</dd>
        </div>
        <div className="mt-2">
          <dt className="font-medium" style={{ color: 'var(--grex-ink)' }}>Help page</dt>
          <dd>/grex/text</dd>
        </div>
        <div className="mt-2">
          <dt className="font-medium" style={{ color: 'var(--grex-ink)' }}>Dry run</dt>
          <dd>POST /api/grex/mms/dry-run with mode fixture or transcript</dd>
        </div>
      </dl>
      <h2 className="mt-10 text-[12px] uppercase tracking-[0.14em]" style={{ color: 'var(--grex-muted)' }}>
        Environment
      </h2>
      <ul className="mt-3 space-y-3">
        {rows.map((row) => (
          <li
            key={row.name}
            className="p-3"
            style={{
              background: 'var(--grex-surface)',
              border: `1px solid ${row.alarm ? 'var(--grex-contradicted)' : 'var(--grex-border)'}`,
              borderRadius: 'var(--grex-radius-card)',
            }}
          >
            <p className="text-[13px] font-medium" style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-mono)' }}>
              {row.name}{' '}
              <span style={{ color: row.alarm ? 'var(--grex-contradicted)' : 'var(--grex-muted)' }}>
                {row.requirement === 'unset' ? (row.configured ? 'set' : 'unset') : row.configured ? 'set' : 'missing'}
              </span>
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
              {row.purpose}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
