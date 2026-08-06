"""
v0.2 sensitivity layer for the synthetic trial corpus.

The PRD reframes the strategist around pressure-testing an already-drafted design
document: the user selects an element, asks what happens if it changes, and the
strategist runs a sensitivity analysis against operational history. That analysis
cannot be numbers the model invents — every figure has to trace to a corpus
parameter. This module supplies those parameters and the pre-drafted hero brief.

Four artefacts, all deterministic (pure formulas, no RNG — the arithmetic is the
point and must be stable and inspectable):

  procedure_operations.json   one row per (procedure x site type): scheduling lag,
                              in-house availability, patient refusal, unit cost,
                              staffing dependency. Carries UC2 (added-procedure
                              sensitivity) and UC4 (site-level second-order cut).
  assessment_operations.json  one row per assessment: data volume, site data-entry
                              load, query/cleaning lag, monitoring burden, and the
                              endpoint domain it serves. Carries UC3 (added
                              secondary-endpoint sensitivity).
  amendment_economics         per-amendment timing (months from FPI) and cost, the
                              ~$500K framing, merged into description_of_change.
  design_brief.json           the near-final Phase 2 second-line metastatic NSCLC
                              design brief the demo opens on, with selectable
                              elements and a GI-comorbidity eligibility angle so the
                              hero endoscopy what-if has an obvious hook.

Everything here is synthetic and labelled as such. Numbers are plausible, not
benchmarked; if real WCG operational data arrives, recalibrate the base profiles.
"""

# --------------------------------------------------------------------------
# Procedure operations.
#
# Base profile per procedure, then a per-site-type modifier. A row is emitted
# for every (procedure, site type) pair. The values a sensitivity analysis reads
# — how long a procedure takes to schedule, how many sites can do it in-house,
# how many patients refuse it, what it costs — live here, not in the model.
# --------------------------------------------------------------------------

# base_lag: median days from order to completed procedure at a capable site.
# base_avail: share of sites (of an average type) that can perform it in-house.
# base_refusal: share of eligible patients who decline the procedure.
# unit_cost: fully-loaded per-patient cost (procedure + read + coordinator time).
PROCEDURE_OPS_BASE = {
    # Hero-critical: the GI-verification procedure and its two softer alternatives.
    "Upper gastrointestinal endoscopy (EGD)": dict(
        invasiveness="Procedure (Highly Invasive)", base_lag=19, base_avail=0.58,
        base_refusal=0.12, unit_cost=1850, staffing="GI / endoscopy suite + anesthesia"),
    "Central read of existing cross-sectional imaging": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=4, base_avail=0.62,
        base_refusal=0.01, unit_cost=420, staffing="Imaging core lab"),
    "Records retrieval of prior endoscopy (within 6 months)": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=9, base_avail=0.75,
        base_refusal=0.02, unit_cost=260, staffing="Site coordinator + medical records"),
    # Oncology imaging and tissue.
    "Computed tomography (CT) with contrast": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=7, base_avail=0.88,
        base_refusal=0.03, unit_cost=780, staffing="Radiology"),
    "Magnetic resonance imaging (MRI)": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=11, base_avail=0.71,
        base_refusal=0.05, unit_cost=1150, staffing="Radiology"),
    "Positron emission tomography (PET) scan": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=14, base_avail=0.49,
        base_refusal=0.04, unit_cost=1980, staffing="Nuclear medicine + radiotracer supply"),
    "Tumor biopsy": dict(
        invasiveness="Procedure (Highly Invasive)", base_lag=16, base_avail=0.64,
        base_refusal=0.14, unit_cost=2100, staffing="Interventional radiology / surgery + pathology"),
    "Bronchoscopy with bronchoalveolar lavage": dict(
        invasiveness="Procedure (Highly Invasive)", base_lag=21, base_avail=0.44,
        base_refusal=0.16, unit_cost=2450, staffing="Interventional pulmonology + anesthesia"),
    "Bone marrow aspirate and biopsy": dict(
        invasiveness="Procedure (Highly Invasive)", base_lag=12, base_avail=0.67,
        base_refusal=0.13, unit_cost=1350, staffing="Hematology / oncology"),
    "Echocardiogram (ECHO)": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=8, base_avail=0.82,
        base_refusal=0.02, unit_cost=560, staffing="Cardiology / sonography"),
    "Multigated acquisition (MUGA) scan": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=13, base_avail=0.41,
        base_refusal=0.04, unit_cost=890, staffing="Nuclear medicine"),
    "Circulating tumor DNA (ctDNA) sampling": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=6, base_avail=0.55,
        base_refusal=0.03, unit_cost=1250, staffing="Central specialty lab"),
    "Tumor tissue biomarker / PD-L1 testing (archival or fresh)": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=15, base_avail=0.6,
        base_refusal=0.06, unit_cost=1420, staffing="Pathology + central biomarker lab"),
    "Pharmacokinetic blood sampling": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=2, base_avail=0.93,
        base_refusal=0.05, unit_cost=210, staffing="Site nursing + central lab"),
    # Common assessments (low-friction floor, so scenarios have context).
    "Hematology panel": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=1, base_avail=0.98,
        base_refusal=0.01, unit_cost=45, staffing="Site phlebotomy + local lab"),
    "Serum chemistry panel": dict(
        invasiveness="Procedure (Minimally Invasive)", base_lag=1, base_avail=0.98,
        base_refusal=0.01, unit_cost=48, staffing="Site phlebotomy + local lab"),
    "12-lead electrocardiogram (ECG)": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=1, base_avail=0.97,
        base_refusal=0.01, unit_cost=95, staffing="Site nursing"),
    "Spirometry": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=3, base_avail=0.79,
        base_refusal=0.02, unit_cost=140, staffing="Pulmonary function tech"),
    "6-minute walk test": dict(
        invasiveness="Procedure (Non - Invasive)", base_lag=2, base_avail=0.85,
        base_refusal=0.03, unit_cost=120, staffing="Site nursing"),
}

# Per-site-type modifiers. lag_x / cost_x scale the base; avail_x scales
# availability (clamped to <=0.99); refusal_add shifts refusal by an absolute
# amount. Community and safety-net sites schedule slower, have less in-house
# capability, and see higher refusal; academic centres are the reference.
SITE_TYPE_OPS = {
    "Academic Medical Center":      dict(lag_x=0.85, avail_x=1.25, refusal_add=-0.01, cost_x=1.15),
    "Dedicated Research Site":      dict(lag_x=0.80, avail_x=1.05, refusal_add=-0.02, cost_x=1.00),
    "Community Hospital":           dict(lag_x=1.35, avail_x=0.70, refusal_add=+0.03, cost_x=0.90),
    "Private Practice":             dict(lag_x=1.45, avail_x=0.55, refusal_add=+0.02, cost_x=0.95),
    "Safety-Net / Public Hospital": dict(lag_x=1.70, avail_x=0.50, refusal_add=+0.05, cost_x=0.80),
}

PROCEDURE_OPS_COLUMNS = [
    "procedure_name", "invasiveness_classification", "site_type",
    "scheduling_lag_days", "in_house_availability_pct", "patient_refusal_rate",
    "unit_cost_usd", "staffing_dependency",
]


def build_procedure_operations():
    """One row per (procedure, site type). Pure formula, fully deterministic."""
    rows = []
    for proc, base in PROCEDURE_OPS_BASE.items():
        for st, mod in SITE_TYPE_OPS.items():
            lag = round(base["base_lag"] * mod["lag_x"])
            avail = min(0.99, round(base["base_avail"] * mod["avail_x"], 2))
            refusal = max(0.0, round(base["base_refusal"] + mod["refusal_add"], 3))
            cost = int(round(base["unit_cost"] * mod["cost_x"] / 5.0) * 5)
            rows.append([
                proc, base["invasiveness"], st, lag, avail, refusal, cost, base["staffing"],
            ])
    return rows


# --------------------------------------------------------------------------
# Assessment operations.
#
# Adding a secondary endpoint is not free: it lands as visits and procedures,
# generates data that has to be entered, cleaned, and queried, and pushes the
# database-lock date. This table maps an assessment to that downstream burden.
# --------------------------------------------------------------------------

# fields: distinct CRF data points captured per timepoint.
# entry_min: site data-entry minutes per timepoint.
# query_lag_days: median days a query on this data stays open before resolution.
# monitor_min: monitoring minutes per timepoint (SDV).
# lock_days: typical contribution to time-to-database-lock if this is on the
#            critical path (rough, additive at the margin).
ASSESSMENT_OPS_BASE = {
    "Objective response rate (ORR) per RECIST v1.1": dict(
        domain="Effectiveness", fields=28, entry_min=35, query_lag_days=12,
        monitor_min=25, lock_days=18, requires="Central imaging read + BICR adjudication"),
    "Progression-free survival (PFS) per RECIST v1.1": dict(
        domain="Effectiveness", fields=22, entry_min=30, query_lag_days=14,
        monitor_min=22, lock_days=26, requires="Central imaging read at every timepoint"),
    "Overall survival (OS)": dict(
        domain="Effectiveness", fields=6, entry_min=8, query_lag_days=6,
        monitor_min=6, lock_days=8, requires="Survival follow-up contact"),
    "Duration of response (DoR)": dict(
        domain="Effectiveness", fields=10, entry_min=12, query_lag_days=10,
        monitor_min=9, lock_days=12, requires="Derived from ORR/PFS imaging"),
    "Patient-reported outcomes (EORTC QLQ-C30)": dict(
        domain="QoL", fields=30, entry_min=18, query_lag_days=9,
        monitor_min=10, lock_days=10, requires="ePRO device + translated instruments"),
    "Circulating tumor DNA (ctDNA) dynamics": dict(
        domain="Exploratory", fields=16, entry_min=20, query_lag_days=16,
        monitor_min=14, lock_days=22, requires="Central specialty lab + assay validation"),
    "Pharmacokinetic exposure (Cmax, AUC)": dict(
        domain="Pharmacokinetics", fields=24, entry_min=26, query_lag_days=11,
        monitor_min=18, lock_days=14, requires="Dense PK sampling + bioanalytical lab"),
    "Anti-drug antibody (immunogenicity)": dict(
        domain="Safety", fields=12, entry_min=14, query_lag_days=13,
        monitor_min=11, lock_days=12, requires="Tiered ADA assay"),
    "Healthcare resource utilization": dict(
        domain="Health Economics", fields=20, entry_min=16, query_lag_days=8,
        monitor_min=8, lock_days=7, requires="Site chart abstraction"),
    "Treatment-emergent adverse events (CTCAE v5.0)": dict(
        domain="Safety", fields=34, entry_min=28, query_lag_days=10,
        monitor_min=20, lock_days=12, requires="Ongoing safety review"),
}

ASSESSMENT_OPS_COLUMNS = [
    "assessment_name", "endpoint_domain", "crf_data_points", "site_entry_minutes",
    "query_resolution_lag_days", "monitoring_minutes", "db_lock_contribution_days",
    "operational_requirement",
]


def build_assessment_operations():
    rows = []
    for name, b in ASSESSMENT_OPS_BASE.items():
        rows.append([
            name, b["domain"], b["fields"], b["entry_min"], b["query_lag_days"],
            b["monitor_min"], b["lock_days"], b["requires"],
        ])
    return rows


# --------------------------------------------------------------------------
# Amendment economics. The PRD wants every amendment to carry the ~$500K framing
# and a timing (months from first-patient-in), so the amendment-risk sweep
# resolves to patients, months, and dollars like everything else.
# --------------------------------------------------------------------------

# Cost and typical timing depend on what the amendment touches. Eligibility and
# SoA amendments are the expensive, mid-flight ones the encoded signal produces.
AMENDMENT_COST_BY_TYPE = {
    "Eligibility Criteria Change": dict(cost=535000, month=7.5),
    "Schedule of Assessments Change": dict(cost=610000, month=9.0),
    "Endpoint Change": dict(cost=720000, month=8.5),
    "Statistical Analysis Plan Change": dict(cost=340000, month=11.0),
    "Dosing Regimen Change": dict(cost=580000, month=6.5),
    "Safety Update": dict(cost=290000, month=5.0),
    "Administrative Change": dict(cost=120000, month=4.0),
    "Study Design Change": dict(cost=780000, month=8.0),
}
_AMENDMENT_COST_DEFAULT = dict(cost=430000, month=7.0)


def amendment_economics(amendment_type, index, jitter_key):
    """Deterministic per-amendment cost and timing. `jitter_key` (an int derived
    from protocol id + amendment number) spreads values a little without RNG."""
    base = AMENDMENT_COST_BY_TYPE.get(amendment_type, _AMENDMENT_COST_DEFAULT)
    # Spread cost by +/- ~12% and timing by a few months, deterministically.
    cost_shift = ((jitter_key % 25) - 12) / 100.0
    month_shift = ((jitter_key // 25) % 9) - 4
    cost = int(round(base["cost"] * (1 + cost_shift) / 1000.0)) * 1000
    month = round(max(1.0, base["month"] + month_shift * 0.6 + index * 1.5), 1)
    return cost, month


# --------------------------------------------------------------------------
# The hero design brief. Near-final Phase 2 second-line metastatic NSCLC, with
# the GI-comorbidity eligibility angle deliberately underspecified so the
# endoscopy what-if (UC2) has an obvious place to land.
#
# Operational numbers are NOT baked in here — the sensitivity engine recomputes
# them from procedure_operations against the brief's site mix. Screen-fail
# attribution percentages ARE carried, because they are the waterfall (UC1) and
# they read off the corpus criterion statistics at build time.
# --------------------------------------------------------------------------

def build_design_brief():
    return {
        "brief_id": "NSCLC-2L-DESIGN-BRIEF",
        "title": "Phase 2 Study of TCX-LUNG in Second-Line Metastatic NSCLC — Design Brief (Draft)",
        "status": "Draft for pressure-testing — pre-synopsis",
        "synthetic": True,
        "therapeutic_area": "Oncology",
        "disease_area": "Thoracic Oncology",
        "indication": "Advanced Non-Small Cell Lung Cancer",
        "line_of_treatment": "Second Line",
        "phase": "2",
        # Comparator basis the strategist's tools filter to when benchmarking.
        "comparator_cohort": {"therapeutic_area": "Oncology", "phase": ["2", "2/3"]},
        "target_enrollment": 180,
        "planned_sites": 48,
        # Site mix the sensitivity engine weights procedure operations against.
        "site_mix": {
            "Academic Medical Center": 0.42,
            "Dedicated Research Site": 0.20,
            "Community Hospital": 0.24,
            "Private Practice": 0.10,
            "Safety-Net / Public Hospital": 0.04,
        },
        "arms": [
            {"id": "arm-exp", "name": "Arm A — TCX-LUNG + investigator's-choice chemotherapy"},
            {"id": "arm-ctrl", "name": "Arm B — Investigator's-choice chemotherapy"},
        ],
        "randomization": "1:1, stratified by prior PD-(L)1 exposure and ECOG status",
        "primary_endpoint": {
            "id": "ep-primary",
            "text": "Progression-free survival (PFS) per RECIST v1.1 by blinded independent central review",
            "assessment": "Progression-free survival (PFS) per RECIST v1.1",
        },
        "secondary_endpoints": [
            {"id": "ep-orr", "text": "Objective response rate (ORR) per RECIST v1.1",
             "assessment": "Objective response rate (ORR) per RECIST v1.1", "status": "included"},
            {"id": "ep-os", "text": "Overall survival (OS)",
             "assessment": "Overall survival (OS)", "status": "included"},
            {"id": "ep-safety", "text": "Incidence of treatment-emergent adverse events (CTCAE v5.0)",
             "assessment": "Treatment-emergent adverse events (CTCAE v5.0)", "status": "included"},
        ],
        # Candidate additions the client can pressure-test in UC3.
        "candidate_secondary_endpoints": [
            {"id": "cand-qol", "text": "Patient-reported outcomes (EORTC QLQ-C30)",
             "assessment": "Patient-reported outcomes (EORTC QLQ-C30)"},
            {"id": "cand-ctdna", "text": "ctDNA dynamics as an early efficacy signal",
             "assessment": "Circulating tumor DNA (ctDNA) dynamics"},
            {"id": "cand-pk", "text": "PK exposure–response",
             "assessment": "Pharmacokinetic exposure (Cmax, AUC)"},
        ],
        # Eligibility elements. attribution_pct is filled at build time from the
        # corpus; the GI-comorbidity criterion is the underspecified hook.
        "criteria": [
            {"id": "cri-histology", "type": "Inclusion", "category": "Diagnosis",
             "text": "Histologically or cytologically confirmed metastatic NSCLC",
             "corpus_criterion": "Histologically or cytologically confirmed diagnosis"},
            {"id": "cri-priorline", "type": "Inclusion",
             "category": "Prior/Concurrent treatment (e.g. line of therapy)",
             "text": "Progression on or after exactly one prior line of platinum-based therapy",
             "corpus_criterion": "Prior lines of systemic therapy"},
            {"id": "cri-ecog", "type": "Inclusion", "category": "Procedural Values",
             "text": "ECOG performance status 0–1",
             "corpus_criterion": "Eastern Cooperative Oncology Group (ECOG) performance status"},
            {"id": "cri-measurable", "type": "Inclusion", "category": "Diagnosis",
             "text": "Measurable disease per RECIST v1.1",
             "corpus_criterion": "Measurable disease per RECIST v1.1"},
            {"id": "cri-organ", "type": "Inclusion", "category": "Lab Values",
             "text": "Adequate organ and marrow function",
             "corpus_criterion": "Adequate organ and marrow function"},
            {"id": "cri-gi", "type": "Inclusion", "category": "Comorbidities",
             "text": "Documented absence of active gastrointestinal disease that would impair "
                     "oral therapy absorption — verification method NOT YET SPECIFIED",
             "corpus_criterion": "Clinically significant gastrointestinal disease",
             "hero_hook": True,
             "open_question": "Medical wants objective GI verification. How do we confirm it "
                              "without wrecking the enrollment timeline?"},
            {"id": "cri-cns", "type": "Exclusion", "category": "Medical History",
             "text": "Untreated central nervous system metastases",
             "corpus_criterion": "Untreated central nervous system metastases"},
            {"id": "cri-egfr", "type": "Exclusion", "category": "Lab Values",
             "text": "Estimated glomerular filtration rate (eGFR) below protocol floor",
             "corpus_criterion": "Estimated glomerular filtration rate (eGFR)"},
        ],
        "soa_sketch": [
            "Screening (Day −28 to −1): consent, imaging, tissue/biomarker, labs, ECG",
            "Treatment (21-day cycles): dosing, safety labs, AE review, PK (Arm A, C1–C2)",
            "Tumor assessment: CT with contrast every 6 weeks through Week 48, then every 9 weeks",
            "End of treatment + 30-day safety follow-up; survival follow-up every 9 weeks",
        ],
        "disclaimer": "Synthetic design brief generated for a WCG IntelX demonstration. No real "
                      "molecule, sponsor, site, or participant. Not for clinical, regulatory, or "
                      "operational use.",
    }
