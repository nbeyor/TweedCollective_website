/**
 * Deployment health check for the Protocol Strategist.
 *
 * Verifies in one request that the Anthropic key works, the corpus loads and
 * queries, and the Google Docs credentials are present and parse. Makes one
 * cheap model call (a few hundred tokens) so a live key failure surfaces here
 * rather than mid-demo.
 *
 * GET /api/protocol-strategist/health
 * GET /api/protocol-strategist/health?scope=google  (Drive probe only — no
 *   model call, cheap enough for the workspace to run on mount so the Publish
 *   button can grey out with a reason instead of failing after a long wait)
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { checkDriveAccess } from '@/lib/googleDocs'
import { runTool } from '@/lib/strategistTools'
import { assessmentOperations, manifest, selectCohort } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 60

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

type Check = { ok: boolean; detail: string; ms?: number }

export async function GET(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const checks: Record<string, Check> = {}
  const started = Date.now()
  const googleOnly = req.nextUrl.searchParams.get('scope') === 'google'

  // --- corpus: every therapeutic area must produce a non-empty cohort ---
  if (!googleOnly) try {
    const t = Date.now()
    const m = manifest() as Record<string, unknown>
    const areas = [
      'Respiratory',
      'Oncology',
      'Immunology & Inflammation',
      'Cardiometabolic',
      'Neurology',
    ]
    const counts = areas.map((ta) => [ta, selectCohort({ therapeutic_area: ta }).length] as const)
    checks.corpus = {
      ok: counts.every(([, n]) => n > 0),
      detail: `${m.protocolCount} protocols, ${m.siteCount} sites, corpus v${m.corpusVersion}; cohorts ${counts
        .map(([ta, n]) => `${ta} ${n}`)
        .join(', ')}`,
      ms: Date.now() - t,
    }
  } catch (err) {
    checks.corpus = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  // --- cross-TA grounding: a non-oncology endpoint what-if must resolve ---
  if (!googleOnly) try {
    const t = Date.now()
    const rows = assessmentOperations()
    const names = new Set(rows.map((r) => String(r.assessment_name)))
    const probes = [
      'Proportion of participants achieving ACR20 response',
      'Change from baseline in low-density lipoprotein cholesterol (LDL-C)',
      'Change from baseline in Expanded Disability Status Scale (EDSS)',
    ]
    const missing = probes.filter((p) => !names.has(p))
    checks.cross_ta_grounding = {
      ok: missing.length === 0,
      detail: missing.length
        ? `assessment_operations missing: ${missing.join('; ')}`
        : `${rows.length} assessment-operations rows; immunology / cardiometabolic / neurology probes all resolve`,
      ms: Date.now() - t,
    }
  } catch (err) {
    checks.cross_ta_grounding = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  // --- tool execution ---
  if (!googleOnly) try {
    const t = Date.now()
    const out = (await runTool('query_cohort', { therapeutic_area: 'Oncology', phase: ['3'] })) as {
      matched?: number
    }
    checks.tools = {
      ok: typeof out.matched === 'number',
      detail: `query_cohort returned ${out.matched} Phase 3 oncology protocols`,
      ms: Date.now() - t,
    }
  } catch (err) {
    checks.tools = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  // --- v0.2 sensitivity layer: brief loads and a scenario computes ---
  if (!googleOnly) try {
    const t = Date.now()
    const brief = (await runTool('get_design_brief', {})) as { indication?: string }
    const ps = (await runTool('procedure_sensitivity', {
      added_procedure: 'Upper gastrointestinal endoscopy (EGD)',
    })) as { scenarios?: Array<{ enrollment_slip_months?: number }> }
    const n = ps.scenarios?.length ?? 0
    checks.sensitivity = {
      ok: Boolean(brief.indication) && n >= 2,
      detail: `brief "${brief.indication}"; procedure_sensitivity returned ${n} scenarios (${ps.scenarios
        ?.map((s) => `${s.enrollment_slip_months}mo`)
        .join(', ')})`,
      ms: Date.now() - t,
    }
  } catch (err) {
    checks.sensitivity = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  // --- anthropic ---
  if (googleOnly) {
    // skip — the google-only scope avoids the model call entirely
  } else if (!process.env.ANTHROPIC_API_KEY) {
    checks.anthropic = { ok: false, detail: 'ANTHROPIC_API_KEY is not set in this environment.' }
  } else {
    try {
      const t = Date.now()
      const client = new Anthropic()
      const res = await client.messages.create({
        model: 'claude-opus-5',
        max_tokens: 256,
        output_config: { effort: 'low' },
        messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      } as unknown as Anthropic.MessageCreateParamsNonStreaming)
      const text = res.content.find((b) => b.type === 'text')
      checks.anthropic = {
        ok: res.stop_reason !== 'refusal',
        detail: `${res.model} replied "${text && text.type === 'text' ? text.text.trim() : '(no text)'}" — ${res.usage.input_tokens} in / ${res.usage.output_tokens} out`,
        ms: Date.now() - t,
      }
    } catch (err) {
      checks.anthropic = { ok: false, detail: err instanceof Error ? err.message : String(err) }
    }
  }

  // --- google (live: authenticates and confirms the folder is writable) ---
  try {
    const t = Date.now()
    checks.google = { ...(await checkDriveAccess()), ms: Date.now() - t }
  } catch (err) {
    checks.google = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  const ok = Object.values(checks).every((c) => c.ok)
  return new Response(
    JSON.stringify(
      { ok, checked_at: new Date().toISOString(), total_ms: Date.now() - started, checks },
      null,
      2
    ),
    {
      status: ok ? 200 : 503,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    }
  )
}
