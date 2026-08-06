#!/usr/bin/env python3
"""Generate the synthetic clinical trial corpus for the Protocol Strategist demo.

Two joined layers:

  Protocol layer   -- mirrors the WCG Trial IntelX(TM) Data Dictionary v1.1 sheet
                      structure (15 deliverable sheets), plus one documented
                      Tweed extension (`criterion_type` on eligibility rows).
  Operational layer-- mirrors the KMR Clinical Data Workbook field list (trial
                      and site level). The KMR workbook supplied field names
                      only, with no data, so every value here is synthesized.

The corpus is NOT random. Protocol design choices drive operational outcomes
through an explicit causal model so the demo's analytics find real signal:

  restrictiveness  -> screen-fail rate -> enrollment duration -> cycle time
  restrictiveness  -> amendment count (protocols get loosened mid-flight)
  burden           -> dropout rate, protocol deviations
  diversity drag   -> enrolled population composition

`diversity_drag` weights mark criteria that disproportionately exclude
non-White, older, and lower-income populations (BMI caps, eGFR floors, ANC
floors that ignore benign ethnic neutropenia, study-partner requirements).
The effect is deliberately encoded so the strategist can surface it.

All content is fictional. No real sponsor, site, investigator, or participant.

Usage:  python3 pipeline/generate_trial_corpus.py [--out DIR]
"""

from __future__ import annotations

import argparse
import json
import math
import os
import random
from datetime import date, timedelta

from trial_corpus_content import (
    AMENDMENT_SECTIONS, AMENDMENT_TYPES, BIOLOGIC_CATEGORIES, CORE_PROCEDURES,
    COUNTRIES, CRO_NAMES, DESIGN_ELEMENTS, DOMAINS, DOSING_FREQUENCIES,
    ELIGIBILITY_CATEGORIES,
    EPOCHS, INVASIVENESS, MOLECULE_TYPES, PHASES, RANDOMIZATION_SCHEMES, ROUTES,
    SAINTS, SITE_NAME_PATTERNS, SITE_SPECIALTIES, SITE_TYPES, SPONSOR_STEMS,
    STUDY_TYPES, TA_CRITERIA, THERAPEUTIC_AREAS, UNIVERSAL_EXCLUSION,
    UNIVERSAL_INCLUSION,
)
from trial_corpus_sensitivity import (
    ASSESSMENT_OPS_COLUMNS, PROCEDURE_OPS_COLUMNS, amendment_economics,
    build_assessment_operations, build_design_brief, build_procedure_operations,
)

SEED = 20260806
TARGET_PROTOCOLS = 150
CORPUS_VERSION = "2.0.0"
GENERATED_ON = "2026-08-06"          # fixed, so reruns are byte-identical

# Corpus share by therapeutic area. Oncology carries the most, weighted toward
# thoracic / NSCLC so the hero flow (a Phase 2 second-line metastatic NSCLC
# design brief) has a comparator set with real depth — see NSCLC weighting in
# build_protocol_shell.
TA_SHARES = {
    "Respiratory": 0.22,
    "Oncology": 0.32,
    "Immunology & Inflammation": 0.18,
    "Cardiometabolic": 0.15,
    "Neurology": 0.13,
}

PHASE_WEIGHTS = {"1": 0.14, "1/2": 0.08, "2": 0.34, "2/3": 0.06, "3": 0.30, "4": 0.08}


# ---------------------------------------------------------------- helpers ---

def wchoice(rng, mapping):
    """Weighted choice over {key: weight}."""
    keys = list(mapping)
    return rng.choices(keys, weights=[mapping[k] for k in keys], k=1)[0]


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def jitter(rng, value, pct):
    return value * (1 + rng.uniform(-pct, pct))


def columnar(columns, rows):
    """Compact table form: shared column list + positional row arrays."""
    return {"columns": columns, "rows": rows, "rowCount": len(rows)}


def write(out_dir, name, payload):
    path = os.path.join(out_dir, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
    return path, os.path.getsize(path)


# ------------------------------------------------------- protocol skeleton ---

def build_protocol_shell(rng, idx, ta_name):
    ta = THERAPEUTIC_AREAS[ta_name]
    disease_areas = ta["disease_areas"]
    # NSCLC depth: over-represent thoracic oncology, and NSCLC within it, so the
    # hero comparator cohort is a real distribution rather than a handful.
    if ta_name == "Oncology" and "Thoracic Oncology" in disease_areas:
        if rng.random() < 0.55:
            disease_area = "Thoracic Oncology"
        else:
            disease_area = rng.choice(list(disease_areas))
        inds = disease_areas[disease_area]
        if disease_area == "Thoracic Oncology" and rng.random() < 0.72 \
                and "Advanced Non-Small Cell Lung Cancer" in inds:
            indication = "Advanced Non-Small Cell Lung Cancer"
        else:
            indication = rng.choice(inds)
    else:
        disease_area = rng.choice(list(disease_areas))
        indication = rng.choice(disease_areas[disease_area])
    phase = wchoice(rng, PHASE_WEIGHTS)

    # Design follows phase.
    if phase in ("1", "1/2"):
        design = ["Dose-Escalation", "Open-Label"] if rng.random() < 0.6 else ["Randomized Controlled Trial (RCT)", "Double-Blind"]
        rand_scheme = "Not Applicable" if "Open-Label" in design else "Simple (X:Y)"
        arms = rng.randint(2, 5)
        planned = rng.randint(24, 90)
    elif phase in ("2", "2/3"):
        design = ["Randomized Controlled Trial (RCT)", rng.choice(["Double-Blind", "Single-Blind"]),
                  rng.choice(["Parallel Group", "Cross-Over Design"])]
        rand_scheme = rng.choice(["Simple (X:Y)", "Simple (X:Y), Stratified", "Block, Stratified"])
        arms = rng.randint(2, 4)
        planned = rng.randint(90, 420)
    elif phase == "3":
        design = ["Randomized Controlled Trial (RCT)", "Double-Blind", "Parallel Group"]
        rand_scheme = rng.choice(["Simple (X:Y), Stratified", "Block, Stratified"])
        arms = rng.randint(2, 3)
        planned = rng.randint(320, 1400)
    else:  # phase 4
        design = ["Open-Label", "Parallel Group"] if rng.random() < 0.5 else ["Randomized Controlled Trial (RCT)", "Open-Label"]
        rand_scheme = rng.choice(["Simple (X:Y)", "Not Applicable"])
        arms = rng.randint(1, 3)
        planned = rng.randint(200, 900)

    if ta_name == "Oncology" and rng.random() < 0.18:
        design.append(rng.choice(["Basket Design", "Umbrella Design"]))
    if rng.random() < 0.12:
        design.append("Adaptive Design")

    return dict(
        protocol_id=f"TCX-{idx:04d}",
        protocol_number=f"{rng.choice(SPONSOR_STEMS).split()[0][:3].upper()}-{rng.randint(1000,9999)}-{phase.replace('/','')}",
        phase=phase,
        therapeutic_area=ta_name,
        disease_area=disease_area,
        indication=indication,
        study_type=rng.choice(STUDY_TYPES) if rng.random() < 0.12 else STUDY_TYPES[0],
        study_design=", ".join(dict.fromkeys(design)),
        randomization_scheme=rand_scheme,
        study_arm_count=arms,
        study_arms=", ".join(f"Arm {i+1}" for i in range(arms)),
        planned_participants=planned,
    )


# ------------------------------------------------------ eligibility engine ---

def render_criterion(rng, tpl, ctype, params):
    """Expand a criterion template into a 16-field eligibility row dict."""
    def sub(v):
        if isinstance(v, str) and "{" in v:
            try:
                return v.format(**params)
            except KeyError:
                return v
        return v

    return dict(
        criterion_type=ctype,
        std_eligibility_criteria=tpl["label"],
        eligibility_categorization=tpl["cat"],
        value_relationship=tpl.get("rel", ""),
        range_low=sub(tpl.get("low", "")),
        range_low_unit=tpl.get("low_unit", ""),
        value_relationship2=tpl.get("rel2", ""),
        range_high=sub(tpl.get("high", "")),
        range_high_unit=tpl.get("high_unit", ""),
        timepoint_relationship=tpl.get("tp_rel", ""),
        timepoint_value=sub(tpl.get("tp_val", "")),
        timepoint_value_unit=tpl.get("tp_unit", ""),
        timepoint_description=tpl.get("tp_desc", ""),
        timepoint_start=tpl.get("tp_start", ""),
        additional_notes=tpl.get("notes", ""),
        _restrictiveness=tpl.get("restrictiveness", 0.0),
        _diversity_drag=tpl.get("diversity_drag", 0.0),
    )


def build_eligibility(rng, shell, tightness):
    """Generate the eligibility set. `tightness` (0-1) is the protocol's
    design posture: how aggressively the sponsor narrowed the population."""
    ta_name = shell["therapeutic_area"]
    phase = shell["phase"]

    # Numeric gates tighten with `tightness`.
    params = dict(
        max_age=rng.choice([65, 70, 75, 75, 80, 85, 99]) if tightness < 0.5 else rng.choice([65, 65, 70, 75]),
        bmi_cap=round(clamp(42 - 12 * tightness + rng.uniform(-2, 2), 27, 45)),
        contraception_window=rng.choice([30, 60, 90, 90, 120]),
        egfr_floor=rng.choice([30, 45, 45, 60, 60]) if tightness > 0.5 else rng.choice([30, 30, 45]),
        alt_ceiling=rng.choice(["1.5", "2.0", "2.5", "3.0"]),
        hgb_floor=rng.choice(["9.0", "9.0", "10.0", "11.0"]),
        qtc_ceiling=rng.choice([450, 450, 470, 480, 500]),
        substance_window=rng.choice([1, 2, 2, 5]),
        washout_days=rng.choice([28, 30, 30, 60, 90]),
        fev1_floor=rng.choice([40, 50, 60, 60, 70]),
        eos_floor=rng.choice([150, 150, 300, 300, 450]),
        exac_window=rng.choice([4, 6, 8, 12]),
        ecog_max=rng.choice([0, 1, 1, 1, 2]),
        prior_lines=rng.choice([1, 2, 2, 3, 4]),
        prior_bio=rng.choice([0, 1, 1, 2]),
        hba1c_low=rng.choice(["7.0", "7.0", "7.5", "8.0"]),
        hba1c_high=rng.choice(["9.5", "10.0", "10.5", "11.0"]),
        mmse_low=rng.choice([20, 22, 22, 24]),
        mmse_high=rng.choice([26, 28, 30]),
    )

    rows = []

    # Universal inclusions: nearly always present.
    for tpl in UNIVERSAL_INCLUSION:
        if tpl["label"] == "Body Mass Index (BMI)" and rng.random() > 0.35 + 0.45 * tightness:
            continue
        rows.append(render_criterion(rng, tpl, "Inclusion", params))

    # TA-specific inclusions.
    ta_inc = TA_CRITERIA[ta_name]["inclusion"]
    n_inc = int(round(clamp(len(ta_inc) * (0.45 + 0.55 * tightness), 2, len(ta_inc))))
    for tpl in rng.sample(ta_inc, n_inc):
        rows.append(render_criterion(rng, tpl, "Inclusion", params))

    # Universal exclusions: count scales hard with tightness and phase.
    phase_pressure = {"1": 1.0, "1/2": 0.95, "2": 0.85, "2/3": 0.78, "3": 0.72, "4": 0.55}[phase]
    n_uex = int(round(clamp(len(UNIVERSAL_EXCLUSION) * (0.40 + 0.60 * tightness) * phase_pressure,
                            6, len(UNIVERSAL_EXCLUSION))))
    for tpl in rng.sample(UNIVERSAL_EXCLUSION, n_uex):
        rows.append(render_criterion(rng, tpl, "Exclusion", params))

    # TA-specific exclusions.
    ta_exc = TA_CRITERIA[ta_name]["exclusion"]
    n_exc = int(round(clamp(len(ta_exc) * (0.40 + 0.60 * tightness), 1, len(ta_exc))))
    for tpl in rng.sample(ta_exc, n_exc):
        rows.append(render_criterion(rng, tpl, "Exclusion", params))

    rng.shuffle(rows)
    rows.sort(key=lambda r: 0 if r["criterion_type"] == "Inclusion" else 1)
    return rows, params


def restrictiveness_raw(rows):
    """Unscaled restrictiveness. Counts total restrictive weight rather than
    averaging it -- averaging over ~60 criteria regresses to the mean and
    destroys between-protocol variance."""
    if not rows:
        return 0.0
    weight_sum = sum(r["_restrictiveness"] for r in rows)
    excl = sum(1 for r in rows if r["criterion_type"] == "Exclusion")
    lab_gates = sum(1 for r in rows if r["eligibility_categorization"] == "Lab Values")
    hard_gates = sum(1 for r in rows if r["value_relationship"] in (">=", "<=", "<", ">"))
    return weight_sum * 2.2 + excl * 0.55 + lab_gates * 1.5 + hard_gates * 0.9


def diversity_drag_raw(rows):
    """Unscaled. Driven by the count of high-drag criteria, not the mean:
    one study-partner requirement plus an eGFR floor narrows a population
    far more than twenty neutral criteria dilute it."""
    if not rows:
        return 0.0
    heavy = sum(1 for r in rows if r["_diversity_drag"] >= 0.60)
    severe = sum(1 for r in rows if r["_diversity_drag"] >= 0.75)
    return sum(r["_diversity_drag"] for r in rows) * 1.1 + heavy * 1.8 + severe * 2.6


def rescale(values, lo, hi, rank_weight=0.6):
    """Rescale to [lo, hi] as a blend of percentile rank and min-max.

    Pure min-max leaves right-skewed raws (burden) bunched at the bottom with a
    lone outlier at the top. Pure percentile rank spreads them evenly but makes
    the histogram suspiciously flat. Blending gives full usable range while
    keeping a plausible shape, and the percentile component means "82nd
    percentile for assessment burden" is literally true of this corpus."""
    n = len(values)
    order = sorted(range(n), key=lambda i: values[i])
    pct = [0.0] * n
    for rank, i in enumerate(order):
        pct[i] = rank / max(1, n - 1)
    vmin, vmax = min(values), max(values)
    span = (vmax - vmin) or 1.0
    out = []
    for v, p in zip(values, pct):
        mm = (v - vmin) / span
        out.append(round(lo + (rank_weight * p + (1 - rank_weight) * mm) * (hi - lo), 1))
    return out


# ------------------------------------------------------------- SOA engine ---

def build_soa(rng, shell, burden_posture):
    """Return (grid_dict, event_rows). `burden_posture` (0-1) drives how much
    assessment the sponsor loaded into the schedule."""
    ta = THERAPEUTIC_AREAS[shell["therapeutic_area"]]
    phase = shell["phase"]

    pre_weeks = rng.choice([2, 4, 4, 6, 8])
    if phase in ("1", "1/2"):
        tx_weeks = rng.choice([4, 8, 12, 12, 16])
    elif phase in ("2", "2/3"):
        tx_weeks = rng.choice([12, 16, 24, 24, 32])
    elif phase == "3":
        tx_weeks = rng.choice([24, 36, 52, 52, 76])
    else:
        tx_weeks = rng.choice([26, 52, 52, 78])
    post_weeks = rng.choice([2, 4, 4, 8, 12])

    pool = list(CORE_PROCEDURES) + list(ta["procedures"])
    n_events = int(round(clamp(len(pool) * (0.32 + 0.34 * burden_posture) + rng.uniform(-2, 3),
                               10, len(pool))))
    chosen = rng.sample(pool, n_events)

    # Visit count scales with treatment duration and burden posture.
    base_visits = 3 + tx_weeks / rng.choice([2, 3, 4, 4, 6])
    total_visits = int(round(clamp(base_visits * (0.75 + 0.5 * burden_posture), 4, 46)))
    remote = int(round(total_visits * rng.uniform(0.0, 0.28)))
    inpatient = rng.randint(0, 2) if phase in ("1", "1/2") else 0
    in_clinic = max(1, total_visits - remote)

    event_rows = []
    procedure_count = 0
    total_duration = 0
    inv_buckets = {k: [] for k in INVASIVENESS}

    for name, invasive, minutes, loinc in chosen:
        # How many times across the study this event recurs.
        if name in ("Informed consent", "Demographics", "Inclusion and exclusion criteria",
                    "Medical and surgical history"):
            pre_n, tx_n, post_n = 1, 0, 0
        elif invasive == "Procedure (Highly Invasive)":
            pre_n = 1
            tx_n = rng.randint(1, max(1, int(2 + 2 * burden_posture)))
            post_n = rng.randint(0, 1)
        elif invasive == "Procedure (Moderately Invasive)":
            pre_n, tx_n, post_n = 1, rng.randint(1, 4), rng.randint(0, 1)
        else:
            pre_n = 1
            tx_n = int(round(clamp(total_visits * rng.uniform(0.35, 1.0) * (0.6 + 0.6 * burden_posture),
                                   1, total_visits)))
            post_n = rng.randint(0, 2)

        reps = pre_n + tx_n + post_n
        procedure_count += reps
        total_duration += reps * minutes
        inv_buckets[invasive].append(name)

        freq = ("Once" if tx_n <= 1 else
                "Weekly" if tx_n >= total_visits * 0.8 else
                "Every Two Weeks" if tx_n >= total_visits * 0.45 else "Monthly")

        # One row per epoch the event occurs in -- matches how the Trial IntelX
        # sample lays out SOA (Time + Event): ~3 rows per unique procedure.
        spans = []
        if pre_n:
            spans.append(("Screening", -pre_weeks, -pre_weeks + max(1, pre_weeks // 2), "Once"))
            if pre_weeks >= 4 and rng.random() < 0.45:
                spans.append(("Run-in", -pre_weeks // 2, 0, "Once"))
        if tx_n:
            spans.append(("Treatment", 0, tx_weeks, freq))
        if post_n:
            spans.append(("Follow-up", tx_weeks, tx_weeks + post_weeks,
                          "Once" if post_n == 1 else "Monthly"))

        for epoch, start_wk, end_wk, epoch_freq in spans:
            interval_id = f"{epoch.lower().replace('-', '_')}_wk_{start_wk}_to_{end_wk}"
            event_rows.append([
                shell["protocol_id"], "grid1", name, epoch,
                epoch.lower().replace("-", "_"), shell["study_arms"],
                json.dumps({"interval_id": interval_id, "timepoint": "absolute_range",
                            "cycle_presence": "N", "start_range_week": start_wk,
                            "end_range_week": end_wk}, separators=(",", ":")),
                f"{epoch} Week {start_wk} to {end_wk}", interval_id, len(event_rows) + 1,
                "absolute_range", "N", "", "", start_wk, "", "", "", start_wk, "", "", "",
                end_wk, "", "", "", rng.choice([0, 1, 2, 3, 7]), "days", "",
                pre_n, tx_n, post_n,
                "Once" if pre_n else "", freq if tx_n else "", "Once" if post_n else "", "",
                invasive, name, loinc, "",
            ])

    grid = dict(
        protocol_id=shell["protocol_id"], grid_id="grid1", grid_type="SCHEDULE OF ASSESSMENT",
        is_open_ended=False, pre_treatment_duration=pre_weeks, treatment_duration=tx_weeks,
        post_treatment_duration=post_weeks, total_visit_count=total_visits,
        in_clinic_visit_count=in_clinic, remote_visit_count=remote,
        inpatient_visit_count=inpatient, procedure_count=procedure_count,
        unique_procedures=len(chosen), total_procedure_duration=total_duration,
    )
    for label, key in [("Procedure (Minimally Invasive)", "minimally_invasive_procedures"),
                       ("Procedure (Moderately Invasive)", "moderately_invasive_procedures"),
                       ("Procedure (Highly Invasive)", "highly_invasive_procedures"),
                       ("Procedure (Non - Invasive)", "non_invasive_procedures")]:
        grid[f"std.{key}"] = " | ".join(inv_buckets[label])
        grid[f"std.{key}_count"] = len(inv_buckets[label])

    return grid, event_rows


def burden_raw(grid):
    """Unscaled participant assessment burden."""
    inv_weight = (grid["std.highly_invasive_procedures_count"] * 6
                  + grid["std.moderately_invasive_procedures_count"] * 3
                  + grid["std.minimally_invasive_procedures_count"] * 1.2)
    return (grid["procedure_count"] * 0.22
            + grid["total_procedure_duration"] / 90.0
            + grid["in_clinic_visit_count"] * 1.1
            + inv_weight * 1.4)


SOA_EVENT_COLUMNS = [
    "protocol_id", "grid_id", "std.event_name", "epoch_name", "epoch_id", "study_arms",
    "intervals", "interval_name", "interval_id", "display_order", "timepoint",
    "cycle_presence", "cycle", "timepoint_absolute_or_anchor_day",
    "timepoint_absolute_or_anchor_week", "timepoint_absolute_or_anchor_month",
    "timepoint_absolute_event", "timepoint_anchor_event", "start_range_day",
    "start_range_week", "start_range_month", "start_range_absolute_event",
    "start_anchor_event", "end_range_day", "end_range_week", "end_range_month",
    "end_range_absolute_event", "end_anchor_event", "plus_minus_window_duration",
    "plus_minus_window_unit", "additional_notes", "pre_treatment_count",
    "treatment_count", "post_treatment_count", "pre_treatment_frequency",
    "treatment_frequency", "post_treatment_frequency", "frequency_open_ended",
    "invasiveness_classification", "loinc_name", "loinc_code", "cpt_code",
]


# ----------------------------------------------------- operational outcomes ---

def build_operational(rng, shell, restrict, burden, drag, n_sites):
    """The causal core. Protocol design choices -> operational outcomes."""
    phase = shell["phase"]
    planned = shell["planned_participants"]

    # 1. Screen-fail rate is driven by restrictiveness.
    base_sf = {"1": 0.34, "1/2": 0.36, "2": 0.32, "2/3": 0.33, "3": 0.28, "4": 0.18}[phase]
    screen_fail = clamp(base_sf + (restrict - 45) / 100.0 * 0.55 + rng.gauss(0, 0.045), 0.08, 0.86)

    screened = int(round(planned / max(0.14, 1 - screen_fail)))
    randomized = int(round(planned * rng.uniform(0.92, 1.06)))

    # 2. Dropout is driven by burden (and a little by treatment length).
    base_do = 0.13 + (burden - 50) / 100.0 * 0.34 + rng.gauss(0, 0.028)
    dropout = clamp(base_do, 0.02, 0.55)
    dropped = int(round(randomized * dropout))

    # 3. Amendments: sponsors loosen over-tight protocols mid-flight.
    lam = (0.25
           + max(0.0, restrict - 42) / 100.0 * 2.9
           + max(0.0, burden - 45) / 100.0 * 1.5
           + {"1": 0.1, "1/2": 0.2, "2": 0.35, "2/3": 0.6, "3": 0.8, "4": 0.15}[phase])
    major_amendments = min(8, sum(1 for _ in range(10) if rng.random() < clamp(lam / 10.0 * 2.0, 0, 0.85)))

    # 4. Deviations track burden and footprint.
    dev_rate = 0.9 + (burden - 45) / 100.0 * 2.6 + rng.gauss(0, 0.35)
    major_dev = max(0, int(round(n_sites * clamp(dev_rate, 0.1, 6.0) * 0.32)))
    minor_dev = max(0, int(round(n_sites * clamp(dev_rate, 0.1, 6.0) * 2.1)))

    # 5. Cycle times chain forward from the above.
    start = date(2019, 1, 1) + timedelta(days=rng.randint(0, 1750))
    draft_to_approval = int(clamp(rng.gauss(88, 26) + major_amendments * 4, 30, 260))
    approval_to_fsi = int(clamp(rng.gauss(74, 24) + (n_sites / 12.0) * 3.5, 25, 240))
    fsi_to_fpi = int(clamp(rng.gauss(31, 14), 5, 120))

    # Enrollment duration: the payoff variable.
    site_months = max(0.55, 2.45 * (1 - screen_fail) ** 1.6)
    enroll_months = clamp(randomized / max(1.0, n_sites * site_months), 2.0, 54.0)
    enroll_months *= (1 + major_amendments * 0.055)
    enroll_days = int(enroll_months * 30.4)

    tx_days = 0  # filled by caller from SOA
    d_draft = start
    d_approval = d_draft + timedelta(days=draft_to_approval)
    d_fsi = d_approval + timedelta(days=approval_to_fsi)
    d_fpi = d_fsi + timedelta(days=fsi_to_fpi)
    d_lsi = d_fsi + timedelta(days=int(clamp(rng.gauss(120, 45) + n_sites * 1.1, 30, 420)))
    d_lpi = d_fpi + timedelta(days=enroll_days)

    return dict(
        screen_fail_rate=round(screen_fail, 4),
        subjects_screened=screened,
        subjects_randomized=randomized,
        subjects_dropped=dropped,
        dropout_rate=round(dropout, 4),
        major_amendments=major_amendments,
        major_deviations=major_dev,
        minor_deviations=minor_dev,
        total_deviations=major_dev + minor_dev,
        enrollment_duration_months=round(enroll_months, 1),
        protocol_dev_days=draft_to_approval,
        approval_to_first_site_days=approval_to_fsi,
        first_site_to_first_patient_days=fsi_to_fpi,
        draft_protocol_date=d_draft.isoformat(),
        protocol_approval_date=d_approval.isoformat(),
        first_site_initiated_date=d_fsi.isoformat(),
        last_site_initiated_date=d_lsi.isoformat(),
        first_patient_in_date=d_fpi.isoformat(),
        last_patient_in_date=d_lpi.isoformat(),
        _lpi=d_lpi,
    )


# ------------------------------------------------------------ site engine ---

def build_sites(rng, shell, ops, drag, n_sites, site_seq):
    """Per-site rows. Enrollment splits by site productivity; demographics
    shift with country, site type, and the protocol's diversity drag."""
    ta = shell["therapeutic_area"]
    spec = SITE_SPECIALTIES[ta]
    rows = []

    # Draw site type / country mix. Restrictive protocols concentrate in
    # specialist academic centres and away from community and safety-net
    # sites -- the second mechanism by which narrow criteria narrow the
    # enrolled population.
    tilt = drag / 100.0
    type_names = list(SITE_TYPES)
    type_w = []
    for t in type_names:
        w = SITE_TYPES[t]["share"]
        if t == "Academic Medical Center":
            w *= 1 + 1.15 * tilt
        elif t == "Safety-Net / Public Hospital":
            w *= max(0.05, 1 - 0.90 * tilt)
        elif t == "Community Hospital":
            w *= max(0.15, 1 - 0.65 * tilt)
        type_w.append(w)
    country_names = list(COUNTRIES)
    country_w = [COUNTRIES[c]["share"] for c in country_names]

    picks = []
    for _ in range(n_sites):
        st = rng.choices(type_names, weights=type_w, k=1)[0]
        cn = rng.choices(country_names, weights=country_w, k=1)[0]
        picks.append((st, cn))

    productivity = [SITE_TYPES[st]["enroll_rate"] * rng.lognormvariate(0, 0.55) for st, _ in picks]
    total_prod = sum(productivity) or 1.0
    remaining = ops["subjects_randomized"]

    lpi = ops["_lpi"]

    for i, ((st, cn), prod) in enumerate(zip(picks, productivity)):
        cfg = SITE_TYPES[st]
        ccfg = COUNTRIES[cn]
        city, state = rng.choice(ccfg["cities"])

        share = prod / total_prod
        randomized = int(round(ops["subjects_randomized"] * share))
        if i == len(picks) - 1:
            randomized = max(0, remaining)
        randomized = max(0, min(randomized, remaining))
        remaining -= randomized

        consented = int(round(randomized / max(0.14, 1 - ops["screen_fail_rate"])))
        dropped = int(round(randomized * ops["dropout_rate"] * rng.uniform(0.6, 1.5)))
        dropped = min(dropped, randomized)
        planned_treated = max(1, int(round(randomized * rng.uniform(0.85, 1.45))) or 1)

        startup = rng.randint(*cfg["startup_days"])
        d_selected = date.fromisoformat(ops["protocol_approval_date"]) + timedelta(days=rng.randint(0, 60))
        d_irb_sub = d_selected + timedelta(days=rng.randint(5, 40))
        d_irb_appr = d_irb_sub + timedelta(days=rng.randint(18, 75))
        d_init = d_selected + timedelta(days=startup)
        d_fpi_site = d_init + timedelta(days=rng.randint(4, 95)) if randomized else None
        d_closeout = lpi + timedelta(days=rng.randint(30, 210))

        # Demographics. Diversity drag pulls enrollment toward the majority group.
        race_mix = dict(ccfg["race"])
        maj = "Asian" if cn in ("Japan", "South Korea") else "White"
        # Safety-net and community sites blunt the drag; academic sites amplify it.
        site_factor = {"Safety-Net / Public Hospital": 0.35, "Community Hospital": 0.65,
                       "Private Practice": 0.95, "Dedicated Research Site": 1.05,
                       "Academic Medical Center": 1.20}[st]
        # Site-level noise: investigator networks and local catchment vary a
        # lot. Without it the drag effect comes out near-deterministic, which
        # no real registry ever looks like.
        pull = clamp(drag / 100.0 * 0.80 * site_factor * rng.lognormvariate(0, 0.45)
                     + rng.gauss(0, 0.10), 0.0, 0.92)
        minors = [k for k in race_mix if k != maj]
        moved_total = sum(race_mix[k] * pull for k in minors)
        for k in minors:
            race_mix[k] *= (1 - pull)
        race_mix[maj] += moved_total

        race_counts = allocate(rng, randomized, race_mix,
                               ["Asian", "Black", "Indigenous", "White", "Other", "Unknown"])
        hisp_p = ccfg["ethnicity"]["hispanic"] * (1 - drag / 100.0 * 0.35)
        eth_counts = allocate(rng, randomized,
                              {"Hispanic / Latinx": hisp_p, "Non-Hispanic / Latinx": 1 - hisp_p - 0.02,
                               "Unknown": 0.02},
                              ["Hispanic / Latinx", "Non-Hispanic / Latinx", "Unknown"])
        gender_counts = allocate(rng, randomized,
                                 {"Male": 0.49, "Female": 0.49, "Other": 0.01, "Unknown": 0.01},
                                 ["Male", "Female", "Other", "Unknown"])
        # Age bands shift older when max_age is generous, younger when capped.
        age_mix = {"Infants / Toddlers": 0.0, "Children": 0.0, "Teens": 0.01,
                   "Adults": 0.64 + drag / 100.0 * 0.18, "Seniors": 0.34 - drag / 100.0 * 0.18,
                   "Unknown": 0.01}
        age_counts = allocate(rng, randomized, age_mix,
                              ["Infants / Toddlers", "Children", "Teens", "Adults", "Seniors", "Unknown"])

        site_seq[0] += 1
        pattern = rng.choice(SITE_NAME_PATTERNS[st])
        rows.append([
            shell["protocol_id"], f"{shell['protocol_id']}-S{i+1:03d}", f"SITE-{site_seq[0]:05d}", st,
            d_irb_sub.isoformat(), d_irb_appr.isoformat(),
            rng.choice(["Central", "Local"]),
            d_selected.isoformat(), d_init.isoformat(),
            planned_treated, consented, randomized, dropped,
            d_fpi_site.isoformat() if d_fpi_site else "",
            d_closeout.isoformat(),
            max(0, int(round(rng.gauss(1.4, 1.1) * (1 + randomized / 25.0)))),
            max(0, int(round(rng.gauss(6.5, 3.4) * (1 + randomized / 18.0)))),
            pattern.format(city=city, spec=spec, saint=rng.choice(SAINTS)),
            f"Department of {spec}", city, state, cn,
            "Yes" if randomized == 0 else "No",
            round(startup, 0),
            race_counts["Asian"], race_counts["Black"], race_counts["Indigenous"],
            race_counts["White"], race_counts["Other"], race_counts["Unknown"],
            eth_counts["Hispanic / Latinx"], eth_counts["Non-Hispanic / Latinx"], eth_counts["Unknown"],
            gender_counts["Male"], gender_counts["Female"], gender_counts["Other"], gender_counts["Unknown"],
            age_counts["Infants / Toddlers"], age_counts["Children"], age_counts["Teens"],
            age_counts["Adults"], age_counts["Seniors"], age_counts["Unknown"],
        ])
    return rows


SITE_COLUMNS = [
    "protocol_id", "site_identifier_trial", "site_identifier_unique", "sponsor_site_type",
    "irb_submission_date", "irb_approval_date", "central_vs_local_irb", "date_site_selected",
    "site_initiation_date", "planned_subjects_treated", "subjects_signing_consent",
    "subjects_randomized_treated", "subjects_dropped", "first_subject_treated_date_at_site",
    "site_closeout_date", "major_protocol_deviations", "minor_protocol_deviations",
    "site_name", "site_division", "city", "state_province", "country", "non_enrolling_site",
    "startup_days",
    "subjects_race_asian", "subjects_race_black", "subjects_race_indigenous",
    "subjects_race_white", "subjects_race_other", "subjects_race_unknown",
    "subjects_ethnicity_hispanic", "subjects_ethnicity_non_hispanic", "subjects_ethnicity_unknown",
    "subjects_gender_male", "subjects_gender_female", "subjects_gender_other", "subjects_gender_unknown",
    "subjects_age_infants", "subjects_age_children", "subjects_age_teens",
    "subjects_age_adults", "subjects_age_seniors", "subjects_age_unknown",
]


def allocate(rng, total, weights, keys):
    """Split `total` across `keys` by weight, exactly (largest-remainder)."""
    out = {k: 0 for k in keys}
    if total <= 0:
        return out
    w = {k: max(0.0, weights.get(k, 0.0)) for k in keys}
    s = sum(w.values()) or 1.0
    exact = {k: total * w[k] / s for k in keys}
    for k in keys:
        out[k] = int(math.floor(exact[k]))
    rem = total - sum(out.values())
    order = sorted(keys, key=lambda k: exact[k] - math.floor(exact[k]), reverse=True)
    for i in range(rem):
        out[order[i % len(order)]] += 1
    return out


# ------------------------------------------------------------------ main ---

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="public/data/trial-corpus")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    rng = random.Random(SEED)

    # Allocate protocols across therapeutic areas.
    ta_plan = []
    for ta_name, share in TA_SHARES.items():
        ta_plan += [ta_name] * int(round(TARGET_PROTOCOLS * share))
    while len(ta_plan) < TARGET_PROTOCOLS:
        ta_plan.append("Respiratory")
    ta_plan = ta_plan[:TARGET_PROTOCOLS]
    rng.shuffle(ta_plan)

    protocols, elig_rows, grids, soa_rows, site_rows = [], [], [], [], []
    obj_rows, ep_rows, dose_rows, conmed_rows, prohib_rows = [], [], [], [], []
    amend_rows, hist_rows = [], []
    attribution_acc = {}  # (ta, criterion, type, category) -> [per-protocol attribution %]
    site_seq = [0]

    # ---- pass 1: protocol structure and raw indices ------------------------
    built = []
    for idx, ta_name in enumerate(ta_plan, start=1):
        shell = build_protocol_shell(rng, idx, ta_name)
        # Two design postures per protocol, correlated a little.
        tightness = clamp(rng.betavariate(2.2, 2.2), 0.02, 0.98)
        burden_posture = clamp(tightness * 0.35 + rng.betavariate(2.2, 2.2) * 0.65, 0.02, 0.98)
        elig, params = build_eligibility(rng, shell, tightness)
        grid, events = build_soa(rng, shell, burden_posture)
        built.append(dict(
            shell=shell, ta_name=ta_name, tightness=tightness, elig=elig, params=params,
            grid=grid, events=events,
            r_raw=restrictiveness_raw(elig), b_raw=burden_raw(grid), d_raw=diversity_drag_raw(elig),
            n_sites=int(round(clamp(shell["planned_participants"] / rng.uniform(11, 38), 3, 165))),
        ))

    # Rescale indices across the corpus so each spans a usable range. Min-max
    # keeps the raw distribution's shape; averaging inside a single protocol
    # would flatten it.
    r_scaled = rescale([b["r_raw"] for b in built], 12, 95)
    b_scaled = rescale([b["b_raw"] for b in built], 10, 96)
    d_scaled = rescale([b["d_raw"] for b in built], 8, 94)
    for b, r, bu, d in zip(built, r_scaled, b_scaled, d_scaled):
        b["restrict"], b["burden"], b["drag"] = r, bu, d

    # ---- pass 2: operational outcomes, sites, and assembly -----------------
    for b in built:
        shell, ta_name, params = b["shell"], b["ta_name"], b["params"]
        elig, grid, events = b["elig"], b["grid"], b["events"]
        restrict, burden, drag = b["restrict"], b["burden"], b["drag"]
        tightness, n_sites = b["tightness"], b["n_sites"]
        ta = THERAPEUTIC_AREAS[ta_name]
        ops = build_operational(rng, shell, restrict, burden, drag, n_sites)
        sites = build_sites(rng, shell, ops, drag, n_sites, site_seq)

        # Criterion-level screen-fail attribution: split this protocol's
        # screen-fail rate across its criteria by restrictiveness weight. This is
        # what the burden waterfall (UC1) reads — an additive per-criterion share
        # of the eligible population lost, sourced from the corpus, not the model.
        sf = ops["screen_fail_rate"]
        wsum = sum(r["_restrictiveness"] for r in elig) or 1.0
        for r in elig:
            attr = (r["_restrictiveness"] / wsum) * sf * 100.0
            key = (ta_name, r["std_eligibility_criteria"], r["criterion_type"],
                   r["eligibility_categorization"])
            attribution_acc.setdefault(key, []).append(attr)

        # Objectives and endpoints.
        n_pri_obj = rng.randint(1, 2)
        n_sec_obj = rng.randint(1, 4)
        n_ter_obj = rng.choice([0, 0, 1, 2])
        for tier, n in (("Primary", n_pri_obj), ("Secondary", n_sec_obj), ("Tertiary", n_ter_obj)):
            for text, dom in rng.sample(ta["objectives"], min(n, len(ta["objectives"]))):
                obj_rows.append([shell["protocol_id"], tier, text, dom])

        n_pri_ep = rng.randint(1, 4)
        n_sec_ep = rng.randint(2, 9)
        n_ter_ep = rng.choice([0, 0, 2, 4, 6])
        for tier, n in (("Primary", n_pri_ep), ("Secondary", n_sec_ep), ("Tertiary", n_ter_ep)):
            for text, dom in rng.sample(ta["endpoints"], min(n, len(ta["endpoints"]))):
                tv, tu = ("", "")
                if rng.random() < 0.35:
                    tv = str(rng.choice([4, 8, 12, 16, 24, 52]))
                    tu = "weeks"
                ep_rows.append([shell["protocol_id"], tier, text, tv, tu, "", dom])

        # Dosing.
        for a in range(shell["study_arm_count"]):
            dose_rows.append([
                shell["protocol_id"], f"Dosing Schedule {a+1}",
                rng.choice(DOSING_FREQUENCIES), rng.choice(ta["routes"]),
                rng.choice(["Clinic", "Clinic", "Home", "Inpatient Unit"]),
                "Week 1", f"Week {grid['treatment_duration']}",
            ])

        # Con meds.
        n_allowed = rng.randint(1, 5)
        for m in rng.sample(ta["prohibited"], min(n_allowed, len(ta["prohibited"]))):
            conmed_rows.append([shell["protocol_id"], f"Protocol-permitted background therapy: {m.lower()}"])
        n_prohib = int(round(clamp(len(ta["prohibited"]) * (0.35 + 0.65 * tightness), 2, len(ta["prohibited"]))))
        prohibited = rng.sample(ta["prohibited"], n_prohib)
        for m in prohibited:
            prohib_rows.append([shell["protocol_id"], m])

        # Amendments.
        hist_rows.append([shell["protocol_id"], "Original Protocol", "Global"])
        for a in range(ops["major_amendments"]):
            hist_rows.append([shell["protocol_id"], f"Amendment {a+1}",
                              rng.choice(["Global", "Global", "United States", "European Union", "Japan"])])
            # Over-restrictive protocols get amended on eligibility first.
            if restrict > 55 and rng.random() < 0.62:
                atype = "Eligibility Criteria Change"
                section = rng.choice(["Section 5.1 Inclusion Criteria", "Section 5.2 Exclusion Criteria"])
            elif burden > 55 and rng.random() < 0.45:
                atype = "Schedule of Assessments Change"
                section = "Section 8.1 Schedule of Assessments"
            else:
                atype = rng.choice(AMENDMENT_TYPES)
                section = rng.choice(AMENDMENT_SECTIONS)
            # Economics: timing (months from FPI) and the ~$500K cost framing,
            # deterministic per amendment so the risk sweep resolves to dollars.
            jitter = int(shell["protocol_id"].split("-")[1]) * 7 + a
            amd_cost, amd_month = amendment_economics(atype, a, jitter)
            amend_rows.append([shell["protocol_id"], f"Amendment {a+1}", section, atype,
                               amd_month, amd_cost])

        inc = sum(1 for r in elig if r["criterion_type"] == "Inclusion")
        exc = len(elig) - inc

        # Trial Representation Summary (Trial IntelX sheet 01) + derived indices
        # + KMR operational fields, flattened into one protocol record.
        rec = dict(shell)
        rec.pop("planned_participants")
        rec.update(
            number_of_participants=shell["planned_participants"],
            gender="All",
            min_age=18,
            max_age=params["max_age"],
            control="Control 1" if shell["randomization_scheme"] != "Not Applicable" else "",
            primary_objectives_count=n_pri_obj, secondary_objectives_count=n_sec_obj,
            tertiary_objectives_count=n_ter_obj,
            primary_endpoints_count=n_pri_ep, secondary_endpoints_count=n_sec_ep,
            tertiary_endpoints_count=n_ter_ep,
            total_endpoints_count=n_pri_ep + n_sec_ep + n_ter_ep,
            inclusion_criteria_count=inc, exclusion_criteria_count=exc,
            eligibility_criteria_count=len(elig),
            concomitant_medications_count=n_allowed,
            prohibited_concomitant_meds_count=n_prohib,
            additional_therapies="",
            amendment_number=(f"Version {ops['major_amendments']+1}.0"
                              if ops["major_amendments"] else "Original Protocol"),
            line_of_treatment=(rng.choice(["First Line", "Second Line", "Third Line or Later"])
                               if ta_name == "Oncology" else "Not Specified"),
            # --- derived indices (Tweed extension) ---
            restrictiveness_index=restrict,
            burden_index=burden,
            diversity_drag_index=drag,
            # --- SOA rollups ---
            treatment_duration_weeks=grid["treatment_duration"],
            total_visit_count=grid["total_visit_count"],
            procedure_count=grid["procedure_count"],
            total_procedure_duration_min=grid["total_procedure_duration"],
            highly_invasive_procedure_count=grid["std.highly_invasive_procedures_count"],
            # --- KMR operational layer ---
            sponsor=rng.choice(SPONSOR_STEMS),
            molecule_type=rng.choice(MOLECULE_TYPES),
            biologic_category=rng.choice(BIOLOGIC_CATEGORIES),
            cro_name=rng.choice(CRO_NAMES),
            first_in_human="Yes" if shell["phase"] in ("1", "1/2") and rng.random() < 0.5 else "No",
            adaptive_design="Yes" if "Adaptive Design" in shell["study_design"] else "No",
            basket_umbrella_trial=("Yes" if ("Basket Design" in shell["study_design"]
                                             or "Umbrella Design" in shell["study_design"]) else "No"),
            trial_status=rng.choices(["Completed", "Ongoing", "Terminated"], weights=[0.66, 0.29, 0.05])[0],
            sites_initiated=n_sites,
            sites_randomizing=sum(1 for s in sites if s[11] > 0),
            non_enrolling_sites=sum(1 for s in sites if s[11] == 0),
        )
        for k, v in ops.items():
            if not k.startswith("_"):
                rec[k] = v

        protocols.append(rec)
        grids.append(grid)
        soa_rows += events
        site_rows += sites
        for r in elig:
            elig_rows.append([shell["protocol_id"]] + [r[c] for c in ELIG_FIELDS])

    # ---------------------------------------------------------- write out ---
    files = {}
    files["protocols.json"] = protocols
    files["eligibility.json"] = columnar(["protocol_id"] + ELIG_FIELDS, elig_rows)
    files["soa_grid.json"] = grids
    files["soa_events.json"] = columnar(SOA_EVENT_COLUMNS, soa_rows)
    files["sites.json"] = columnar(SITE_COLUMNS, site_rows)
    files["objectives.json"] = columnar(
        ["protocol_id", "tier", "std_objective", "objective_domain"], obj_rows)
    files["endpoints.json"] = columnar(
        ["protocol_id", "tier", "std_endpoint", "time_value", "time_unit",
         "additional_details", "endpoint_domain"], ep_rows)
    files["dosing.json"] = columnar(
        ["protocol_id", "dosing_schedule[].id", "dosing_schedule[].frequency",
         "dosing_schedule[].route_of_administration", "dosing_schedule[].dosing_location",
         "dosing_schedule[].start", "dosing_schedule[].end"], dose_rows)
    files["concomitant_medications.json"] = columnar(
        ["protocol_id", "concomitant_medications"], conmed_rows)
    files["prohibited_medications.json"] = columnar(
        ["protocol_id", "prohibited_concomitant_meds"], prohib_rows)
    files["document_history.json"] = columnar(
        ["protocol_id", "document_history[].amendment",
         "document_history[].countries_impacted"], hist_rows)
    files["description_of_change.json"] = columnar(
        ["protocol_id", "amendment", "description_of_change[].section_name",
         "description_of_change[].amendment_type", "timing_months_from_fpi",
         "cost_estimate_usd"], amend_rows)

    # ---- v0.2 sensitivity layer -------------------------------------------
    files["procedure_operations.json"] = columnar(
        PROCEDURE_OPS_COLUMNS, build_procedure_operations())
    files["assessment_operations.json"] = columnar(
        ASSESSMENT_OPS_COLUMNS, build_assessment_operations())

    attribution_rows = []
    for (ta_name, crit, ctype, cat), vals in attribution_acc.items():
        attribution_rows.append([
            ta_name, crit, ctype, cat,
            round(sum(vals) / len(vals), 2), len(vals),
        ])
    attribution_rows.sort(key=lambda r: (r[0], -r[4]))
    files["criterion_attribution.json"] = columnar(
        ["therapeutic_area", "criterion", "criterion_type", "category",
         "mean_screen_fail_attribution_pct", "protocols_using"], attribution_rows)

    files["design_brief.json"] = build_design_brief()
    files["vocabularies.json"] = dict(
        phase=PHASES, study_type=STUDY_TYPES, study_design=DESIGN_ELEMENTS,
        randomization_scheme=RANDOMIZATION_SCHEMES, dosing_frequency=DOSING_FREQUENCIES,
        route_of_administration=ROUTES, domain=DOMAINS,
        eligibility_categorization=ELIGIBILITY_CATEGORIES, amendment_type=AMENDMENT_TYPES,
        invasiveness_classification=INVASIVENESS,
        criterion_type=["Inclusion", "Exclusion"],
        therapeutic_area=list(THERAPEUTIC_AREAS),
        site_type=list(SITE_TYPES), country=list(COUNTRIES),
        _provenance={
            "observed_in_sample": ["study_type", "randomization_scheme", "domain",
                                   "eligibility_categorization", "invasiveness_classification"],
            "inferred": ["amendment_type", "phase", "study_design", "dosing_frequency",
                         "route_of_administration"],
            "tweed_extension": ["criterion_type", "therapeutic_area", "site_type", "country"],
            "note": ("The Data Dictionary summary exhibit names Appendices A-I but does not "
                     "reproduce their permitted values. Vocabularies marked 'inferred' are "
                     "plausible reconstructions and should be replaced when the full "
                     "Trial IntelX Data Dictionary v1.1 is available."),
        })

    manifest = dict(
        corpusVersion=CORPUS_VERSION, generated=GENERATED_ON, seed=SEED, synthetic=True,
        protocolCount=len(protocols), siteCount=len(site_rows),
        eligibilityRowCount=len(elig_rows), soaEventRowCount=len(soa_rows),
        therapeuticAreas={ta: sum(1 for p in protocols if p["therapeutic_area"] == ta)
                          for ta in THERAPEUTIC_AREAS},
        phases={ph: sum(1 for p in protocols if p["phase"] == ph) for ph in PHASES},
        schemaBasis=("WCG Trial IntelX(TM) Data Dictionary v1.1 (15 deliverable sheets) "
                     "joined to the KMR Clinical Data Workbook field list (trial + site level)"),
        extensions=["criterion_type", "restrictiveness_index", "burden_index",
                    "diversity_drag_index", "startup_days", "total_endpoints_count",
                    "screen_fail_attribution", "procedure_operations",
                    "assessment_operations", "amendment_economics", "design_brief"],
        sensitivityTables=["procedure_operations", "assessment_operations",
                           "criterion_attribution", "design_brief"],
        heroBrief="NSCLC-2L-DESIGN-BRIEF",
        disclaimer=("Entirely synthetic. No real sponsor, site, investigator, protocol, or "
                    "participant. Generated for demonstration only; not fit for any "
                    "clinical, regulatory, or operational decision."),
        files={},
    )

    for name, payload in files.items():
        path, size = write(args.out, name, payload)
        manifest["files"][name] = dict(bytes=size)
        print(f"  {name:34s} {size/1024:9.1f} KB")

    write(args.out, "manifest.json", manifest)
    total = sum(f["bytes"] for f in manifest["files"].values())
    print(f"\n  {len(protocols)} protocols | {len(site_rows)} sites | "
          f"{len(elig_rows)} criteria | {len(soa_rows)} SOA events")
    print(f"  total {total/1024/1024:.2f} MB -> {args.out}")


ELIG_FIELDS = [
    "criterion_type", "std_eligibility_criteria", "eligibility_categorization",
    "value_relationship", "range_low", "range_low_unit", "value_relationship2",
    "range_high", "range_high_unit", "timepoint_relationship", "timepoint_value",
    "timepoint_value_unit", "timepoint_description", "timepoint_start", "additional_notes",
]

if __name__ == "__main__":
    main()
