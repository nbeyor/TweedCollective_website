/**
 * Group-sequential design machinery: Lan-DeMets error-spending boundaries and
 * boundary-crossing probabilities via the standard recursive numerical
 * integration over the joint distribution of the sequential Z statistics
 * (Armitage-McPherson-Rowe recursion, as in Jennison & Turnbull ch. 19).
 *
 * One-sided efficacy boundaries only (no futility), which matches the
 * registered gs_survival_2arm analysis. Deterministic: fixed integration grid,
 * no simulation.
 */

import { bisect, normCdf, normInv, normPdf } from './stats'

export type SpendingFunction = 'obrien_fleming' | 'pocock'

/** Cumulative one-sided type-I error spent at information fraction t. */
export function alphaSpent(fn: SpendingFunction, alpha: number, t: number): number {
  const tt = Math.min(1, Math.max(1e-9, t))
  if (fn === 'obrien_fleming') {
    // Lan-DeMets O'Brien-Fleming-like spending.
    return 2 * (1 - normCdf(normInv(1 - alpha / 2) / Math.sqrt(tt)))
  }
  // Lan-DeMets Pocock-like spending.
  return alpha * Math.log(1 + (Math.E - 1) * tt)
}

// Integration grid for the continuation density.
const Z_LO = -8
const Z_HI = 8
const GRID_N = 800 // step 0.02

interface GridDensity {
  z: number[]
  f: number[] // density values on the grid (continuation sub-density)
  h: number
}

function initialDensity(drift: number, t1: number): GridDensity {
  const h = (Z_HI - Z_LO) / GRID_N
  const z: number[] = []
  const f: number[] = []
  const mean = drift * Math.sqrt(t1)
  for (let i = 0; i <= GRID_N; i++) {
    const zi = Z_LO + i * h
    z.push(zi)
    f.push(normPdf(zi - mean))
  }
  return { z, f, h }
}

/** Trapezoid weight helper over grid values up to a cap index. */
function integrate(values: number[], h: number): number {
  if (values.length < 2) return 0
  let s = (values[0] + values[values.length - 1]) / 2
  for (let i = 1; i < values.length - 1; i++) s += values[i]
  return s * h
}

/**
 * P(Z_k >= b | not stopped before k), integrated over the continuation
 * density at look k-1, given information fractions t.
 */
function crossingProb(density: GridDensity, bound: number, tPrev: number, tCur: number, drift: number): number {
  const rho = Math.sqrt(tPrev / tCur)
  const sigma = Math.sqrt((tCur - tPrev) / tCur)
  const vals = density.z.map((z, i) => {
    const mu = drift * Math.sqrt(tCur) + rho * (z - drift * Math.sqrt(tPrev))
    return density.f[i] * (1 - normCdf((bound - mu) / sigma))
  })
  return integrate(vals, density.h)
}

/** Advance the continuation density past look k with boundary b (keep z < b). */
function advanceDensity(density: GridDensity, bound: number, tPrev: number, tCur: number, drift: number): GridDensity {
  const rho = Math.sqrt(tPrev / tCur)
  const sigma = Math.sqrt((tCur - tPrev) / tCur)
  const h = density.h
  const zNew = density.z
  const fNew = zNew.map((y) => {
    if (y >= bound) return 0
    const vals = density.z.map((z, i) => {
      const mu = drift * Math.sqrt(tCur) + rho * (z - drift * Math.sqrt(tPrev))
      return (density.f[i] * normPdf((y - mu) / sigma)) / sigma
    })
    return integrate(vals, h)
  })
  return { z: zNew, f: fNew, h }
}

export interface GsBoundaries {
  info_fractions: number[]
  z_boundaries: number[]
  nominal_alpha: number[]
  cumulative_alpha: number[]
}

/** Solve the efficacy boundaries that spend alpha per the spending function. */
export function gsBoundaries(infoFractions: number[], alpha: number, spending: SpendingFunction): GsBoundaries {
  const K = infoFractions.length
  const bounds: number[] = []
  const cumAlpha: number[] = []
  let density: GridDensity | null = null

  for (let k = 0; k < K; k++) {
    const t = infoFractions[k]
    const spentNow = alphaSpent(spending, alpha, t)
    const spentPrev = k === 0 ? 0 : cumAlpha[k - 1]
    const increment = Math.max(1e-10, spentNow - spentPrev)
    cumAlpha.push(spentPrev + increment)

    if (k === 0) {
      bounds.push(normInv(1 - increment))
      density = initialDensity(0, t)
      // Truncate density at the first boundary.
      density = { ...density, f: density.f.map((v, i) => (density!.z[i] >= bounds[0] ? 0 : v)) }
    } else {
      const tPrev = infoFractions[k - 1]
      const d = density!
      const b = bisect((bound) => crossingProb(d, bound, tPrev, t, 0) - increment, 0.5, 12, 1e-9)
      bounds.push(b)
      if (k < K - 1) density = advanceDensity(d, b, tPrev, t, 0)
    }
  }

  return {
    info_fractions: infoFractions,
    z_boundaries: bounds,
    nominal_alpha: bounds.map((b) => 1 - normCdf(b)),
    cumulative_alpha: cumAlpha,
  }
}

/** Overall P(cross any boundary) for a given drift θ (θ = E[Z] at t = 1). */
export function gsPower(infoFractions: number[], bounds: number[], drift: number): { total: number; byLook: number[] } {
  const K = infoFractions.length
  const byLook: number[] = []
  let density = initialDensity(drift, infoFractions[0])
  // Look 1 crossing.
  const p1 = 1 - normCdf(bounds[0] - drift * Math.sqrt(infoFractions[0]))
  byLook.push(p1)
  density = { ...density, f: density.f.map((v, i) => (density.z[i] >= bounds[0] ? 0 : v)) }
  for (let k = 1; k < K; k++) {
    const tPrev = infoFractions[k - 1]
    const t = infoFractions[k]
    byLook.push(crossingProb(density, bounds[k], tPrev, t, drift))
    if (k < K - 1) density = advanceDensity(density, bounds[k], tPrev, t, drift)
  }
  return { total: byLook.reduce((a, b) => a + b, 0), byLook }
}

export interface GsDesignResult {
  boundaries: GsBoundaries
  /** Drift θ delivering the target power under the sequential design. */
  drift: number
  /** Event/N inflation factor vs the fixed-sample design. */
  inflation_factor: number
  /** P(stop for efficacy at look k) under the alternative. */
  stop_probabilities_h1: number[]
  /** Expected information fraction at stopping under the alternative. */
  expected_info_fraction_h1: number
}

export function gsDesign(infoFractions: number[], alpha: number, power: number, spending: SpendingFunction): GsDesignResult {
  const boundaries = gsBoundaries(infoFractions, alpha, spending)
  const fixedDrift = normInv(1 - alpha) + normInv(power)
  const drift = bisect(
    (th) => gsPower(infoFractions, boundaries.z_boundaries, th).total - power,
    fixedDrift * 0.8,
    fixedDrift * 1.6,
    1e-7
  )
  const { byLook } = gsPower(infoFractions, boundaries.z_boundaries, drift)
  const totalStop = byLook.reduce((a, b) => a + b, 0)
  const expectedInfo =
    byLook.reduce((a, p, k) => a + p * infoFractions[k], 0) + (1 - totalStop) * 1 // continue to final look
  return {
    boundaries,
    drift,
    inflation_factor: (drift / fixedDrift) ** 2,
    stop_probabilities_h1: byLook,
    expected_info_fraction_h1: expectedInfo,
  }
}
