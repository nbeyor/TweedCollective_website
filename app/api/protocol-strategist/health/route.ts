/**
 * Deployment health check for the Protocol Strategist.
 *
 * Verifies in one request that the Anthropic key works, the corpus loads and
 * queries, and the Google Docs credentials are present and parse. Makes one
 * cheap model call (a few hundred tokens) so a live key failure surfaces here
 * rather than mid-demo.
 *
 * GET /api/protocol-strategist/health
 */

import Anthropic from '@anthropic-ai/sdk'

import { checkDriveAccess } from '@/lib/googleDocs'
import { runTool } from '@/lib/strategistTools'
import { manifest, selectCohort } from '@/lib/trialCorpus'

export const runtime = 'nodejs'
export const maxDuration = 60

type Check = { ok: boolean; detail: string; ms?: number }

export async function GET() {
  const checks: Record<string, Check> = {}
  const started = Date.now()

  // --- corpus ---
  try {
    const t = Date.now()
    const m = manifest() as Record<string, unknown>
    const cohort = selectCohort({ therapeutic_area: 'Respiratory' })
    checks.corpus = {
      ok: cohort.length > 0,
      detail: `${m.protocolCount} protocols, ${m.siteCount} sites, corpus v${m.corpusVersion}; Respiratory cohort ${cohort.length}`,
      ms: Date.now() - t,
    }
  } catch (err) {
    checks.corpus = { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }

  // --- tool execution ---
  try {
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
  try {
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
  if (!process.env.ANTHROPIC_API_KEY) {
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
