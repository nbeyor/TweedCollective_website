'use client'

import React, { useCallback, useRef, useState } from 'react'
import { FileUp, Loader2 } from 'lucide-react'

import { wcg } from './wcgTheme'

const ACCEPT = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function DocDropZone({
  onFile,
  uploading,
  compact,
  error,
}: {
  onFile: (file: File) => void
  uploading?: boolean
  compact?: boolean
  error?: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const take = useCallback(
    (file: File | undefined) => {
      if (!file || uploading) return
      onFile(file)
    },
    [onFile, uploading]
  )

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          take(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          take(e.dataTransfer.files?.[0])
        }}
        className="w-full rounded-lg border border-dashed text-left transition-colors disabled:opacity-60"
        style={{
          background: over ? '#ECFBF6' : wcg.surface,
          borderColor: over ? wcg.teal : wcg.borderStrong,
          padding: compact ? '10px 12px' : '18px 14px',
        }}
      >
        <span className="flex items-start gap-2.5">
          {uploading ? (
            <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin" style={{ color: wcg.teal }} />
          ) : (
            <FileUp className="w-4 h-4 mt-0.5 shrink-0" style={{ color: wcg.teal }} />
          )}
          <span className="min-w-0">
            <span className="block text-[12.5px] font-medium leading-snug" style={{ color: wcg.ink }}>
              {uploading ? 'Extracting the brief…' : 'Drop a .docx design brief'}
            </span>
            <span className="block text-[11px] leading-snug mt-0.5" style={{ color: wcg.muted }}>
              {uploading
                ? 'Parsing in memory, then a one-shot extract. Your file is not overwritten.'
                : compact
                  ? 'Click to browse · .docx only · 4 MB cap'
                  : 'Or click to browse. Word .docx only, up to 4 MB. We create a new Google Doc as the working copy and share it with you — the file you dropped is left untouched.'}
            </span>
          </span>
        </span>
      </button>
      {error && (
        <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: wcg.bad }}>
          {error}
        </p>
      )}
    </div>
  )
}
