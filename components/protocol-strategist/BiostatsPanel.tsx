'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Calculator, ChevronDown, Database, Loader2, MessageSquare, Play, X } from 'lucide-react'

import { wcg } from './wcgTheme'

/**
 * The biostatistics workbench — the deterministic surface of the OMOP
 * biostatistics module (docs/omop-biostats-module.md).
 *
 * The user (not the model) selects a registered analysis from the catalog,
 * picks a cohort, and gets RWD-derived defaults pre-populated with full
 * provenance labels (source cohort, window, estimate date, uncertainty).
 * Every assumption is editable; Run executes the registered analysis
 * server-side and the result chart lands in the insight panel. The chat can
 * discuss completed runs but never chooses the method or the assumptions —
 * that guardrail is the module's design, and this panel is how it stays true.
 */

// ------------------------------------------------------------- API types ----

interface FieldSpec {
  type: 'number' | 'integer' | 'boolean' | 'string'
  required?: boolean
  default?: number | boolean | string
  min?: number
  max?: number
  exclusiveMin?: boolean
  enum?: string[]
  description: string
}

interface CatalogAnalysis {
  analysis_id: string
  version: string
  title: string
  design: string
  method: string
  fields: Record<string, FieldSpec>
}

interface EndpointInfo {
  endpoint_id: string
  kind: 'binary' | 'continuous' | 'time_to_event'
  label: string
  unit?: string
  cohorts?: number[]
}

interface CohortInfo {
  cohort_definition_id: number
  name: string
  logic: string
  n: number
}

interface Catalog {
  analyses: CatalogAnalysis[]
  cohorts: CohortInfo[]
  rwd_summaries: { endpoints: EndpointInfo[]; soa_templates: Array<{ soa_template_id: string; label: string }> }
  dataset: { dataset_id: string; dataset_version: string; caveat: string }
}

export interface BiostatsRunSummary {
  run_id: string
  analysis_id: string
  title: string
  headline: string
  interpretation: string
  derived_note?: string
}

interface DerivedMeta {
  field: string
  value: number
  label: string
  derived_from: Record<string, unknown>
}

export type BiostatsSelection = { kind: 'analysis'; analysisId: string } | { kind: 'journey' }

// How each analysis pre-populates from the RWD summaries: which endpoint kind
// it reads and which field the estimate lands in.
const PREFILL: Record<string, { endpointKind: EndpointInfo['kind']; field: string; estimate: string } | undefined> = {
  ss_binary_2arm: { endpointKind: 'binary', field: 'control_rate', estimate: 'risk' },
  ss_noninferiority_binary: { endpointKind: 'binary', field: 'control_rate', estimate: 'risk' },
  power_binary_2arm: { endpointKind: 'binary', field: 'control_rate', estimate: 'risk' },
  ss_continuous_2arm: { endpointKind: 'continuous', field: 'sd', estimate: 'sd' },
  ss_noninferiority_continuous: { endpointKind: 'continuous', field: 'sd', estimate: 'sd' },
  power_continuous_2arm: { endpointKind: 'continuous', field: 'sd', estimate: 'sd' },
  ss_survival_2arm: { endpointKind: 'time_to_event', field: 'control_median_survival_months', estimate: 'km_median_months' },
  gs_survival_2arm: { endpointKind: 'time_to_event', field: 'control_median_survival_months', estimate: 'km_median_months' },
  power_survival_2arm: undefined,
}

const DEFAULT_COHORT: Record<EndpointInfo['kind'], number> = {
  binary: 201,
  continuous: 302,
  time_to_event: 103,
}

const inputStyle: React.CSSProperties = {
  background: wcg.surface,
  border: `1px solid ${wcg.borderStrong}`,
  borderRadius: 6,
  color: wcg.ink,
  fontSize: 12.5,
  padding: '5px 8px',
  width: '100%',
}

export function BiostatsPanel({
  selection,
  onClose,
  onInsight,
  onRunRecorded,
  onDiscuss,
}: {
  selection: BiostatsSelection
  onClose: () => void
  /** Push a fixed-chart descriptor into the insight panel. */
  onInsight: (panel: { chart: string; data: Record<string, unknown> }) => void
  /** Register a completed run so the chat can discuss it in later turns. */
  onRunRecorded: (run: BiostatsRunSummary) => void
  /** Send a message into the chat. */
  onDiscuss: (prompt: string) => void
}) {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [analysisId, setAnalysisId] = useState<string>(selection.kind === 'analysis' ? selection.analysisId : 'patient_journey')
  const [cohortId, setCohortId] = useState<number>(101)
  const [endpointId, setEndpointId] = useState<string>('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [derived, setDerived] = useState<DerivedMeta[]>([])
  const [prefilling, setPrefilling] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ headline: string[]; interpretation: string; warnings: string[]; runId: string } | null>(null)

  useEffect(() => {
    fetch('/api/analytics')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? `Catalog unavailable (${r.status}).`)
        return r.json()
      })
      .then((c: Catalog) => setCatalog(c))
      .catch((e) => setCatalogError(e instanceof Error ? e.message : String(e)))
  }, [])

  useEffect(() => {
    if (selection.kind === 'analysis') setAnalysisId(selection.analysisId)
    else setAnalysisId('patient_journey')
  }, [selection])

  const isJourney = analysisId === 'patient_journey'
  const spec = useMemo(
    () => catalog?.analyses.find((a) => a.analysis_id === analysisId) ?? null,
    [catalog, analysisId]
  )
  const prefill = PREFILL[analysisId]

  const endpointOptions = useMemo(() => {
    if (!catalog || !prefill) return []
    return catalog.rwd_summaries.endpoints.filter(
      (e) => e.kind === prefill.endpointKind && (!e.cohorts || e.cohorts.includes(cohortId))
    )
  }, [catalog, prefill, cohortId])

  // Reset the form when the analysis changes: schema defaults in, result out.
  useEffect(() => {
    if (isJourney) {
      setValues({ horizon_months: '24' })
      setCohortId(101)
      setDerived([])
      setResult(null)
      setError(null)
      return
    }
    if (!spec) return
    const next: Record<string, string> = {}
    for (const [key, field] of Object.entries(spec.fields)) {
      if (field.default !== undefined) next[key] = String(field.default)
    }
    setValues(next)
    setDerived([])
    setResult(null)
    setError(null)
    if (prefill) setCohortId(DEFAULT_COHORT[prefill.endpointKind])
  }, [spec, isJourney, prefill])

  // Keep the endpoint choice valid for the cohort.
  useEffect(() => {
    if (!endpointOptions.length) {
      setEndpointId('')
      return
    }
    if (!endpointOptions.some((e) => e.endpoint_id === endpointId)) {
      setEndpointId(endpointOptions[0].endpoint_id)
    }
  }, [endpointOptions, endpointId])

  const runPrefill = useCallback(async () => {
    if (!prefill || !endpointId) return
    setPrefilling(true)
    setError(null)
    try {
      const fn =
        prefill.endpointKind === 'binary'
          ? 'binary_endpoint_rate'
          : prefill.endpointKind === 'continuous'
            ? 'continuous_endpoint_summary'
            : 'time_to_event_summary'
      const res = await fetch(`/api/analytics/rwd-summaries/${fn}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cohort_definition_id: cohortId, endpoint_id: endpointId, followup_months: 12 }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) throw new Error(String(data.error ?? `RWD summary failed (${res.status}).`))
      const estimate = Number(data[prefill.estimate])
      if (!Number.isFinite(estimate)) throw new Error(`The RWD summary returned no usable ${prefill.estimate} for this endpoint.`)
      const prov = data.provenance as Record<string, unknown>
      const uncertainty =
        prefill.endpointKind === 'binary'
          ? `95% CI ${(data.ci95 as number[])?.join('–')} (Wilson)`
          : prefill.endpointKind === 'continuous'
            ? `IQR ${data.q25}–${data.q75}; ${data.missing_pct}% missing`
            : `${data.events} events; ${data.censored_pct}% censored`
      const label = `${prov.cohort_name} · ${String(prov.estimate_date)} · ${uncertainty}`
      setValues((v) => ({ ...v, [prefill.field]: String(estimate) }))
      setDerived((d) => [
        ...d.filter((x) => x.field !== prefill.field),
        {
          field: prefill.field,
          value: estimate,
          label,
          derived_from: {
            field: prefill.field,
            function_id: fn,
            cohort_id: String(prov.cohort_id),
            cohort_name: String(prov.cohort_name),
            endpoint_id: endpointId,
            window: JSON.stringify(prov.windows ?? {}),
            estimate_date: String(prov.estimate_date),
            estimate,
            uncertainty,
          },
        },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setPrefilling(false)
    }
  }, [prefill, endpointId, cohortId])

  const run = useCallback(async () => {
    if (!catalog) return
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      if (isJourney) {
        const res = await fetch('/api/analytics/rwd-summaries/patient_journey', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            cohort_definition_id: cohortId,
            soa_template_id: catalog.rwd_summaries.soa_templates[0]?.soa_template_id ?? 'nsclc-2l-brief',
            horizon_months: Number(values.horizon_months ?? 24),
          }),
        })
        const data = (await res.json()) as Record<string, unknown>
        if (!res.ok) throw new Error(String(data.error ?? `Patient journey failed (${res.status}).`))
        onInsight({ chart: 'patient_journey', data })
        const milestones = (data.milestones as Array<{ label: string; median_months: number }>) ?? []
        const headline = milestones.slice(0, 3).map((m) => `${m.label}: ~${m.median_months} mo`)
        const cohortName = catalog.cohorts.find((c) => c.cohort_definition_id === cohortId)?.name ?? String(cohortId)
        setResult({ headline, interpretation: String(data.note ?? ''), warnings: [], runId: 'patient_journey' })
        onRunRecorded({
          run_id: `journey-${cohortId}`,
          analysis_id: 'patient_journey',
          title: `Patient journey vs SoA — ${cohortName}`,
          headline: milestones.map((m) => `${m.label} median ${m.median_months} mo`).join('; '),
          interpretation: String(data.note ?? ''),
        })
        return
      }

      if (!spec) return
      const inputs: Record<string, unknown> = {}
      for (const [key, field] of Object.entries(spec.fields)) {
        const raw = values[key]
        if (raw === undefined || raw === '') continue
        if (field.type === 'string') inputs[key] = raw
        else if (field.type === 'boolean') inputs[key] = raw === 'true'
        else inputs[key] = Number(raw)
      }
      const derivedFrom = derived
        .filter((d) => Number(values[d.field]) === d.value)
        .map((d) => d.derived_from)
      const res = await fetch('/api/analytics/analysis-runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ analysis_id: spec.analysis_id, analysis_version: spec.version, inputs, derived_from: derivedFrom }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        const details = Array.isArray(data.details) ? ` ${(data.details as string[]).join(' ')}` : ''
        throw new Error(`${String(data.error ?? `Run failed (${res.status}).`)}${details}`)
      }
      const outputs = data.outputs as {
        summary: Record<string, unknown>
        interpretation: string
        warnings: string[]
        table?: Array<Record<string, unknown>>
      }
      onInsight({ chart: 'biostats_result', data })
      const headline = headlineFrom(spec.analysis_id, outputs.summary)
      setResult({
        headline,
        interpretation: outputs.interpretation,
        warnings: outputs.warnings,
        runId: String(data.run_id),
      })
      const derivedNote = derivedFrom.length
        ? `RWD-derived inputs: ${derivedFrom.map((d) => `${String(d.field)} = ${String(d.estimate)} (${String(d.cohort_name)}, ${String(d.uncertainty)})`).join('; ')}`
        : undefined
      onRunRecorded({
        run_id: String(data.run_id),
        analysis_id: spec.analysis_id,
        title: spec.title,
        headline: headline.join(' · '),
        interpretation: outputs.interpretation,
        derived_note: derivedNote,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }, [catalog, isJourney, spec, values, derived, cohortId, onInsight, onRunRecorded])

  const analysisChoices = useMemo(() => {
    const list = (catalog?.analyses ?? []).filter((a) => a.analysis_id !== 'scenario_grid')
    return [...list.map((a) => ({ id: a.analysis_id, label: a.title })), { id: 'patient_journey', label: 'Patient journey vs schedule of assessments (RWD)' }]
  }, [catalog])

  const cohortChoices = useMemo(() => {
    if (!catalog) return []
    if (isJourney) return catalog.cohorts.filter((c) => [101, 102, 103].includes(c.cohort_definition_id))
    if (!prefill) return catalog.cohorts
    return catalog.cohorts.filter((c) =>
      catalog.rwd_summaries.endpoints.some(
        (e) => e.kind === prefill.endpointKind && (!e.cohorts || e.cohorts.includes(c.cohort_definition_id))
      )
    )
  }, [catalog, isJourney, prefill])

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: wcg.surface, borderColor: wcg.borderStrong }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: wcg.border, background: wcg.surfaceMuted }}>
        <Calculator className="w-4 h-4 shrink-0" style={{ color: wcg.teal }} />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold leading-tight" style={{ color: wcg.ink }}>
            Biostatistics workbench
          </p>
          <p className="text-[10.5px] leading-tight" style={{ color: wcg.muted }}>
            Registered analyses over synthetic OMOP RWD — you pick the method and confirm every assumption; nothing is chosen by the model.
          </p>
        </div>
        <button onClick={onClose} aria-label="Close the biostatistics workbench" className="p-1 rounded-md" style={{ color: wcg.muted }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-3 max-h-[46vh] overflow-y-auto">
        {catalogError && (
          <p className="text-[12px]" style={{ color: wcg.bad }}>
            {catalogError}
          </p>
        )}
        {!catalog && !catalogError && (
          <p className="flex items-center gap-2 text-[12px]" style={{ color: wcg.muted }}>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading the analysis catalog…
          </p>
        )}
        {catalog && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="block">
                <span className="block text-[10.5px] uppercase tracking-[0.1em] mb-1" style={{ color: wcg.muted }}>
                  Analysis
                </span>
                <SelectWrap>
                  <select value={analysisId} onChange={(e) => setAnalysisId(e.target.value)} style={inputStyle}>
                    {analysisChoices.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
              <label className="block">
                <span className="block text-[10.5px] uppercase tracking-[0.1em] mb-1" style={{ color: wcg.muted }}>
                  RWD cohort
                </span>
                <SelectWrap>
                  <select value={cohortId} onChange={(e) => setCohortId(Number(e.target.value))} style={inputStyle}>
                    {cohortChoices.map((c) => (
                      <option key={c.cohort_definition_id} value={c.cohort_definition_id}>
                        {c.name} (n={c.n.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </label>
            </div>

            {spec && (
              <p className="text-[11px] leading-snug" style={{ color: wcg.muted }}>
                {spec.design}. {spec.method}
              </p>
            )}

            {!isJourney && prefill && (
              <div className="flex flex-wrap items-end gap-2 rounded-lg border px-2.5 py-2" style={{ borderColor: wcg.border, background: wcg.surfaceMuted }}>
                <label className="block min-w-0 flex-1">
                  <span className="block text-[10.5px] uppercase tracking-[0.1em] mb-1" style={{ color: wcg.muted }}>
                    RWD endpoint for the {prefill.field.replace(/_/g, ' ')} default
                  </span>
                  <SelectWrap>
                    <select value={endpointId} onChange={(e) => setEndpointId(e.target.value)} style={inputStyle}>
                      {endpointOptions.map((e) => (
                        <option key={e.endpoint_id} value={e.endpoint_id}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </SelectWrap>
                </label>
                <button
                  onClick={runPrefill}
                  disabled={prefilling || !endpointId}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-medium text-white disabled:opacity-40"
                  style={{ background: wcg.blue }}
                >
                  {prefilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  Pre-fill from RWD
                </button>
              </div>
            )}

            {isJourney ? (
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="horizon months"
                  description="How far past index the journey is charted (6-36)."
                  value={values.horizon_months ?? '24'}
                  onChange={(v) => setValues((x) => ({ ...x, horizon_months: v }))}
                />
                <div className="text-[11px] leading-snug self-end pb-1" style={{ color: wcg.muted }}>
                  Lays observed visits, imaging cadence, retention, and milestone medians against the design brief&apos;s schedule of assessments.
                </div>
              </div>
            ) : (
              spec && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(spec.fields).map(([key, field]) => {
                    const meta = derived.find((d) => d.field === key)
                    const isDerived = meta !== undefined && Number(values[key]) === meta.value
                    return (
                      <Field
                        key={key}
                        label={`${key.replace(/_/g, ' ')}${field.required ? ' *' : ''}`}
                        description={field.description}
                        value={values[key] ?? ''}
                        onChange={(v) => setValues((x) => ({ ...x, [key]: v }))}
                        options={field.enum}
                        derivedLabel={isDerived ? meta.label : undefined}
                      />
                    )
                  })}
                </div>
              )
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={run}
                disabled={running || (!spec && !isJourney)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium text-white disabled:opacity-40"
                style={{ background: wcg.teal }}
              >
                {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {isJourney ? 'Chart the journey' : 'Run analysis'}
              </button>
              {result && result.runId !== 'patient_journey' && (
                <span className="text-[10.5px] truncate" style={{ color: wcg.faint }} title={result.runId}>
                  {result.runId} · deterministic, reproducible
                </span>
              )}
            </div>

            {error && (
              <p className="text-[12px] leading-snug rounded-md border px-2.5 py-2" style={{ color: '#8A3520', background: '#FDECE7', borderColor: wcg.bad }}>
                {error}
              </p>
            )}

            {result && (
              <div className="rounded-lg border px-3 py-2.5 space-y-1.5" style={{ borderColor: wcg.teal, background: '#ECFBF6' }}>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {result.headline.map((h, i) => (
                    <span key={i} className="text-[13px] font-semibold" style={{ color: wcg.navy }}>
                      {h}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] leading-snug" style={{ color: wcg.body }}>
                  {result.interpretation}
                </p>
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-[11.5px] leading-snug" style={{ color: '#8A6414' }}>
                    ⚠ {w}
                  </p>
                ))}
                <button
                  onClick={() =>
                    onDiscuss(
                      isJourney
                        ? 'Review the patient-journey chart just produced in the biostatistics workbench: where does the real-world path diverge from the schedule of assessments, and what operational risk does that imply for the design?'
                        : `The biostatistics workbench just completed "${spec?.title}" — ${result.headline.join(', ')}. ${result.interpretation} Walk me through what this means for the design and what I should pressure-test next.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium"
                  style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.blue }}
                >
                  <MessageSquare className="w-3 h-3" /> Review in chat
                </button>
              </div>
            )}

            <p className="text-[10px] leading-snug" style={{ color: wcg.faint }}>
              {catalog.dataset.dataset_id} v{catalog.dataset.dataset_version} — entirely synthetic RWD; not fit for clinical, regulatory, or operational decisions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function headlineFrom(analysisId: string, summary: Record<string, unknown>): string[] {
  const out: string[] = []
  const push = (label: string, key: string, fmt?: (v: number) => string) => {
    const v = summary[key]
    if (typeof v === 'number') out.push(`${label} ${fmt ? fmt(v) : v.toLocaleString()}`)
  }
  if (analysisId.startsWith('power_')) {
    push('Power', 'power', (v) => `${(100 * v).toFixed(1)}%`)
    push('· events', 'events')
    push('· N', 'n_total')
    return out
  }
  if (analysisId === 'gs_survival_2arm') {
    push('Max events', 'max_events')
    push('· N', 'n_total_enrolled')
    push('· inflation', 'inflation_factor', (v) => `${v.toFixed(3)}×`)
    return out
  }
  if (analysisId === 'ss_survival_2arm') {
    push('Events', 'events_required')
    push('· N enrolled', 'n_total_enrolled')
    return out
  }
  push('N evaluable', 'n_total_evaluable')
  push('· N enrolled', 'n_total_enrolled')
  return out
}

function Field({
  label,
  description,
  value,
  onChange,
  options,
  derivedLabel,
}: {
  label: string
  description: string
  value: string
  onChange: (v: string) => void
  options?: string[]
  derivedLabel?: string
}) {
  return (
    <label className="block min-w-0" title={description}>
      <span className="block text-[10.5px] uppercase tracking-[0.1em] mb-1 truncate" style={{ color: wcg.muted }}>
        {label}
      </span>
      {options ? (
        <SelectWrap>
          <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </SelectWrap>
      ) : (
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputStyle,
            borderColor: derivedLabel ? wcg.teal : wcg.borderStrong,
            background: derivedLabel ? '#F2FCFA' : wcg.surface,
          }}
        />
      )}
      {derivedLabel && (
        <span className="block text-[9.5px] leading-tight mt-0.5" style={{ color: wcg.teal }} title={derivedLabel}>
          RWD-derived · {derivedLabel}
        </span>
      )}
    </label>
  )
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: wcg.muted }} />
    </span>
  )
}
