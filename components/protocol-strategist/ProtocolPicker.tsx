'use client'

import React, { useMemo, useState } from 'react'
import { Check, ChevronDown, FilePlus2, FileUp } from 'lucide-react'

import type { ProtocolIndexEntry } from '@/lib/trialCorpus'
import { sourceKey, type BriefSource } from '@/lib/strategistSource'
import { DocDropZone } from './DocDropZone'
import { wcg } from './wcgTheme'

export type { BriefSource }
export { sourceKey }

/**
 * Document selector: upload a .docx, pick a corpus protocol, or start blank.
 * The three Google-Doc starters are no longer listed — an uploaded working
 * copy lives only in this session and is not shown in anyone else's picker.
 */
export function ProtocolPicker({
  source,
  currentLabel,
  protocols,
  onSelect,
  onUpload,
  uploading,
  uploadError,
}: {
  source: BriefSource
  currentLabel: string
  protocols: ProtocolIndexEntry[]
  onSelect: (next: BriefSource) => void
  onUpload: (file: File) => void
  uploading?: boolean
  uploadError?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return protocols
    return protocols.filter((p) =>
      `${p.protocol_id} ${p.indication} ${p.therapeutic_area} ${p.disease_area} ${p.phase}`
        .toLowerCase()
        .includes(q)
    )
  }, [protocols, filter])

  const pick = (next: BriefSource) => {
    setOpen(false)
    onSelect(next)
  }

  const active = sourceKey(source)

  return (
    <div className="rounded-lg border" style={{ background: wcg.surfaceMuted, borderColor: wcg.border }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block text-[10.5px] uppercase tracking-[0.14em]" style={{ color: wcg.muted }}>
            Document under review
          </span>
          <span className="block text-[12.5px] font-medium truncate" style={{ color: wcg.ink }}>
            {currentLabel}
          </span>
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform"
          style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {open && (
        <div className="border-t px-2 py-2 space-y-2" style={{ borderColor: wcg.border }}>
          <DocDropZone compact uploading={uploading} error={uploadError} onFile={onUpload} />

          {source.kind === 'upload' && (
            <Option
              icon={<FileUp className="w-3.5 h-3.5" style={{ color: wcg.teal }} />}
              label={currentLabel}
              note="Your working copy — not listed for anyone else"
              selected={active.startsWith('upload:')}
              onClick={() => setOpen(false)}
            />
          )}

          <div>
            <p className="px-1.5 pb-1 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: wcg.muted }}>
              Protocol repository ({protocols.length})
            </p>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by indication, phase, or ID…"
              className="w-full rounded-md border px-2.5 py-1.5 mb-1 text-[12px] focus:outline-none"
              style={{ background: wcg.surface, borderColor: wcg.borderStrong, color: wcg.ink }}
            />
            <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
              {filtered.slice(0, 60).map((p) => (
                <Option
                  key={p.protocol_id}
                  label={`${p.indication} — ${p.protocol_id}`}
                  note={`${p.therapeutic_area} · Phase ${p.phase} · N=${p.number_of_participants} · ${p.sites_initiated} sites`}
                  selected={active === `corpus:${p.protocol_id}`}
                  onClick={() => pick({ kind: 'corpus', protocolId: p.protocol_id })}
                />
              ))}
              {filtered.length > 60 && (
                <p className="px-1.5 py-1 text-[11px]" style={{ color: wcg.faint }}>
                  {filtered.length - 60} more — narrow the filter.
                </p>
              )}
              {!filtered.length && (
                <p className="px-1.5 py-1 text-[11px]" style={{ color: wcg.faint }}>
                  No protocols match.
                </p>
              )}
            </div>
          </div>

          <Option
            icon={<FilePlus2 className="w-3.5 h-3.5" style={{ color: wcg.blue }} />}
            label="Start blank (corpus only)"
            note="No draft — build the protocol from the data up"
            selected={active === 'blank'}
            onClick={() => pick({ kind: 'blank' })}
          />
        </div>
      )}
    </div>
  )
}

function Option({
  icon,
  label,
  note,
  selected,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  note?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors"
      style={{
        background: selected ? '#ECFBF6' : wcg.surface,
        borderColor: selected ? wcg.teal : wcg.border,
      }}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] leading-snug font-medium truncate" style={{ color: wcg.ink }}>
          {label}
        </span>
        {note && (
          <span className="block text-[10.5px] leading-snug" style={{ color: wcg.muted }}>
            {note}
          </span>
        )}
      </span>
      {selected && <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: wcg.teal }} />}
    </button>
  )
}
