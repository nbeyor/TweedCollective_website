'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, Coins, Database, FolderLock, Landmark, Plus } from 'lucide-react'

import { wcg } from './wcgTheme'

/**
 * Preview of the data-connector surface: licensed / paywalled RWD sources and
 * the sponsor's internal document sets. Nothing is wired up yet — clicking a
 * connector flips it to a "requested" state so the affordance reads as "one
 * click and this plugs in", and the footer says provisioning is handled per
 * engagement.
 */

interface Connector {
  key: string
  label: string
  note: string
}

const LICENSED: Connector[] = [
  { key: 'trinetx', label: 'TriNetX', note: 'Federated EHR network · cohort counts & feasibility' },
  { key: 'iqvia', label: 'IQVIA', note: 'Claims, Rx & site-performance data' },
  { key: 'komodo', label: 'Komodo Health', note: 'Payer-complete patient journeys' },
  { key: 'optum', label: 'Optum', note: 'Claims + EHR linked real-world data' },
  { key: 'flatiron', label: 'Flatiron Health', note: 'Oncology EHR-derived RWD' },
  { key: 'drg', label: 'Clarivate DRG', note: 'Epidemiology & disease landscape' },
  { key: 'citeline', label: 'Citeline', note: 'Norstella · trials, sites & investigator intelligence' },
  { key: 'evaluate', label: 'Evaluate Pharma', note: 'Norstella · forecasts & competitive landscape' },
  { key: 'globaldata', label: 'GlobalData', note: 'Trials & enrollment benchmarks' },
  { key: 'definitive', label: 'Definitive Healthcare', note: 'Site, provider & referral analytics' },
]

const REGULATORY: Connector[] = [
  { key: 'fda-guidance', label: 'FDA / EMA guidance & precedent', note: 'Guidance docs, prior approvals & endpoint acceptability' },
  { key: 'adcomm', label: 'AdComm & CRL history', note: 'Advisory committee minutes & complete-response letters' },
  { key: 'ct-registries', label: 'ClinicalTrials.gov / EudraCT', note: 'Registered designs, endpoints & enrollment status' },
]

const COSTS: Connector[] = [
  { key: 'fmv', label: 'Fair Market Value benchmarks', note: 'Per-procedure & per-visit FMV rates by geography' },
  { key: 'grant-plan', label: 'Grant-plan / study budgets', note: 'Investigator grant models · direct & indirect cost' },
  { key: 'planisware', label: 'Portfolio finance (Planisware, RAPID)', note: 'Program cost planning & scenario budgets' },
]

const INTERNAL: Connector[] = [
  { key: 'protocols', label: 'Past protocols & amendments', note: 'Prior studies, amendment history & rationale' },
  { key: 'feasibility', label: 'Feasibility studies', note: 'Site surveys & country feasibility assessments' },
  { key: 'epi', label: 'Epidemiology reports', note: 'Internal epi reviews & burden-of-illness work' },
  { key: 'csr', label: 'Clinical study reports', note: 'CSRs · realized enrollment, deviations & outcomes' },
  { key: 'site-performance', label: 'Site & CRO performance', note: 'Activation, screen-fail & enrollment metrics' },
  { key: 'libraries', label: 'Criteria & SoA libraries', note: 'Standard eligibility language & visit schedules' },
  { key: 'interviews', label: 'Expert & KOL interviews', note: 'Investigator calls, ad boards & congress feedback' },
]

/** Buckets, each breaking out to its example sources on expand. */
const BUCKETS: Array<{ key: string; title: string; icon: React.ReactNode; connectors: Connector[] }> = [
  {
    key: 'rwd',
    title: 'Licensed & real-world data',
    icon: <Database className="w-3.5 h-3.5" style={{ color: wcg.teal }} />,
    connectors: LICENSED,
  },
  {
    key: 'reg',
    title: 'Regulatory & competitive',
    icon: <Landmark className="w-3.5 h-3.5" style={{ color: wcg.purple }} />,
    connectors: REGULATORY,
  },
  {
    key: 'cost',
    title: 'Cost & fair-market value',
    icon: <Coins className="w-3.5 h-3.5" style={{ color: wcg.amber }} />,
    connectors: COSTS,
  },
  {
    key: 'internal',
    title: 'Internal',
    icon: <FolderLock className="w-3.5 h-3.5" style={{ color: wcg.blue }} />,
    connectors: INTERNAL,
  },
]

export function DataConnectorsPanel() {
  const [open, setOpen] = useState(true)
  const [openBucket, setOpenBucket] = useState<string | null>(null)
  const [requested, setRequested] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setRequested((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const requestedIn = (connectors: Connector[]) =>
    connectors.filter((c) => requested.has(c.key)).length

  return (
    <div className="px-4 pb-4">
      <div className="rounded-lg border" style={{ background: wcg.surface, borderColor: wcg.border }}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: wcg.muted }}>
              Data connectors
            </span>
            <span
              className="rounded-full border px-1.5 py-px text-[9.5px] font-medium uppercase tracking-wide"
              style={{ background: '#ECFBF6', borderColor: wcg.teal, color: wcg.navy }}
            >
              Preview
            </span>
          </span>
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform"
            style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
          />
        </button>

        {open && (
          <div className="border-t px-3 pb-3 pt-2.5 space-y-2" style={{ borderColor: wcg.border }}>
            <p className="text-[11.5px] leading-snug" style={{ color: wcg.muted }}>
              Ground every analysis in your licensed and internal data alongside the operations corpus.
              Open a bucket to pick sources.
            </p>

            {BUCKETS.map((b) => (
              <ConnectorBucket
                key={b.key}
                icon={b.icon}
                title={b.title}
                connectors={b.connectors}
                open={openBucket === b.key}
                requestedCount={requestedIn(b.connectors)}
                onToggleOpen={() => setOpenBucket((k) => (k === b.key ? null : b.key))}
                requested={requested}
                onToggle={toggle}
              />
            ))}

            <p className="text-[10.5px] leading-snug" style={{ color: wcg.faint }}>
              Connectors are provisioned per engagement against your existing licenses. Requesting one
              flags it for setup — nothing is queried until access is confirmed.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * One collapsible bucket. Collapsed, it shows the category, a source count, and
 * how many are requested — so the panel reads as four tidy buckets instead of a
 * long flat wall. Expanding breaks it out into its example sources.
 */
function ConnectorBucket({
  icon,
  title,
  connectors,
  open,
  requestedCount,
  onToggleOpen,
  requested,
  onToggle,
}: {
  icon: React.ReactNode
  title: string
  connectors: Connector[]
  open: boolean
  requestedCount: number
  onToggleOpen: () => void
  requested: Set<string>
  onToggle: (key: string) => void
}) {
  return (
    <div className="rounded-md border" style={{ background: wcg.surface, borderColor: open ? wcg.teal : wcg.border }}>
      <button
        onClick={onToggleOpen}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
      >
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-medium leading-snug" style={{ color: wcg.ink }}>
            {title}
          </span>
          <span className="block text-[10.5px] leading-snug" style={{ color: wcg.muted }}>
            {connectors.length} sources{requestedCount ? ` · ${requestedCount} requested` : ''}
          </span>
        </span>
        {requestedCount > 0 && (
          <span
            className="inline-flex items-center justify-center shrink-0 w-5 h-5 rounded-full text-[10px] font-semibold text-white"
            style={{ background: wcg.teal }}
          >
            {requestedCount}
          </span>
        )}
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform"
          style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {open && (
        <div className="border-t px-2 pb-2 pt-1.5 space-y-1" style={{ borderColor: wcg.border }}>
        {connectors.map((c) => {
          const isRequested = requested.has(c.key)
          return (
            <button
              key={c.key}
              onClick={() => onToggle(c.key)}
              title={isRequested ? 'Requested — click to withdraw' : `Request the ${c.label} connector`}
              className="w-full flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors"
              style={{
                background: isRequested ? '#ECFBF6' : wcg.surface,
                borderColor: isRequested ? wcg.teal : wcg.border,
              }}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] leading-snug font-medium truncate" style={{ color: wcg.ink }}>
                  {c.label}
                </span>
                <span className="block text-[10.5px] leading-snug truncate" style={{ color: wcg.muted }}>
                  {c.note}
                </span>
              </span>
              {isRequested ? (
                <span
                  className="inline-flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ background: wcg.teal }}
                >
                  <Check className="w-3 h-3" /> Requested
                </span>
              ) : (
                <span
                  className="inline-flex items-center justify-center shrink-0 w-5 h-5 rounded-full border"
                  style={{ borderColor: wcg.borderStrong, color: wcg.muted }}
                  aria-hidden
                >
                  <Plus className="w-3 h-3" />
                </span>
              )}
            </button>
          )
        })}
        </div>
      )}
    </div>
  )
}
