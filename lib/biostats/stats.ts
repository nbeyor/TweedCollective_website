/**
 * Numerical primitives for the biostatistics engine.
 *
 * Pure, dependency-free implementations of the standard normal distribution
 * functions the analysis catalog needs. Accuracy notes (documented tolerances
 * live in docs/omop-biostats-module.md):
 *   - normCdf: complementary-error-function rational approximation,
 *     max fractional error ~1.2e-7 (Numerical Recipes erfc).
 *   - normInv: Acklam's inverse-normal algorithm with one Halley refinement
 *     step, absolute error < 1e-9.
 */

/** Complementary error function, max fractional error ~1.2e-7. */
export function erfc(x: number): number {
  const z = Math.abs(x)
  const t = 1 / (1 + 0.5 * z)
  const ans =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    )
  return x >= 0 ? ans : 2 - ans
}

/** Standard normal CDF. */
export function normCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2)
}

/** Standard normal density. */
export function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

/** Inverse standard normal CDF (Acklam + one Halley refinement). */
export function normInv(p: number): number {
  if (!(p > 0 && p < 1)) throw new Error(`normInv requires 0 < p < 1 (got ${p})`)
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  const pLow = 0.02425
  let x: number
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p))
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  } else if (p <= 1 - pLow) {
    const q = p - 0.5
    const r = q * q
    x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p))
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }
  // One Halley refinement against the high-accuracy CDF.
  const e = normCdf(x) - p
  const u = (e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2))
  return x - u / (1 + (x * u) / 2)
}

/** Simpson's rule over [a, b] with n (even) intervals. */
export function simpson(f: (x: number) => number, a: number, b: number, n = 200): number {
  if (n % 2 === 1) n += 1
  const h = (b - a) / n
  let s = f(a) + f(b)
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 === 0 ? 2 : 4)
  return (s * h) / 3
}

/** Bisection root-finder for a monotone function on [lo, hi]. */
export function bisect(f: (x: number) => number, lo: number, hi: number, tol = 1e-8, maxIter = 200): number {
  let fLo = f(lo)
  const fHi = f(hi)
  if (fLo === 0) return lo
  if (fHi === 0) return hi
  if (fLo * fHi > 0) throw new Error(`bisect: no sign change on [${lo}, ${hi}]`)
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2
    const fMid = f(mid)
    if (Math.abs(fMid) < tol || (hi - lo) / 2 < tol) return mid
    if (fLo * fMid < 0) {
      hi = mid
    } else {
      lo = mid
      fLo = fMid
    }
  }
  return (lo + hi) / 2
}
