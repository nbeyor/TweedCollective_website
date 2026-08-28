#!/usr/bin/env python3
"""Generate the synthetic OMOP CDM v5.4 demo dataset for the biostatistics module.

A SEPARATE data asset from the trial corpus (public/data/trial-corpus/): this is
synthetic real-world data (RWD) in an OMOP CDM v5.4 subset, used by the cohort /
RWD-summary service and the fixed biostatistics analytics catalog. Nothing here
is joined to the trial corpus; the two stores version independently.

Three disease cohorts with encoded, deterministic signal, plus a background
population, so the RWD summaries find realistic structure:

  Advanced NSCLC     -- time-to-event outcomes (death, progression), platinum /
                        immunotherapy exposure with an encoded survival benefit
  Heart failure      -- binary outcome (HF hospitalization within 12 months),
                        continuous NT-proBNP / LVEF, guideline drug exposure
  Severe asthma      -- continuous FEV1 %, blood eosinophils, exacerbation
                        events; biologic exposure lowers the exacerbation rate

Realism requirements from the module PRD: 10,000+ patients, 24+ months of
observable history, realistic missingness (measurements absent at some visits),
censoring (disenrollment before the dataset end), treatment exposure, and both
binary and time-to-event outcomes.

Everything is synthetic and marked as such; no real patient information.
Dates ship as integer day offsets from the epoch in the manifest. Output is
columnar JSON ({columns, rows, rowCount}) under public/data/omop-demo/.

Usage:  python3 pipeline/generate_omop_dataset.py [--out DIR]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import random
from datetime import date, timedelta

DATASET_VERSION = "1.0.0"
SEED = 20260828
EPOCH = date(2019, 1, 1)
DATA_END = date(2025, 12, 31)
GENERATED = "2026-08-28"

rng = random.Random(SEED)


def day(d: date) -> int:
    return (d - EPOCH).days


DATA_END_DAY = day(DATA_END)

# ---------------------------------------------------------------- concepts ---
# Custom concepts in the OMOP 2-billion range (the CDM convention for local
# vocabularies). Real OMOP standard concept IDs are deliberately NOT claimed —
# the vocabulary is a documented demo subset, not a licensed Athena extract.

C = {
    # gender / race / ethnicity
    "male": 2001000001,
    "female": 2001000002,
    "race_white": 2001000011,
    "race_black": 2001000012,
    "race_asian": 2001000013,
    "race_other": 2001000014,
    "eth_hispanic": 2001000021,
    "eth_not_hispanic": 2001000022,
    # visit types
    "visit_outpatient": 2001000031,
    "visit_inpatient": 2001000032,
    "visit_er": 2001000033,
    # conditions
    "nsclc": 2001000101,
    "nsclc_progression": 2001000102,
    "heart_failure": 2001000111,
    "hf_decompensation": 2001000112,
    "asthma": 2001000121,
    "asthma_severe": 2001000122,
    "asthma_exacerbation": 2001000123,
    "hypertension": 2001000131,
    "t2dm": 2001000132,
    "copd": 2001000133,
    "ckd": 2001000134,
    "cad": 2001000135,
    "obesity": 2001000136,
    "depression": 2001000137,
    "afib": 2001000138,
    # drugs
    "carboplatin": 2001000201,
    "pemetrexed": 2001000202,
    "pembrolizumab_like": 2001000203,
    "docetaxel": 2001000204,
    "acei_arb": 2001000211,
    "beta_blocker": 2001000212,
    "mra": 2001000213,
    "sglt2i": 2001000214,
    "loop_diuretic": 2001000215,
    "ics_laba": 2001000221,
    "ocs_burst": 2001000222,
    "anti_il5_biologic": 2001000223,
    "saba": 2001000224,
    # procedures
    "ct_chest": 2001000301,
    "lung_biopsy": 2001000302,
    "echocardiogram": 2001000303,
    "spirometry": 2001000304,
    # measurements
    "hemoglobin": 2001000401,
    "creatinine": 2001000402,
    "albumin": 2001000403,
    "ntprobnp": 2001000411,
    "lvef": 2001000412,
    "fev1_pct": 2001000421,
    "eos_count": 2001000422,
}

CONCEPT_ROWS = [
    # (id, name, domain, class)
    (C["male"], "Male", "Gender", "Gender"),
    (C["female"], "Female", "Gender", "Gender"),
    (C["race_white"], "White", "Race", "Race"),
    (C["race_black"], "Black or African American", "Race", "Race"),
    (C["race_asian"], "Asian", "Race", "Race"),
    (C["race_other"], "Other race", "Race", "Race"),
    (C["eth_hispanic"], "Hispanic or Latino", "Ethnicity", "Ethnicity"),
    (C["eth_not_hispanic"], "Not Hispanic or Latino", "Ethnicity", "Ethnicity"),
    (C["visit_outpatient"], "Outpatient visit", "Visit", "Visit"),
    (C["visit_inpatient"], "Inpatient visit", "Visit", "Visit"),
    (C["visit_er"], "Emergency room visit", "Visit", "Visit"),
    (C["nsclc"], "Non-small cell lung cancer, advanced (stage IIIB-IV)", "Condition", "Clinical Finding"),
    (C["nsclc_progression"], "Malignant neoplasm progression", "Condition", "Clinical Finding"),
    (C["heart_failure"], "Heart failure with reduced ejection fraction", "Condition", "Clinical Finding"),
    (C["hf_decompensation"], "Acute decompensated heart failure", "Condition", "Clinical Finding"),
    (C["asthma"], "Asthma", "Condition", "Clinical Finding"),
    (C["asthma_severe"], "Severe persistent asthma", "Condition", "Clinical Finding"),
    (C["asthma_exacerbation"], "Asthma exacerbation", "Condition", "Clinical Finding"),
    (C["hypertension"], "Essential hypertension", "Condition", "Clinical Finding"),
    (C["t2dm"], "Type 2 diabetes mellitus", "Condition", "Clinical Finding"),
    (C["copd"], "Chronic obstructive pulmonary disease", "Condition", "Clinical Finding"),
    (C["ckd"], "Chronic kidney disease stage 3+", "Condition", "Clinical Finding"),
    (C["cad"], "Coronary artery disease", "Condition", "Clinical Finding"),
    (C["obesity"], "Obesity", "Condition", "Clinical Finding"),
    (C["depression"], "Major depressive disorder", "Condition", "Clinical Finding"),
    (C["afib"], "Atrial fibrillation", "Condition", "Clinical Finding"),
    (C["carboplatin"], "Carboplatin", "Drug", "Ingredient"),
    (C["pemetrexed"], "Pemetrexed", "Drug", "Ingredient"),
    (C["pembrolizumab_like"], "Anti-PD-1 immunotherapy (pembrolizumab-class)", "Drug", "Ingredient"),
    (C["docetaxel"], "Docetaxel", "Drug", "Ingredient"),
    (C["acei_arb"], "ACE inhibitor / ARB", "Drug", "Drug Class"),
    (C["beta_blocker"], "Beta blocker", "Drug", "Drug Class"),
    (C["mra"], "Mineralocorticoid receptor antagonist", "Drug", "Drug Class"),
    (C["sglt2i"], "SGLT2 inhibitor", "Drug", "Drug Class"),
    (C["loop_diuretic"], "Loop diuretic", "Drug", "Drug Class"),
    (C["ics_laba"], "ICS/LABA combination inhaler", "Drug", "Drug Class"),
    (C["ocs_burst"], "Oral corticosteroid burst", "Drug", "Drug Class"),
    (C["anti_il5_biologic"], "Anti-IL-5 biologic", "Drug", "Drug Class"),
    (C["saba"], "Short-acting beta agonist", "Drug", "Drug Class"),
    (C["ct_chest"], "CT chest with contrast", "Procedure", "Procedure"),
    (C["lung_biopsy"], "Lung biopsy", "Procedure", "Procedure"),
    (C["echocardiogram"], "Transthoracic echocardiogram", "Procedure", "Procedure"),
    (C["spirometry"], "Spirometry", "Procedure", "Procedure"),
    (C["hemoglobin"], "Hemoglobin [g/dL]", "Measurement", "Lab Test"),
    (C["creatinine"], "Serum creatinine [mg/dL]", "Measurement", "Lab Test"),
    (C["albumin"], "Serum albumin [g/dL]", "Measurement", "Lab Test"),
    (C["ntprobnp"], "NT-proBNP [pg/mL]", "Measurement", "Lab Test"),
    (C["lvef"], "Left ventricular ejection fraction [%]", "Measurement", "Imaging Result"),
    (C["fev1_pct"], "FEV1 percent predicted [%]", "Measurement", "Pulmonary Function"),
    (C["eos_count"], "Blood eosinophil count [cells/uL]", "Measurement", "Lab Test"),
]

# Small hierarchy so CONCEPT_ANCESTOR resolves class membership.
ANCESTORS = [
    (C["nsclc"], C["nsclc_progression"]),
    (C["asthma"], C["asthma_severe"]),
    (C["asthma"], C["asthma_exacerbation"]),
    (C["heart_failure"], C["hf_decompensation"]),
]

N_SITES = 40
# Gamma-shaped site sizes: a few large academic centers, a long community tail.
SITE_WEIGHTS = [rng.gammavariate(1.6, 1.0) for _ in range(N_SITES)]
_total_w = sum(SITE_WEIGHTS)
SITE_WEIGHTS = [w / _total_w for w in SITE_WEIGHTS]


def pick_site() -> int:
    x = rng.random()
    acc = 0.0
    for i, w in enumerate(SITE_WEIGHTS):
        acc += w
        if x <= acc:
            return i + 1
    return N_SITES


# ------------------------------------------------------------------ tables ---

person, observation_period, visit_occurrence = [], [], []
condition_occurrence, drug_exposure, procedure_occurrence = [], [], []
measurement, death = [], []

_visit_id = 0


def add_visit(pid: int, concept: int, d: int, site: int) -> int:
    global _visit_id
    if d < 0 or d > DATA_END_DAY:
        return -1
    _visit_id += 1
    visit_occurrence.append([_visit_id, pid, concept, d, site])
    return _visit_id


def add_condition(pid: int, concept: int, d: int, visit: int | None = None):
    if 0 <= d <= DATA_END_DAY:
        condition_occurrence.append([pid, concept, d, visit or 0])


def add_drug(pid: int, concept: int, start: int, end: int):
    if start < 0 or start > DATA_END_DAY:
        return
    drug_exposure.append([pid, concept, start, min(end, DATA_END_DAY)])


def add_procedure(pid: int, concept: int, d: int, visit: int | None = None):
    if 0 <= d <= DATA_END_DAY:
        procedure_occurrence.append([pid, concept, d, visit or 0])


def add_measurement(pid: int, concept: int, d: int, value: float):
    if 0 <= d <= DATA_END_DAY:
        measurement.append([pid, concept, d, round(value, 1)])


def demographics(age_lo: int, age_hi: int, pct_female: float, index_day: int):
    age = rng.randint(age_lo, age_hi)
    yob = (EPOCH + timedelta(days=index_day)).year - age
    sex = C["female"] if rng.random() < pct_female else C["male"]
    r = rng.random()
    race = (
        C["race_white"] if r < 0.68 else C["race_black"] if r < 0.82 else C["race_asian"] if r < 0.93 else C["race_other"]
    )
    eth = C["eth_hispanic"] if rng.random() < 0.12 else C["eth_not_hispanic"]
    return age, yob, sex, race, eth


def observation_window(index_day: int, death_day: int | None) -> tuple[int, int]:
    """Observation period start/end with realistic censoring.

    Start 12-40 months before index (baseline history always available);
    end at death, disenrollment (~9%/yr exponential), or the data end.
    """
    start = max(0, index_day - rng.randint(365, 1200))
    disenroll = index_day + int(rng.expovariate(0.09 / 365.0))
    end = min(DATA_END_DAY, disenroll)
    if death_day is not None:
        end = min(end, death_day)
    end = max(end, min(index_day + 30, DATA_END_DAY))
    return start, end


def sprinkle_comorbidities(pid: int, start: int, index_day: int, pool: list[tuple[int, float]]):
    for concept, p in pool:
        if rng.random() < p:
            d = rng.randint(start, max(start, index_day - 30))
            add_condition(pid, concept, d)


def background_visits(pid: int, site: int, start: int, end: int, per_year: float):
    d = start + rng.randint(0, 200)
    while d < end:
        add_visit(pid, C["visit_outpatient"], d, site)
        d += int(rng.expovariate(per_year / 365.0)) + 14


# ------------------------------------------------------------------- NSCLC ---
# Index dates 2020-01 .. 2024-12 with mild seasonality; overall survival median
# ~14 months; anti-PD-1 exposure (55%) carries an encoded HR ~0.72 vs
# chemo-only; progression median ~5.5 months (PFS proxy).

N_NSCLC = 2600


def gen_nsclc(pid: int):
    index_day = day(date(2020, 1, 1)) + int(rng.random() ** 0.9 * (day(date(2024, 12, 31)) - day(date(2020, 1, 1))))
    age, yob, sex, race, eth = demographics(48, 88, 0.44, index_day)
    site = pick_site()

    io_treated = rng.random() < 0.55
    hr = 0.72 if io_treated else 1.0
    med_os_days = 14 * 30.4 / hr
    os_days = int(rng.expovariate(math.log(2) / med_os_days)) + 20
    death_day = index_day + os_days
    pfs_days = min(int(rng.expovariate(math.log(2) / (5.5 * 30.4 / hr))) + 15, os_days - 5)

    start, end = observation_window(index_day, death_day)
    died = death_day <= end

    person.append([pid, sex, yob, race, eth, site])
    observation_period.append([pid, start, end])

    # Diagnosis: biopsy + CT around index.
    v = add_visit(pid, C["visit_outpatient"], index_day, site)
    add_condition(pid, C["nsclc"], index_day, v)
    add_procedure(pid, C["ct_chest"], max(start, index_day - rng.randint(7, 21)))
    add_procedure(pid, C["lung_biopsy"], index_day - rng.randint(0, 10))

    sprinkle_comorbidities(
        pid, start, index_day,
        [(C["copd"], 0.38), (C["hypertension"], 0.52), (C["cad"], 0.2), (C["t2dm"], 0.22), (C["depression"], 0.14)],
    )
    background_visits(pid, site, start, index_day, 3.0)

    # Treatment: platinum doublet from ~index+14, 21-day cycles until
    # progression + 1 cycle; IO layered for io_treated patients.
    tx_start = index_day + rng.randint(10, 30)
    cycles = max(2, min(int((pfs_days - 14) / 21) + 1, 24))
    add_drug(pid, C["carboplatin"], tx_start, tx_start + min(cycles, 4) * 21)
    add_drug(pid, C["pemetrexed"], tx_start, tx_start + cycles * 21)
    if io_treated:
        add_drug(pid, C["pembrolizumab_like"], tx_start, tx_start + cycles * 21)

    cutoff = min(end, death_day - 3)
    for k in range(cycles):
        d = tx_start + k * 21 + rng.randint(-2, 2)
        if d > cutoff:
            break
        v = add_visit(pid, C["visit_outpatient"], d, site)
        # Labs at treatment visits, with missingness.
        if rng.random() < 0.78:
            add_measurement(pid, C["hemoglobin"], d, rng.gauss(11.6, 1.5))
        if rng.random() < 0.74:
            add_measurement(pid, C["creatinine"], d, max(0.4, rng.gauss(1.0, 0.3)))
        if rng.random() < 0.55:
            add_measurement(pid, C["albumin"], d, rng.gauss(3.6, 0.5))

    # Imaging every ~6 weeks on treatment.
    d = tx_start + 42
    while d < min(cutoff, tx_start + pfs_days + 60):
        add_procedure(pid, C["ct_chest"], d)
        d += 42 + rng.randint(-5, 5)

    # Progression event, second line for some, follow-up visits.
    prog_day = index_day + pfs_days
    if prog_day <= cutoff:
        v = add_visit(pid, C["visit_outpatient"], prog_day, site)
        add_condition(pid, C["nsclc_progression"], prog_day, v)
        if rng.random() < 0.45:
            add_drug(pid, C["docetaxel"], prog_day + rng.randint(7, 28), prog_day + rng.randint(60, 180))
    d = prog_day + 63
    while d < cutoff:
        add_visit(pid, C["visit_outpatient"], d, site)
        d += 63 + rng.randint(-7, 7)

    if died:
        if rng.random() < 0.5:
            add_visit(pid, C["visit_inpatient"], max(start, death_day - rng.randint(2, 14)), site)
        death.append([pid, death_day])


# ----------------------------------------------------------- heart failure ---
# Binary outcome: HF hospitalization within 12 months of index (~28% overall;
# SGLT2i users encoded lower). Continuous NT-proBNP / LVEF.

N_HF = 3100


def gen_hf(pid: int):
    index_day = day(date(2020, 1, 1)) + rng.randint(0, day(date(2024, 6, 30)) - day(date(2020, 1, 1)))
    age, yob, sex, race, eth = demographics(50, 90, 0.41, index_day)
    site = pick_site()

    on_sglt2i = rng.random() < 0.42
    hosp_rate_yr = 0.24 if on_sglt2i else 0.38  # exponential first-event rates
    death_day = index_day + int(rng.expovariate(0.085 / 365.0)) + 30

    start, end = observation_window(index_day, death_day)
    died = death_day <= end

    person.append([pid, sex, yob, race, eth, site])
    observation_period.append([pid, start, end])

    v = add_visit(pid, C["visit_outpatient"], index_day, site)
    add_condition(pid, C["heart_failure"], index_day, v)
    add_procedure(pid, C["echocardiogram"], index_day + rng.randint(0, 21))
    add_measurement(pid, C["lvef"], index_day + rng.randint(0, 21), rng.gauss(31, 6))

    sprinkle_comorbidities(
        pid, start, index_day,
        [(C["hypertension"], 0.72), (C["t2dm"], 0.42), (C["cad"], 0.48), (C["ckd"], 0.3),
         (C["afib"], 0.32), (C["obesity"], 0.34), (C["copd"], 0.18)],
    )
    background_visits(pid, site, start, index_day, 2.2)

    # Guideline meds as long eras from index.
    for concept, p in [(C["acei_arb"], 0.84), (C["beta_blocker"], 0.88), (C["mra"], 0.46), (C["loop_diuretic"], 0.7)]:
        if rng.random() < p:
            add_drug(pid, concept, index_day + rng.randint(0, 14), end)
    if on_sglt2i:
        add_drug(pid, C["sglt2i"], index_day + rng.randint(0, 30), end)

    # Quarterly follow-up with NT-proBNP (missingness), annual echo.
    d = index_day + 90
    while d < end:
        v = add_visit(pid, C["visit_outpatient"], d, site)
        if rng.random() < 0.62:
            base = 2400 if not on_sglt2i else 1900
            add_measurement(pid, C["ntprobnp"], d, max(120, rng.lognormvariate(math.log(base), 0.55)))
        if rng.random() < 0.55:
            add_measurement(pid, C["creatinine"], d, max(0.5, rng.gauss(1.25, 0.4)))
        d += 90 + rng.randint(-10, 10)
    d = index_day + 365
    while d < end:
        add_procedure(pid, C["echocardiogram"], d)
        add_measurement(pid, C["lvef"], d, rng.gauss(33, 7))
        d += 365

    # Hospitalization events (recurrent, thinning after the first).
    hosp_day = index_day + int(rng.expovariate(hosp_rate_yr / 365.0))
    n_hosp = 0
    while hosp_day < min(end, death_day) and n_hosp < 4:
        v = add_visit(pid, C["visit_inpatient"], hosp_day, site)
        add_condition(pid, C["hf_decompensation"], hosp_day, v)
        n_hosp += 1
        hosp_day += int(rng.expovariate(hosp_rate_yr * 1.3 / 365.0)) + 21

    if died:
        death.append([pid, death_day])


# ------------------------------------------------------------------ asthma ---
# Continuous FEV1 % predicted (~61, SD 13 in the severe-eosinophilic subset);
# exacerbation events ~1.1/yr, biologic users encoded lower (~0.65/yr).

N_ASTHMA = 3100


def gen_asthma(pid: int):
    index_day = day(date(2020, 1, 1)) + rng.randint(0, day(date(2024, 12, 31)) - day(date(2020, 1, 1)))
    age, yob, sex, race, eth = demographics(18, 75, 0.62, index_day)
    site = pick_site()

    severe = rng.random() < 0.55
    eos_high = severe and rng.random() < 0.6
    on_biologic = eos_high and rng.random() < 0.35
    exac_rate_yr = (0.65 if on_biologic else 1.15) if severe else 0.35

    start, end = observation_window(index_day, None)
    died = rng.random() < 0.004
    death_day = index_day + rng.randint(200, 1400) if died else None
    if death_day is not None:
        end = min(end, death_day)

    person.append([pid, sex, yob, race, eth, site])
    observation_period.append([pid, start, end])

    v = add_visit(pid, C["visit_outpatient"], index_day, site)
    add_condition(pid, C["asthma"], index_day, v)
    if severe:
        add_condition(pid, C["asthma_severe"], index_day + rng.randint(0, 60), v)

    sprinkle_comorbidities(
        pid, start, index_day,
        [(C["obesity"], 0.3), (C["depression"], 0.18), (C["hypertension"], 0.24)],
    )
    background_visits(pid, site, start, index_day, 1.6)

    add_drug(pid, C["ics_laba"], index_day, end)
    add_drug(pid, C["saba"], index_day, end)
    if on_biologic:
        add_drug(pid, C["anti_il5_biologic"], index_day + rng.randint(30, 180), end)

    fev1_base = rng.gauss(61 if severe else 74, 13 if severe else 10)
    eos_base = rng.lognormvariate(math.log(420 if eos_high else 160), 0.5)

    # Six-monthly reviews with spirometry (missingness) + baseline/annual eos.
    d = index_day
    k = 0
    while d < end:
        v = add_visit(pid, C["visit_outpatient"], d, site)
        if rng.random() < 0.8:
            drift = 0.6 * k * (0.5 if on_biologic else 1.0)
            add_measurement(pid, C["fev1_pct"], d, max(25, fev1_base - drift + rng.gauss(0, 4)))
            if rng.random() < 0.65:
                add_procedure(pid, C["spirometry"], d, v)
        if k % 2 == 0 and rng.random() < 0.7:
            add_measurement(pid, C["eos_count"], d, max(20, eos_base * (0.45 if (on_biologic and k > 0) else 1.0) + rng.gauss(0, 40)))
        k += 1
        d += 182 + rng.randint(-21, 21)

    # Exacerbations: ER or urgent visit + OCS burst.
    d = index_day + int(rng.expovariate(exac_rate_yr / 365.0))
    while d < end:
        v = add_visit(pid, C["visit_er"] if rng.random() < 0.4 else C["visit_outpatient"], d, site)
        add_condition(pid, C["asthma_exacerbation"], d, v)
        add_drug(pid, C["ocs_burst"], d, d + rng.randint(5, 14))
        d += int(rng.expovariate(exac_rate_yr / 365.0)) + 14

    if died and death_day is not None:
        death.append([pid, death_day])


# -------------------------------------------------------------- background ---

N_BACKGROUND = 2000


def gen_background(pid: int):
    index_day = rng.randint(0, day(date(2024, 12, 31)))
    age, yob, sex, race, eth = demographics(18, 85, 0.52, index_day)
    site = pick_site()
    start, end = observation_window(index_day, None)
    person.append([pid, sex, yob, race, eth, site])
    observation_period.append([pid, start, end])
    sprinkle_comorbidities(
        pid, start, min(end, start + 400),
        [(C["hypertension"], 0.28), (C["t2dm"], 0.12), (C["obesity"], 0.22), (C["depression"], 0.1)],
    )
    background_visits(pid, site, start, end, 1.8)
    if rng.random() < 0.015:
        death.append([pid, rng.randint(min(start + 100, end), end)])


# ------------------------------------------------------- cohort definitions ---
# Definitions are applied over the generated tables (not tagged at generation),
# so the materialized COHORT rows genuinely come from the definition logic.

COHORT_DEFS = [
    {
        "cohort_definition_id": 101,
        "cohort_definition_name": "Advanced NSCLC, first diagnosis",
        "logic": "First CONDITION_OCCURRENCE of advanced NSCLC; age >= 18 at index; >= 365 days of observation before index. Cohort end = observation period end.",
        "index_concept": C["nsclc"],
    },
    {
        "cohort_definition_id": 102,
        "cohort_definition_name": "Advanced NSCLC on anti-PD-1 immunotherapy",
        "logic": "Members of cohort 101 with an anti-PD-1 DRUG_EXPOSURE starting within 90 days after index.",
        "index_concept": C["nsclc"],
    },
    {
        "cohort_definition_id": 103,
        "cohort_definition_name": "Advanced NSCLC, chemotherapy without anti-PD-1",
        "logic": "Members of cohort 101 with platinum-doublet exposure and no anti-PD-1 DRUG_EXPOSURE within 90 days after index.",
        "index_concept": C["nsclc"],
    },
    {
        "cohort_definition_id": 201,
        "cohort_definition_name": "Heart failure (HFrEF), first diagnosis",
        "logic": "First CONDITION_OCCURRENCE of heart failure; age >= 18; >= 365 days pre-index observation.",
        "index_concept": C["heart_failure"],
    },
    {
        "cohort_definition_id": 301,
        "cohort_definition_name": "Severe asthma, first diagnosis",
        "logic": "First CONDITION_OCCURRENCE of severe persistent asthma; age >= 18; >= 365 days pre-index observation.",
        "index_concept": C["asthma_severe"],
    },
    {
        "cohort_definition_id": 302,
        "cohort_definition_name": "Severe eosinophilic asthma",
        "logic": "Members of cohort 301 with a blood eosinophil MEASUREMENT >= 300 cells/uL in the 365 days around index.",
        "index_concept": C["asthma_severe"],
    },
]


def materialize_cohorts():
    obs = {r[0]: (r[1], r[2]) for r in observation_period}
    yob = {r[0]: r[2] for r in person}

    first_dx: dict[int, dict[int, int]] = {}
    for pid, concept, d, _v in condition_occurrence:
        by = first_dx.setdefault(concept, {})
        if pid not in by or d < by[pid]:
            by[pid] = d

    def base_cohort(index_concept: int) -> dict[int, int]:
        out = {}
        for pid, idx in first_dx.get(index_concept, {}).items():
            start, end = obs[pid]
            index_year = (EPOCH + timedelta(days=idx)).year
            if idx - start >= 365 and index_year - yob[pid] >= 18 and idx <= end:
                out[pid] = idx
        return out

    drug_start: dict[int, dict[int, int]] = {}
    for pid, concept, s, _e in drug_exposure:
        by = drug_start.setdefault(concept, {})
        if pid not in by or s < by[pid]:
            by[pid] = s

    eos_by_pid: dict[int, list[tuple[int, float]]] = {}
    for pid, concept, d, v in measurement:
        if concept == C["eos_count"]:
            eos_by_pid.setdefault(pid, []).append((d, v))

    nsclc = base_cohort(C["nsclc"])
    hf = base_cohort(C["heart_failure"])
    severe_asthma = base_cohort(C["asthma_severe"])

    io = drug_start.get(C["pembrolizumab_like"], {})
    platinum = drug_start.get(C["carboplatin"], {})

    members: dict[int, dict[int, int]] = {
        101: nsclc,
        102: {p: i for p, i in nsclc.items() if p in io and 0 <= io[p] - i <= 90},
        103: {p: i for p, i in nsclc.items() if p in platinum and not (p in io and 0 <= io[p] - i <= 90)},
        201: hf,
        301: severe_asthma,
        302: {
            p: i
            for p, i in severe_asthma.items()
            if any(abs(d - i) <= 365 and v >= 300 for d, v in eos_by_pid.get(p, []))
        },
    }

    cohort_rows = []
    for cid, mem in members.items():
        for pid in sorted(mem):
            idx = mem[pid]
            cohort_rows.append([cid, pid, idx, obs[pid][1]])
    return cohort_rows, {cid: len(mem) for cid, mem in members.items()}


# ------------------------------------------------------------------- write ---


def columnar(columns: list[str], rows: list[list]) -> dict:
    return {"columns": columns, "rows": rows, "rowCount": len(rows)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "public", "data", "omop-demo"))
    args = ap.parse_args()
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)

    pid = 0
    for _ in range(N_NSCLC):
        pid += 1
        gen_nsclc(pid)
    for _ in range(N_HF):
        pid += 1
        gen_hf(pid)
    for _ in range(N_ASTHMA):
        pid += 1
        gen_asthma(pid)
    for _ in range(N_BACKGROUND):
        pid += 1
        gen_background(pid)

    cohort_rows, cohort_counts = materialize_cohorts()

    tables = {
        "concept": columnar(
            ["concept_id", "concept_name", "domain_id", "concept_class_id", "vocabulary_id"],
            [[i, n, d, c, "TWEED-DEMO"] for i, n, d, c in CONCEPT_ROWS],
        ),
        "concept_ancestor": columnar(
            ["ancestor_concept_id", "descendant_concept_id"], [list(a) for a in ANCESTORS]
        ),
        "person": columnar(
            ["person_id", "gender_concept_id", "year_of_birth", "race_concept_id", "ethnicity_concept_id", "care_site_id"],
            person,
        ),
        "observation_period": columnar(
            ["person_id", "observation_period_start_day", "observation_period_end_day"], observation_period
        ),
        "visit_occurrence": columnar(
            ["visit_occurrence_id", "person_id", "visit_concept_id", "visit_start_day", "care_site_id"],
            visit_occurrence,
        ),
        "condition_occurrence": columnar(
            ["person_id", "condition_concept_id", "condition_start_day", "visit_occurrence_id"], condition_occurrence
        ),
        "drug_exposure": columnar(
            ["person_id", "drug_concept_id", "drug_exposure_start_day", "drug_exposure_end_day"], drug_exposure
        ),
        "procedure_occurrence": columnar(
            ["person_id", "procedure_concept_id", "procedure_day", "visit_occurrence_id"], procedure_occurrence
        ),
        "measurement": columnar(
            ["person_id", "measurement_concept_id", "measurement_day", "value_as_number"], measurement
        ),
        "death": columnar(["person_id", "death_day"], death),
        "cohort": columnar(
            ["cohort_definition_id", "subject_id", "cohort_start_day", "cohort_end_day"], cohort_rows
        ),
        "cohort_definition": columnar(
            ["cohort_definition_id", "cohort_definition_name", "cohort_definition_logic", "index_concept_id"],
            [[d["cohort_definition_id"], d["cohort_definition_name"], d["logic"], d["index_concept"]] for d in COHORT_DEFS],
        ),
    }

    file_hashes = {}
    for name, table in tables.items():
        payload = json.dumps(table, separators=(",", ":"))
        with open(os.path.join(out, f"{name}.json"), "w") as f:
            f.write(payload)
        file_hashes[name] = hashlib.sha256(payload.encode()).hexdigest()[:16]

    manifest = {
        "datasetId": "tweed-omop-demo",
        "datasetVersion": DATASET_VERSION,
        "cdm": "OMOP CDM v5.4 (demo subset; dates as integer day offsets)",
        "epoch": EPOCH.isoformat(),
        "dataEnd": DATA_END.isoformat(),
        "generated": GENERATED,
        "seed": SEED,
        "synthetic": True,
        "separateFrom": "public/data/trial-corpus (the protocol/operations corpus) — independent asset, independent versioning",
        "personCount": len(person),
        "tables": {name: t["rowCount"] for name, t in tables.items()},
        "cohortCounts": cohort_counts,
        "fileHashes": file_hashes,
        "caveat": "Entirely synthetic RWD generated for demonstration. No real patient information. Not fit for clinical, regulatory, or operational decisions.",
    }
    with open(os.path.join(out, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)

    total_mb = sum(
        os.path.getsize(os.path.join(out, f"{n}.json")) for n in tables
    ) / 1e6
    print(f"persons={len(person)} visits={len(visit_occurrence)} measurements={len(measurement)}")
    print(f"conditions={len(condition_occurrence)} drugs={len(drug_exposure)} procedures={len(procedure_occurrence)} deaths={len(death)}")
    print("cohorts:", cohort_counts)
    print(f"wrote {out} ({total_mb:.1f} MB)")


if __name__ == "__main__":
    main()
