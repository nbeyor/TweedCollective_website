'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, LayoutTemplate } from 'lucide-react'

import {
  CUSTOM_OUTLINE_MAX,
  CUSTOM_TEMPLATE_KEY,
  OUTPUT_TEMPLATES,
  templateByKey,
} from '@/lib/strategistTemplates'
import { wcg } from './wcgTheme'

/**
 * Output template picker — flexible outputs as an input document. The team
 * chooses the shape their organization needs (or pastes their own outline)
 * and Publish writes the session's grounded content into that structure.
 */
export function OutputTemplatePanel({
  templateKey,
  customOutline,
  onChange,
}: {
  templateKey: string
  customOutline: string
  onChange: (key: string, customOutline: string) => void
}) {
  const [open, setOpen] = useState(false)
  const active = templateByKey(templateKey)

  return (
    <div className="px-4 pb-4">
      <div className="rounded-lg border" style={{ background: wcg.surface, borderColor: wcg.border }}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
        >
          <LayoutTemplate className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: wcg.amber }} />
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold leading-snug" style={{ color: wcg.ink }}>
              Output template
            </span>
            <span className="block text-[10.5px] leading-snug truncate" style={{ color: wcg.muted }}>
              {active.label}
            </span>
          </span>
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform"
            style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
          />
        </button>

        {open && (
          <div className="border-t px-2 pb-2.5 pt-2 space-y-1" style={{ borderColor: wcg.border }}>
            <p className="text-[11px] leading-snug px-0.5 pb-0.5" style={{ color: wcg.muted }}>
              What Publish produces. Same grounded content, in the shape your organization needs.
            </p>
            {OUTPUT_TEMPLATES.map((t) => {
              const selected = t.key === active.key
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key, customOutline)}
                  className="w-full text-left rounded-md border px-2.5 py-1.5 transition-colors"
                  style={{
                    background: selected ? '#ECFBF6' : wcg.surfaceMuted,
                    borderColor: selected ? wcg.teal : wcg.border,
                  }}
                >
                  <span className="flex items-start gap-2">
                    {selected ? (
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.teal }} />
                    ) : (
                      <span className="w-3.5 shrink-0" />
                    )}
                    <span className="min-w-0">
                      <span className="block text-[12px] font-medium leading-snug" style={{ color: wcg.ink }}>
                        {t.label}
                      </span>
                      <span className="block text-[10.5px] mt-0.5 leading-snug" style={{ color: wcg.muted }}>
                        {t.description}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
            {active.key === CUSTOM_TEMPLATE_KEY && (
              <textarea
                value={customOutline}
                onChange={(e) => onChange(active.key, e.target.value.slice(0, CUSTOM_OUTLINE_MAX))}
                rows={6}
                placeholder={
                  'Paste your template or section list, e.g.\n1. Executive summary\n2. Study design\n3. Budget & timeline\n4. Risks'
                }
                className="w-full rounded-md border px-2.5 py-2 text-[12px] leading-snug resize-y focus:outline-none"
                style={{ background: wcg.surfaceMuted, borderColor: wcg.borderStrong, color: wcg.ink }}
                aria-label="Custom output template"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
