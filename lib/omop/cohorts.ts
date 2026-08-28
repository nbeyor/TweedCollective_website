/**
 * Cohort service over the OMOP demo dataset.
 *
 * Cohort definitions are fixed and shipped with the dataset; membership is
 * materialized at generation time by pipeline/generate_omop_dataset.py, which
 * applies the definition logic over the generated tables (the COHORT table is
 * genuinely derived, not tagged). Materializing at runtime returns the
 * versioned cohort record — deterministic for a given dataset version.
 */

import { colIdx, omopManifest, omopTable } from './dataset'

export interface CohortDefinition {
  cohort_definition_id: number
  name: string
  logic: string
  index_concept_id: number
  n: number
}

export interface CohortMember {
  person_id: number
  /** Index day (cohort entry), day offset from the manifest epoch. */
  index_day: number
  /** Cohort exit day (observation period end), day offset. */
  end_day: number
}

export interface MaterializedCohort {
  cohort_id: string
  cohort_definition_id: number
  name: string
  logic: string
  /** Dataset version the membership was derived from — the cohort's version. */
  cohort_version: string
  n: number
  members: CohortMember[]
}

let defsCache: CohortDefinition[] | null = null
const memberCache = new Map<number, CohortMember[]>()

export function cohortDefinitions(): CohortDefinition[] {
  if (!defsCache) {
    const t = omopTable('cohort_definition')
    const [id, name, logic, concept] = [
      'cohort_definition_id',
      'cohort_definition_name',
      'cohort_definition_logic',
      'index_concept_id',
    ].map((c) => colIdx(t, c))
    const counts = omopManifest().cohortCounts
    defsCache = t.rows.map((r) => ({
      cohort_definition_id: Number(r[id]),
      name: String(r[name]),
      logic: String(r[logic]),
      index_concept_id: Number(r[concept]),
      n: Number(counts[String(r[id])] ?? 0),
    }))
  }
  return defsCache
}

export function cohortDefinition(definitionId: number): CohortDefinition | null {
  return cohortDefinitions().find((d) => d.cohort_definition_id === definitionId) ?? null
}

function members(definitionId: number): CohortMember[] {
  if (!memberCache.has(definitionId)) {
    const t = omopTable('cohort')
    const [cid, pid, start, end] = ['cohort_definition_id', 'subject_id', 'cohort_start_day', 'cohort_end_day'].map(
      (c) => colIdx(t, c)
    )
    const out: CohortMember[] = []
    for (const r of t.rows) {
      if (Number(r[cid]) === definitionId) {
        out.push({ person_id: Number(r[pid]), index_day: Number(r[start]), end_day: Number(r[end]) })
      }
    }
    memberCache.set(definitionId, out)
  }
  return memberCache.get(definitionId)!
}

/**
 * Materialize a predefined cohort. Returns the versioned membership; unknown
 * definition IDs return null (the API layer turns that into a 404).
 */
export function materializeCohort(definitionId: number): MaterializedCohort | null {
  const def = cohortDefinition(definitionId)
  if (!def) return null
  const m = omopManifest()
  const mem = members(definitionId)
  return {
    cohort_id: `cohort-${definitionId}-v${m.datasetVersion}`,
    cohort_definition_id: definitionId,
    name: def.name,
    logic: def.logic,
    cohort_version: m.datasetVersion,
    n: mem.length,
    members: mem,
  }
}
