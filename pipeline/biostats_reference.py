#!/usr/bin/env python3
"""Independent reference results for the TypeScript biostatistics engine.

Implements the same documented design formulas independently (scipy
distributions, its own group-sequential recursion on a finer grid) and writes
expected-output fixtures to lib/biostats/fixtures/reference.json. The TS engine
is gated against these in scripts/test-biostats.ts within the tolerances
documented in docs/omop-biostats-module.md.

Cross-checks embedded here (assertions) pin the implementation to published
values: power.t.test's classic n=64/group example, Schoenfeld's 380-event HR
0.75 example, and the O'Brien-Fleming-like Lan-DeMets first-look boundary.

Usage:  python3 pipeline/biostats_reference.py
"""

from __future__ import annotations

import json
import math
import os

import numpy as np

from scipy.stats import norm
from scipy.integrate import quad

OUT = os.path.join(os.path.dirname(__file__), "..", "lib", "biostats", "fixtures", "reference.json")


def z(p: float) -> float:
    return float(norm.ppf(p))


# ----------------------------------------------------------- closed forms ---


def ss_continuous(delta, sd, alpha, power, r=1.0):
    za, zb = z(1 - alpha / 2), z(power)
    base = (1 + 1 / r) * sd * sd * (za + zb) ** 2 / delta**2
    g = za * za / 4
    return math.ceil(base + g), math.ceil(r * base + g)


def ss_binary(pc, pt, alpha, power, r=1.0):
    za, zb = z(1 - alpha / 2), z(power)
    delta = abs(pc - pt)
    pbar = (pc + r * pt) / (1 + r)
    nc = (za * math.sqrt((1 + 1 / r) * pbar * (1 - pbar)) + zb * math.sqrt(pc * (1 - pc) + pt * (1 - pt) / r)) ** 2 / delta**2
    return math.ceil(nc), math.ceil(r * nc)


def schoenfeld_events(hr, alpha, power, r=1.0, sided=2):
    za, zb = z(1 - alpha / sided), z(power)
    return (1 + r) ** 2 / r * (za + zb) ** 2 / math.log(hr) ** 2


def event_probability(lam, eta, A, F):
    total = lam + eta
    tau = A + F

    def p_at(fu):
        return lam / total * (1 - math.exp(-total * fu))

    if A <= 0:
        return p_at(tau)
    val, _ = quad(lambda u: p_at(tau - u), 0, A)
    return val / A


def ss_survival(hr, median_c, A, F, alpha, power, r=1.0, annual_dropout=0.0, sided=2):
    d = schoenfeld_events(hr, alpha, power, r, sided)
    lam_c = math.log(2) / median_c
    lam_t = lam_c * hr
    eta = -math.log(1 - annual_dropout) / 12 if annual_dropout > 0 else 0.0
    pc = event_probability(lam_c, eta, A, F)
    pt = event_probability(lam_t, eta, A, F)
    pavg = pc / (1 + r) + pt * r / (1 + r)
    return math.ceil(d), math.ceil(d / pavg), pc, pt


def ni_continuous(margin, true_diff, sd, alpha, power, r=1.0):
    za, zb = z(1 - alpha), z(power)
    eff = margin + true_diff
    nc = (1 + 1 / r) * sd * sd * (za + zb) ** 2 / eff**2
    return math.ceil(nc), math.ceil(r * nc)


def ni_binary(pc, pt, margin, alpha, power, r=1.0):
    za, zb = z(1 - alpha), z(power)
    eff = margin - (pt - pc)
    nc = (za + zb) ** 2 * (pc * (1 - pc) + pt * (1 - pt) / r) / eff**2
    return math.ceil(nc), math.ceil(r * nc)


def power_continuous(nc, nt, delta, sd, alpha):
    se = sd * math.sqrt(1 / nc + 1 / nt)
    return float(norm.cdf(abs(delta) / se - z(1 - alpha / 2)))


def power_binary(nc, nt, pc, pt, alpha):
    delta = abs(pc - pt)
    pbar = (nc * pc + nt * pt) / (nc + nt)
    se0 = math.sqrt(pbar * (1 - pbar) * (1 / nc + 1 / nt))
    se1 = math.sqrt(pc * (1 - pc) / nc + pt * (1 - pt) / nt)
    return float(norm.cdf((delta - z(1 - alpha / 2) * se0) / se1))


def power_survival(d, hr, alpha, r=1.0):
    return float(norm.cdf(abs(math.log(hr)) * math.sqrt(d * r / (1 + r) ** 2) - z(1 - alpha / 2)))


# ------------------------------------------------- group-sequential (LD) ----
# Independent recursion: finer grid (h = 0.01) than the TS engine's 0.02.

Z_LO, Z_HI, H = -8.0, 8.0, 0.01
GRID = np.arange(Z_LO, Z_HI + H / 2, H)


def alpha_spent(fn, alpha, t):
    t = min(1.0, max(1e-9, t))
    if fn == "obrien_fleming":
        return 2 * (1 - norm.cdf(z(1 - alpha / 2) / math.sqrt(t)))
    return alpha * math.log(1 + (math.e - 1) * t)


def _integrate(vals):
    return (vals.sum() - vals[0] / 2 - vals[-1] / 2) * H


def _cond_mean(t_prev, t_cur, drift):
    rho = math.sqrt(t_prev / t_cur)
    return drift * math.sqrt(t_cur) + rho * (GRID - drift * math.sqrt(t_prev))


def _crossing(density, bound, t_prev, t_cur, drift):
    sigma = math.sqrt((t_cur - t_prev) / t_cur)
    mu = _cond_mean(t_prev, t_cur, drift)
    return _integrate(density * (1 - norm.cdf((bound - mu) / sigma)))


def _advance(density, bound, t_prev, t_cur, drift):
    sigma = math.sqrt((t_cur - t_prev) / t_cur)
    mu = _cond_mean(t_prev, t_cur, drift)
    # out[j] = sum_i density[i] * pdf((y_j - mu_i)/sigma)/sigma  (trapezoid)
    diff = (GRID[:, None] - mu[None, :]) / sigma
    kernel = np.exp(-0.5 * diff * diff) / (sigma * math.sqrt(2 * math.pi))
    w = density.copy()
    w[0] /= 2
    w[-1] /= 2
    out = kernel @ w * H
    out[GRID >= bound] = 0.0
    return out


def gs_boundaries(fractions, alpha, fn):
    bounds, cum = [], []
    density = None
    for k, t in enumerate(fractions):
        spent = alpha_spent(fn, alpha, t)
        prev = cum[-1] if cum else 0.0
        inc = max(1e-10, spent - prev)
        cum.append(prev + inc)
        if k == 0:
            b = z(1 - inc)
            bounds.append(b)
            density = np.where(GRID < b, norm.pdf(GRID), 0.0)
        else:
            lo, hi = 0.5, 12.0
            for _ in range(80):
                mid = (lo + hi) / 2
                if _crossing(density, mid, fractions[k - 1], t, 0.0) > inc:
                    lo = mid
                else:
                    hi = mid
            bounds.append((lo + hi) / 2)
            if k < len(fractions) - 1:
                density = _advance(density, bounds[-1], fractions[k - 1], t, 0.0)
    return bounds, cum


def gs_power(fractions, bounds, drift):
    by_look = [1 - float(norm.cdf(bounds[0] - drift * math.sqrt(fractions[0])))]
    density = np.where(GRID < bounds[0], norm.pdf(GRID - drift * math.sqrt(fractions[0])), 0.0)
    for k in range(1, len(fractions)):
        by_look.append(float(_crossing(density, bounds[k], fractions[k - 1], fractions[k], drift)))
        if k < len(fractions) - 1:
            density = _advance(density, bounds[k], fractions[k - 1], fractions[k], drift)
    return by_look


def gs_design(K, alpha, power, fn):
    fractions = [(i + 1) / K for i in range(K)]
    bounds, cum = gs_boundaries(fractions, alpha, fn)
    fixed = z(1 - alpha) + z(power)
    lo, hi = fixed * 0.8, fixed * 1.6
    for _ in range(60):
        mid = (lo + hi) / 2
        if sum(gs_power(fractions, bounds, mid)) < power:
            lo = mid
        else:
            hi = mid
    drift = (lo + hi) / 2
    return {
        "info_fractions": fractions,
        "z_boundaries": [round(float(b), 4) for b in bounds],
        "cumulative_alpha": [round(float(c), 6) for c in cum],
        "inflation_factor": round((drift / fixed) ** 2, 4),
    }


# ---------------------------------------------------------------- fixtures --


def main():
    # Published-value cross-checks pinning the formula implementations.
    nc, nt = ss_continuous(0.5, 1.0, 0.05, 0.8)
    assert (nc, nt) == (64, 64), f"power.t.test classic example: expected 64/group, got {nc}/{nt}"
    d = schoenfeld_events(0.75, 0.05, 0.8, 1.0)
    assert abs(d - 379.7) < 1.0, f"Schoenfeld HR 0.75 example: expected ~380 events, got {d:.1f}"
    b_obf, _ = gs_boundaries([0.5, 1.0], 0.025, "obrien_fleming")
    assert abs(b_obf[0] - 2.9626) < 0.01, f"LD-OBF K=2 first boundary: expected ~2.9626, got {b_obf[0]:.4f}"
    assert abs(b_obf[1] - 1.9686) < 0.01, f"LD-OBF K=2 final boundary: expected ~1.9686, got {b_obf[1]:.4f}"

    fixtures = {
        "ss_continuous_2arm": [
            {
                "inputs": {"effect_difference": 0.5, "sd": 1.0, "alpha": 0.05, "power": 0.8, "allocation_ratio": 1.0, "dropout": 0.0},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_continuous(0.5, 1.0, 0.05, 0.8))),
            },
            {
                "inputs": {"effect_difference": 4.0, "sd": 13.9, "alpha": 0.05, "power": 0.9, "allocation_ratio": 1.0, "dropout": 0.1},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_continuous(4.0, 13.9, 0.05, 0.9))),
            },
            {
                "inputs": {"effect_difference": 0.4, "sd": 1.2, "alpha": 0.05, "power": 0.85, "allocation_ratio": 2.0, "dropout": 0.15},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_continuous(0.4, 1.2, 0.05, 0.85, 2.0))),
            },
        ],
        "ss_binary_2arm": [
            {
                "inputs": {"control_rate": 0.30, "treatment_rate": 0.22, "alpha": 0.05, "power": 0.8, "allocation_ratio": 1.0, "dropout": 0.10},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_binary(0.30, 0.22, 0.05, 0.8))),
            },
            {
                "inputs": {"control_rate": 0.281, "treatment_rate": 0.20, "alpha": 0.05, "power": 0.9, "allocation_ratio": 1.0, "dropout": 0.0},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_binary(0.281, 0.20, 0.05, 0.9))),
            },
            {
                "inputs": {"control_rate": 0.55, "risk_difference": -0.12, "alpha": 0.05, "power": 0.8, "allocation_ratio": 1.5, "dropout": 0.05},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ss_binary(0.55, 0.43, 0.05, 0.8, 1.5))),
            },
        ],
        "ss_survival_2arm": [],
        "ss_noninferiority_continuous": [
            {
                "inputs": {"ni_margin": 2.0, "true_difference": 0.0, "sd": 7.5, "alpha": 0.025, "power": 0.9, "allocation_ratio": 1.0, "dropout": 0.0},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ni_continuous(2.0, 0.0, 7.5, 0.025, 0.9))),
            }
        ],
        "ss_noninferiority_binary": [
            {
                "inputs": {"control_rate": 0.85, "treatment_rate": 0.85, "ni_margin": 0.10, "alpha": 0.025, "power": 0.8, "allocation_ratio": 1.0, "dropout": 0.0},
                "expect": dict(zip(["n_control_evaluable", "n_treatment_evaluable"], ni_binary(0.85, 0.85, 0.10, 0.025, 0.8))),
            }
        ],
        "power_continuous_2arm": [
            {
                "inputs": {"n_control": 64, "n_treatment": 64, "effect_difference": 0.5, "sd": 1.0, "alpha": 0.05},
                "expect": {"power": round(power_continuous(64, 64, 0.5, 1.0, 0.05), 3)},
            }
        ],
        "power_binary_2arm": [
            {
                "inputs": {"n_control": 500, "n_treatment": 500, "control_rate": 0.30, "treatment_rate": 0.22, "alpha": 0.05},
                "expect": {"power": round(power_binary(500, 500, 0.30, 0.22, 0.05), 3)},
            }
        ],
        "power_survival_2arm": [
            {
                "inputs": {"events": 380, "hazard_ratio": 0.75, "alpha": 0.05, "allocation_ratio": 1.0},
                "expect": {"power": round(power_survival(380, 0.75, 0.05), 3)},
            }
        ],
        "gs_survival_2arm": [],
    }

    for hr, med, A, F, alpha, power, r, drop in [
        (0.75, 14.9, 24, 12, 0.05, 0.8, 1.0, 0.05),
        (0.70, 12.0, 18, 18, 0.05, 0.9, 1.0, 0.10),
    ]:
        events, n_total, pc, pt = ss_survival(hr, med, A, F, alpha, power, r, drop)
        fixtures["ss_survival_2arm"].append(
            {
                "inputs": {
                    "hazard_ratio": hr,
                    "control_median_survival_months": med,
                    "accrual_months": A,
                    "followup_months": F,
                    "alpha": alpha,
                    "power": power,
                    "allocation_ratio": r,
                    "annual_dropout": drop,
                },
                "expect": {"events_required": events, "n_total_enrolled": n_total},
                "expect_approx": {"expected_event_probability_control": round(pc, 3), "expected_event_probability_treatment": round(pt, 3)},
            }
        )

    for K, alpha, power, fn in [(2, 0.025, 0.9, "obrien_fleming"), (3, 0.025, 0.9, "obrien_fleming"), (5, 0.025, 0.9, "pocock")]:
        design = gs_design(K, alpha, power, fn)
        fixtures["gs_survival_2arm"].append(
            {
                "inputs": {
                    "hazard_ratio": 0.75,
                    "control_median_survival_months": 14.9,
                    "accrual_months": 24,
                    "followup_months": 12,
                    "looks": K,
                    "spending": fn,
                    "alpha": alpha,
                    "power": power,
                    "allocation_ratio": 1.0,
                    "annual_dropout": 0.05,
                },
                "expect_gs": design,
            }
        )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(
            {
                "generated": "2026-08-28",
                "generator": "pipeline/biostats_reference.py (scipy distributions; independent group-sequential recursion, grid h=0.01)",
                "tolerances": {
                    "sample_sizes": "exact integer match",
                    "power": "±0.001",
                    "event_probabilities": "±0.005",
                    "gs_z_boundaries": "±0.005",
                    "gs_inflation_factor": "±0.01",
                },
                "fixtures": fixtures,
            },
            f,
            indent=1,
        )
    print(f"wrote {os.path.abspath(OUT)}")


if __name__ == "__main__":
    main()
