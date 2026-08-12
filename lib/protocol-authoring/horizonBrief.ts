/**
 * HORIZON-Lung-301 expressed as a DesignBrief, so every corpus analysis engine
 * the strategist workspace already has (criteria waterfall, procedure
 * sensitivity, cost model, site footprint, endpoint timeline, amendment risk,
 * comparator landscape) runs unchanged against the protocol under authoring.
 *
 * Each criterion maps to the corpus's controlled criterion vocabulary via
 * corpus_criterion — that string is the join key into criterion_attribution,
 * so it must match the corpus exactly even where the protocol's own wording
 * is more specific.
 */

import type { DesignBrief } from '@/lib/trialCorpus'

export const HORIZON_BRIEF: DesignBrief = {
  brief_id: 'HORIZON-LUNG-301',
  title:
    'HORIZON-Lung-301 — Phase 3 trial of MRD-1872 plus pembrolizumab versus pembrolizumab alone in first-line PD-L1-high metastatic NSCLC',
  status: 'Draft v0.3 (IRB Round 2) — under authoring',
  therapeutic_area: 'Oncology',
  disease_area: 'Thoracic Oncology',
  indication: 'Advanced Non-Small Cell Lung Cancer',
  line_of_treatment: 'First Line',
  phase: '3',
  comparator_cohort: { therapeutic_area: 'Oncology', phase: ['3', '2/3'] },
  target_enrollment: 600,
  planned_sites: 180,
  site_mix: {
    'Academic Medical Center': 0.38,
    'Dedicated Research Site': 0.22,
    'Community Hospital': 0.26,
    'Private Practice': 0.1,
    'Safety-Net / Public Hospital': 0.04,
  },
  arms: [
    { id: 'arm-exp', name: 'Arm A — MRD-1872 700 mg IV Q3W + pembrolizumab 200 mg IV Q3W' },
    { id: 'arm-ctrl', name: 'Arm B — Placebo IV Q3W + pembrolizumab 200 mg IV Q3W' },
  ],
  randomization:
    '1:1, stratified by histology (squamous vs non-squamous), ECOG performance status (0 vs 1), and geographic region',
  primary_endpoint: {
    id: 'ep-pfs',
    text: 'Progression-free survival (PFS) per RECIST v1.1 by blinded independent central review — dual primary with overall survival, hierarchical testing at one-sided α = 0.025',
    assessment: 'Progression-free survival (PFS) per RECIST v1.1',
  },
  secondary_endpoints: [
    {
      id: 'ep-os',
      text: 'Overall survival (OS) — dual primary, tested after PFS in the hierarchy',
      assessment: 'Overall survival (OS)',
      status: 'included',
    },
    {
      id: 'ep-orr',
      text: 'Objective response rate (ORR) per RECIST v1.1 by BICR',
      assessment: 'Objective response rate (ORR) per RECIST v1.1',
      status: 'included',
    },
    {
      id: 'ep-dor',
      text: 'Duration of response (DoR)',
      assessment: 'Duration of response (DoR)',
      status: 'included',
    },
    {
      id: 'ep-qol',
      text: 'Health-related quality of life (EORTC QLQ-C30 / QLQ-LC13)',
      assessment: 'Patient-reported outcomes (EORTC QLQ-C30)',
      status: 'included',
    },
    {
      id: 'ep-safety',
      text: 'Incidence and severity of treatment-emergent adverse events (CTCAE v5.0), including immune-related AEs',
      assessment: 'Treatment-emergent adverse events (CTCAE v5.0)',
      status: 'included',
    },
  ],
  candidate_secondary_endpoints: [
    {
      id: 'cand-ctdna',
      text: 'Serial ctDNA dynamics as an early efficacy and molecular-response signal',
      assessment: 'Circulating tumor DNA (ctDNA) dynamics',
    },
    {
      id: 'cand-pk',
      text: 'MRD-1872 PK exposure–response (Cmax, AUC)',
      assessment: 'Pharmacokinetic exposure (Cmax, AUC)',
    },
    {
      id: 'cand-ada',
      text: 'Anti-drug antibody incidence (immunogenicity)',
      assessment: 'Anti-drug antibody (immunogenicity)',
    },
    {
      id: 'cand-hcru',
      text: 'Healthcare resource utilization',
      assessment: 'Healthcare resource utilization',
    },
  ],
  criteria: [
    {
      id: 'cri-age',
      type: 'Inclusion',
      category: 'Demographics',
      text: 'Adults ≥ 18 years at time of informed consent',
      corpus_criterion: 'Age',
    },
    {
      id: 'cri-histology',
      type: 'Inclusion',
      category: 'Diagnosis',
      text: 'Histologically or cytologically confirmed Stage IV NSCLC (AJCC 8th ed.), squamous or non-squamous',
      corpus_criterion: 'Histologically or cytologically confirmed diagnosis',
    },
    {
      id: 'cri-pdl1',
      type: 'Inclusion',
      category: 'Biomarker',
      text: 'PD-L1 TPS ≥ 50% by central 22C3 IHC on tumor tissue collected within 24 months',
      corpus_criterion: 'Biomarker-positive tumor status',
      hero_hook: true,
      open_question:
        'Central 22C3 confirmation forces a fresh biopsy wherever archival tissue is older than 24 months. What does that do to the screening funnel and timeline?',
    },
    {
      id: 'cri-tissue',
      type: 'Inclusion',
      category: 'Biomarker',
      text: 'Availability of archival or fresh tumor tissue adequate for central PD-L1 and biomarker analysis',
      corpus_criterion: 'Availability of archival or fresh tumor tissue',
    },
    {
      id: 'cri-measurable',
      type: 'Inclusion',
      category: 'Diagnosis',
      text: 'At least one measurable lesion per RECIST v1.1, not previously irradiated',
      corpus_criterion: 'Measurable disease per RECIST v1.1',
    },
    {
      id: 'cri-ecog',
      type: 'Inclusion',
      category: 'Procedural Values',
      text: 'ECOG performance status 0–1 at screening and within 72 hours of Cycle 1 Day 1',
      corpus_criterion: 'Eastern Cooperative Oncology Group (ECOG) performance status',
    },
    {
      id: 'cri-treatment-naive',
      type: 'Inclusion',
      category: 'Prior/Concurrent treatment (e.g. line of therapy)',
      text: 'No prior systemic therapy for metastatic NSCLC (adjuvant/neoadjuvant permitted if completed ≥ 12 months prior)',
      corpus_criterion: 'Prior lines of systemic therapy',
    },
    {
      id: 'cri-organ',
      type: 'Inclusion',
      category: 'Lab Values',
      text: 'Adequate organ and marrow function (ANC, platelets, hemoglobin, LFTs, creatinine clearance ≥ 30 mL/min)',
      corpus_criterion: 'Adequate organ and marrow function',
    },
    {
      id: 'cri-life-expectancy',
      type: 'Inclusion',
      category: 'Prognosis',
      text: 'Life expectancy ≥ 12 weeks',
      corpus_criterion: 'Life expectancy',
    },
    {
      id: 'cri-cns',
      type: 'Exclusion',
      category: 'Medical History',
      text: 'Untreated or symptomatic central nervous system metastases or leptomeningeal disease',
      corpus_criterion: 'Untreated central nervous system metastases',
    },
    {
      id: 'cri-prior-io-class',
      type: 'Exclusion',
      category: 'Prior/Concurrent treatment (e.g. line of therapy)',
      text: 'Prior treatment with any anti-TIGIT, anti-CD112R, or other agent of the same mechanistic class',
      corpus_criterion: 'Prior treatment with an agent of the same mechanistic class',
    },
    {
      id: 'cri-autoimmune',
      type: 'Exclusion',
      category: 'Comorbidities',
      text: 'Active autoimmune disease requiring systemic treatment within the past 2 years',
      corpus_criterion: 'Active autoimmune disease requiring systemic treatment',
    },
    {
      id: 'cri-ild',
      type: 'Exclusion',
      category: 'Medical History',
      text: 'History of interstitial lung disease or non-infectious pneumonitis requiring steroids',
      corpus_criterion: 'History of interstitial lung disease or non-infectious pneumonitis',
    },
    {
      id: 'cri-irae',
      type: 'Exclusion',
      category: 'Medical History',
      text: 'History of severe immune-related adverse events on prior immunotherapy (Grade ≥ 3 requiring discontinuation)',
      corpus_criterion: 'History of severe immune-related adverse events',
    },
    {
      id: 'cri-infection',
      type: 'Exclusion',
      category: 'Comorbidities',
      text: 'Active infection requiring systemic therapy at randomization',
      corpus_criterion: 'Active infection requiring systemic therapy',
    },
    {
      id: 'cri-second-malignancy',
      type: 'Exclusion',
      category: 'Medical History',
      text: 'Second primary malignancy requiring active treatment within the past 3 years',
      corpus_criterion: 'Second primary malignancy requiring active treatment',
    },
    {
      id: 'cri-live-vaccine',
      type: 'Exclusion',
      category: 'Concomitant Medications',
      text: 'Receipt of a live attenuated vaccine within 30 days of first dose',
      corpus_criterion: 'Receipt of a live attenuated vaccine',
    },
  ],
  soa_sketch: [
    'Screening (Day −28 to −1): consent, central PD-L1 confirmation, CT/MRI imaging, labs, ECG',
    'Treatment (21-day cycles, up to 35): MRD-1872/placebo + pembrolizumab IV, safety labs, irAE monitoring; serial PK C1–C2',
    'Tumor assessment: CT chest/abdomen/pelvis per RECIST v1.1 by BICR every 6 weeks through Week 48, then every 9 weeks',
    'PROs (QLQ-C30, QLQ-LC13, EQ-5D-5L) at baseline and every other cycle; ctDNA at baseline, C2, C5, and progression',
    'End of treatment + 30/90-day safety follow-up; survival follow-up every 12 weeks',
  ],
  disclaimer:
    'Entirely synthetic demonstration content. Meridian Oncology, MRD-1872, and HORIZON-Lung-301 are fictional; no real sponsor, molecule, or trial is represented.',
}
