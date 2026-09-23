import React from 'react'

import {
  collapseChip,
  DOMAIN_KIND_LABELS,
  DOMAIN_KIND_VAR,
  type ClaimCollapse,
  type CollapseMention,
  type CollapseViz,
} from '@/lib/grex/collapse'
import { MMS_COPY } from '@/lib/grex/mms/copy'

const DRAW_CAP = 8

export function CollapseSection({
  collapse,
  claims,
}: {
  collapse: CollapseViz
  claims: Array<{ id: string; text: string }>
}) {
  const textFor = new Map(claims.map((claim) => [claim.id, claim.text]))
  return (
    <section className="mt-10">
      <h2 className="text-[18px] font-semibold" style={{ color: 'var(--grex-ink)', fontFamily: 'var(--grex-font-display)' }}>
        {MMS_COPY.collapseHeading}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--grex-body)' }}>
        {collapse.caption}
      </p>
      {collapse.claims.length === 0 ? (
        <p className="mt-4 text-[13.5px]" style={{ color: 'var(--grex-muted)' }}>
          {MMS_COPY.collapseNoClaims}
        </p>
      ) : (
        <div className="mt-5 space-y-6">
          {collapse.claims.map((claim) => (
            <ClaimCollapseBlock key={claim.claimId} claim={claim} claimText={textFor.get(claim.claimId) || claim.query} />
          ))}
        </div>
      )}
    </section>
  )
}

function ClaimCollapseBlock({ claim, claimText }: { claim: ClaimCollapse; claimText: string }) {
  const hidden = Math.max(0, claim.retrievedCount - DRAW_CAP)
  return (
    <div
      className="p-4"
      style={{
        background: 'var(--grex-surface)',
        border: '1px solid var(--grex-border)',
        borderRadius: 'var(--grex-radius-card)',
      }}
    >
      <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--grex-ink)' }}>
        “{claimText}”
      </p>
      {claim.retrievedCount > 0 && (
        <p
          className="inline-block mt-3 px-2 py-0.5 text-[12px]"
          style={{
            border: '1px solid var(--grex-border)',
            borderRadius: 'var(--grex-radius-chip)',
            color: 'var(--grex-ink)',
            fontFamily: 'var(--grex-font-mono)',
          }}
        >
          {collapseChip(claim.retrievedCount, claim.clusterCount, hidden)}
        </p>
      )}
      {claim.mentions.length === 0 ? (
        <p className="mt-3 text-[13px]" style={{ color: 'var(--grex-muted)' }}>
          {MMS_COPY.collapseNoHits}
        </p>
      ) : claim.mentions.length === 1 ? (
        <div className="mt-3">
          <MentionCard mention={claim.mentions[0]} dashed={false} root />
          <p className="mt-2 text-[13px]" style={{ color: 'var(--grex-body)' }}>
            {MMS_COPY.collapseOnePage}
          </p>
        </div>
      ) : (
        <Funnel claim={claim} />
      )}
      <Histogram claim={claim} />
      {claim.query && (
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: 'var(--grex-muted)' }}>
          {MMS_COPY.searchedPrefix}: “{claim.query}”
        </p>
      )}
    </div>
  )
}

function Funnel({ claim }: { claim: ClaimCollapse }) {
  const byId = new Map(claim.mentions.map((mention) => [mention.id, mention]))
  const drawIds = new Set(claim.mentions.slice(0, DRAW_CAP).map((mention) => mention.id))
  const columns = claim.clusters
    .map((cluster) => ({
      cluster,
      leaves: cluster.mentionIds.map((id) => byId.get(id)).filter((mention): mention is CollapseMention => Boolean(mention && drawIds.has(mention.id))),
      root: cluster.rootMentionId ? byId.get(cluster.rootMentionId) ?? null : null,
    }))
    .filter((column) => column.leaves.length > 0)

  const width = 360
  const height = 248
  const pad = 8
  const slot = columns.length > 0 ? (width - pad * 2) / columns.length : width
  const leafW = Math.min(108, Math.max(72, slot - 16))
  const rootW = Math.min(120, Math.max(80, slot - 12))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full" role="img" aria-label={MMS_COPY.collapseHeading} style={{ height: 248 }}>
      {columns.map((column, index) => {
        const cx = pad + slot * index + slot / 2
        const rootY = 168
        const rootX = cx - rootW / 2
        const undated = !column.cluster.rootMentionId
        return (
          <g key={column.cluster.id}>
            {column.leaves.map((leaf, leafIndex) => {
              const x = cx - leafW / 2 + leafIndex * 4
              const y = 8 + leafIndex * 3
              const leafBottom = y + 36
              return (
                <g key={leaf.id}>
                  <line x1={x + leafW / 2} y1={leafBottom} x2={cx} y2={rootY} stroke="var(--grex-border)" strokeWidth="1" />
                  <Leaf x={x} y={y} width={leafW} mention={leaf} />
                </g>
              )
            })}
            <RootCard
              x={rootX}
              y={rootY}
              width={rootW}
              mention={column.root ?? column.leaves[0] ?? null}
              undated={undated}
            />
          </g>
        )
      })}
    </svg>
  )
}

function Leaf({ x, y, width, mention }: { x: number; y: number; width: number; mention: CollapseMention }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={36} rx={6} fill="var(--grex-surface)" stroke="var(--grex-border)" />
      <rect x={x} y={y} width={4} height={36} rx={2} fill={DOMAIN_KIND_VAR[mention.domainKind]} />
      <text x={x + 10} y={y + 15} fill="var(--grex-ink)" fontSize="10">
        {clip(mention.domain, 16)}
      </text>
      <text x={x + 10} y={y + 28} fill="var(--grex-muted)" fontSize="9">
        {clip(mention.title || mention.domain, 18)}
      </text>
    </g>
  )
}

function RootCard({
  x,
  y,
  width,
  mention,
  undated,
}: {
  x: number
  y: number
  width: number
  mention: CollapseMention | null
  undated: boolean
}) {
  const kind = mention ? DOMAIN_KIND_LABELS[mention.domainKind] : ''
  const dateLine = undated || !mention?.observedDate ? MMS_COPY.noDate : `${MMS_COPY.earliestPrefix} · ${mention.observedDate}`
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={68}
        rx={6}
        fill="var(--grex-surface-raised)"
        stroke={undated ? 'var(--grex-muted)' : 'var(--grex-accent)'}
        strokeDasharray={undated ? '4 3' : undefined}
      />
      <text x={x + 8} y={y + 14} fill="var(--grex-ink)" fontSize="10">
        {clip(mention?.domain || '', 18)}
      </text>
      <text x={x + 8} y={y + 28} fill="var(--grex-muted)" fontSize="9">
        {clip(kind, 22)}
      </text>
      <text x={x + 8} y={y + 44} fill="var(--grex-body)" fontSize="8">
        {undated || !mention?.observedDate ? MMS_COPY.noDate : MMS_COPY.earliestPrefix}
      </text>
      {!undated && mention?.observedDate ? (
        <text x={x + 8} y={y + 58} fill="var(--grex-ink)" fontSize="10">
          {mention.observedDate}
        </text>
      ) : null}
      <title>{dateLine}</title>
    </g>
  )
}

function MentionCard({ mention, dashed, root }: { mention: CollapseMention; dashed: boolean; root?: boolean }) {
  return (
    <div
      className="p-3"
      style={{
        border: `1px ${dashed ? 'dashed' : 'solid'} var(--grex-border)`,
        borderLeft: `4px solid ${DOMAIN_KIND_VAR[mention.domainKind]}`,
        borderRadius: 'var(--grex-radius-chip)',
      }}
    >
      <p className="text-[13px] font-medium" style={{ color: 'var(--grex-ink)' }}>
        {mention.domain}
      </p>
      <p className="text-[12px]" style={{ color: 'var(--grex-muted)' }}>
        {DOMAIN_KIND_LABELS[mention.domainKind]}
        {root && mention.observedDate ? ` · ${MMS_COPY.earliestPrefix} · ${mention.observedDate}` : ''}
        {root && !mention.observedDate ? ` · ${MMS_COPY.noDate}` : ''}
      </p>
      {mention.title && (
        <p className="text-[12.5px] mt-1" style={{ color: 'var(--grex-body)' }}>
          {mention.title}
        </p>
      )}
    </div>
  )
}

function Histogram({ claim }: { claim: ClaimCollapse }) {
  if (!claim.dateHistogram) {
    return (
      <p className="mt-3 text-[12.5px]" style={{ color: 'var(--grex-muted)' }}>
        {MMS_COPY.histogramOmitted}
      </p>
    )
  }
  const max = Math.max(...claim.dateHistogram.map((bucket) => bucket.count), 1)
  return (
    <div className="mt-3">
      <p className="text-[12px] mb-2" style={{ color: 'var(--grex-body)' }}>
        {MMS_COPY.histogramTitle}
      </p>
      <div className="flex items-end gap-2 h-16">
        {claim.dateHistogram.map((bucket) => (
          <div key={bucket.bucket} className="flex flex-col items-center justify-end h-full flex-1 min-w-0">
            <div
              style={{
                height: `${Math.max(8, (bucket.count / max) * 40)}px`,
                width: '100%',
                background: 'var(--grex-accent)',
                borderRadius: '4px 4px 0 0',
              }}
              title={`${bucket.bucket}: ${bucket.count}`}
            />
            <span className="mt-1 text-[10px]" style={{ color: 'var(--grex-muted)' }}>
              {bucket.bucket}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}
