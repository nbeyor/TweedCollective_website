/**
 * HORIZON-Lung-301 — the protocol under authoring in the Protocol Foundry
 * workspace. Adapted from the client's ProtocolForge demonstration: a fully
 * fictional Phase III study (Meridian Oncology, MRD-1872 + pembrolizumab in
 * 1L PD-L1-high metastatic NSCLC). Every name, molecule, and figure is
 * synthetic demo content.
 *
 * Section bodies are markdown, served to the model through the
 * get_protocol_section tool — the outline (ids and titles, no bodies) ships
 * to the client through horizonOutline.ts instead, to keep the page bundle
 * light.
 */

export interface ProtocolSection {
  id: string
  title: string
  body: string
}

export interface ProtocolChapter {
  num: number
  title: string
  sections: ProtocolSection[]
}

export const HORIZON_META = {
  title: "A Phase 3, Randomized, Double-Blind, Placebo-Controlled Trial of MRD-1872 plus Pembrolizumab versus Pembrolizumab alone in the First-Line Treatment of Adults with PD-L1 High Metastatic Non-Small Cell Lung Cancer",
  subtitle: "HORIZON-Lung-301 · A global multiregional Phase III study evaluating the efficacy and safety of MRD-1872, a first-in-class dual-specificity immunomodulator, added to standard-of-care anti-PD-1 monotherapy",
  acronym: "HORIZON-Lung-301",
  sponsor: "Meridian Oncology, Inc.",
  protocolId: "MRD-2026-0301",
  version: "Draft v0.3 (IRB Round 2)",
  phase: 'Phase III',
  indication: '1L metastatic NSCLC · PD-L1 TPS ≥ 50%',
  targetEnrollment: 600,
  arms: ['MRD-1872 + Pembrolizumab', 'Placebo + Pembrolizumab'],
} as const

export const HORIZON_CHAPTERS: ProtocolChapter[] = [
  {
    num: 0,
    title: "Front Matter",
    sections: [
      {
        id: "amendment-details",
        title: "Amendment Details",
        body: "Not applicable. This is the original protocol.\n\nMinor editorial changes introduced during IRB Round 2 revisions are tracked in the Protocol Change Log (Appendix 12). No substantive changes to eligibility criteria, primary endpoints, statistical hypotheses, or safety monitoring procedures have been made between Draft v0.1 (Orchestrator first assembly, 18 Apr 2026 09:51) and the present Draft v0.3 (18 Apr 2026 10:56).\n\n---",
      },
    ],
  },
  {
    num: 1,
    title: "Protocol Summary",
    sections: [
      {
        id: "protocol-synopsis",
        title: "Protocol Synopsis",
        body: "HORIZON-Lung-301 is a Phase 3, randomized, double-blind, placebo-controlled, multi-regional trial evaluating the efficacy and safety of MRD-1872, a first-in-class dual-specificity immunomodulator targeting TIGIT and CD112R, administered in combination with pembrolizumab (anti-PD-1) versus pembrolizumab monotherapy, as first-line treatment for adults with unresectable, locally advanced or metastatic non-small cell lung cancer (NSCLC) whose tumors express PD-L1 at a Tumor Proportion Score (TPS) ≥ 50% as determined by the 22C3 IHC pharmDx assay at a central laboratory.\n\nApproximately 600 participants will be randomized 1:1 to receive either MRD-1872 700 mg IV Q3W plus pembrolizumab 200 mg IV Q3W (experimental arm, n ≈ 300) or matching placebo IV Q3W plus pembrolizumab 200 mg IV Q3W (control arm, n ≈ 300). Treatment will continue until disease progression by RECIST v1.1, unacceptable toxicity, withdrawal of consent, or completion of 35 cycles (approximately 24 months), whichever occurs first.\n\nThe study employs **dual primary endpoints**: (1) Progression-Free Survival (PFS) assessed by Blinded Independent Central Review (BICR) per RECIST v1.1 and (2) Overall Survival (OS). A hierarchical testing strategy will be used to control the family-wise Type I error rate at a one-sided α = 0.025. The study is powered at 90% to detect a PFS hazard ratio of 0.70 and at 85% to detect an OS hazard ratio of 0.76.\n\nKey secondary endpoints include Objective Response Rate (ORR), Duration of Response (DoR), Disease Control Rate (DCR), health-related quality of life (EORTC QLQ-C30 and QLQ-LC13), and safety. Exploratory biomarker endpoints include serial ctDNA dynamics, tumor mutational burden (TMB), and gene-expression profiling of baseline tumor samples.\n\nThe trial will be conducted at approximately 180 sites across North America, Western Europe, East Asia (Japan, Korea, Taiwan, mainland China), and Australia, with pre-specified geographic enrollment caps and floors to ensure representative sampling (§5). An independent Data Safety Monitoring Board (DSMB) will oversee safety and efficacy at three pre-specified interim analyses.",
      },
      {
        id: "trial-schema",
        title: "Trial Schema",
        body: "The HORIZON-Lung-301 trial follows a five-epoch design progressing from screening through long-term follow-up:\n\n```\nEPOCH 1         EPOCH 2          EPOCH 3                    EPOCH 4             EPOCH 5\nScreening       Randomization    Treatment                  Safety Follow-Up    Survival Follow-Up\n(≤ 28 days)     (Day 1)          (Q3W cycles · ≤ 35)        (90 / 120 days)     (Q3M until\n                                                                                 60% OS events)\n|               |                |                          |                   |\n|  Informed     |  1:1 permuted- |  Arm A: MRD-1872 700 mg  |  Post-treatment   |  Survival\n|  consent      |  block         |  + pembrolizumab 200 mg  |  visits 30, 90,   |  contact\n|  Central      |  stratified    |  IV Q3W                  |  120 days after   |  every 3\n|  PD-L1        |  by region,    |                          |  last dose        |  months\n|  testing      |  ECOG PS,      |  Arm B: Placebo          |                   |\n|  Imaging      |  smoking       |  + pembrolizumab 200 mg  |  irAE resolution  |  Subsequent-\n|  Eligibility  |                |  IV Q3W                  |  surveillance     |  therapy data\n|  review       |                |                          |                   |  capture\n```\n\nTumor assessments are performed at baseline, every 6 weeks (± 7 days) for the first 48 weeks, then every 9 weeks (± 7 days) until documented disease progression, regardless of treatment discontinuation. Survival follow-up contacts continue every three months until the final OS analysis.",
      },
      {
        id: "schedule-of-activities-soa",
        title: "Schedule of Activities (SoA)",
        body: "The Schedule of Activities (SoA) matrix below summarizes required study procedures and their timing. Windows are ± 3 days for on-treatment visits and ± 7 days for tumor assessments unless otherwise specified.\n\n| Procedure | Screening | D1 C1 | D1 C2-35 | EoT | 30d FU | 90/120d FU | Survival FU |\n|-----------|:---------:|:-----:|:--------:|:---:|:------:|:----------:|:-----------:|\n| **Administrative** | | | | | | | |\n| Informed consent | X | | | | | | |\n| Demographics / Medical hx | X | | | | | | |\n| Eligibility confirmation | X | X | | | | | |\n| Randomization (IWRS) | | X | | | | | |\n| **Tumor & biomarker** | | | | | | | |\n| Tumor tissue (PD-L1 central) | X | | | | | | |\n| Optional ctDNA (blood) | X | X | Q6W | X | | | |\n| Imaging (CT C/A/P + brain MRI) | X | | Q6W x8, then Q9W | X | | | |\n| **Safety** | | | | | | | |\n| Vital signs | X | X | X | X | X | X | |\n| Physical exam / ECOG | X | X | X | X | X | X | |\n| 12-lead ECG | X | X | C1,C4,C8 | X | | | |\n| Pulse oximetry (weekly, C1-C4) | | X | weekly | X | | | |\n| HRCT chest (baseline) | X | | as clinically indicated | | | | |\n| Labs (CBC, CMP, TSH, cortisol) | X | X | X | X | X | X | |\n| Pregnancy test (WOCBP) | X | X | X | X | X | X | |\n| Adverse events | X | X | X | X | X | X | |\n| irAE questionnaire | | X | X | X | X | X | |\n| **Study intervention** | | | | | | | |\n| MRD-1872 / placebo infusion | | X | X | | | | |\n| Pembrolizumab infusion | | X | X | | | | |\n| **Patient-reported outcomes** | | | | | | | |\n| EORTC QLQ-C30 / QLQ-LC13 | X | X | C2,C4,C6, then Q6W | X | X | X | |\n| **Survival** | | | | | | | X |\n\n**Timing windows:** Screening ≤ 28 days prior to randomization. Treatment cycles are 21 days. The End-of-Treatment (EoT) visit occurs 14–21 days after the last dose. Post-treatment safety follow-up continues 90 days from last dose (120 days for irAEs requiring immunosuppression).",
      },
    ],
  },
  {
    num: 2,
    title: "Introduction",
    sections: [
      {
        id: "disease-background",
        title: "Disease Background · 1L Metastatic NSCLC",
        body: "Non-small cell lung cancer (NSCLC) accounts for approximately 85% of all lung cancers and remains the leading cause of cancer-related mortality globally, with an estimated 1.8 million deaths attributable to lung cancer each year (GLOBOCAN 2024). Approximately 40% of patients present with metastatic (Stage IV) disease at initial diagnosis, for whom 5-year overall survival historically has been less than 10%.\n\nThe introduction of immune checkpoint inhibitors targeting PD-1/PD-L1 — in particular pembrolizumab monotherapy for patients with PD-L1 TPS ≥ 50% based on the KEYNOTE-024 trial — has fundamentally changed the first-line treatment landscape, with median OS exceeding 26 months in this selected population. However, approximately 55% of patients experience disease progression within two years of initiating pembrolizumab, and mechanisms of primary and acquired resistance to PD-1 blockade remain incompletely addressed. Co-inhibitory receptors including TIGIT and CD112R (PVRIG) have emerged as complementary immune checkpoints implicated in T-cell and NK-cell exhaustion within the NSCLC tumor microenvironment, providing rationale for combination immunotherapy strategies.\n\nMRD-1872 is a humanized IgG1 bispecific antibody engineered to simultaneously block TIGIT and CD112R with effector-competent Fc function, designed to reinvigorate exhausted CD8+ tumor-infiltrating lymphocytes and NK cells when administered in combination with anti-PD-1 blockade. Preclinical studies demonstrated synergistic tumor regression in humanized mouse models, and the Phase 2 HORIZON-Lung-201 trial (n = 234) established a favorable efficacy signal with a confirmed ORR of 52.1% (vs 37.6% for pembrolizumab monotherapy) and a median PFS of 14.2 months (vs 8.8 months).",
      },
      {
        id: "scientific-rationale-for-mrd-1872",
        title: "Scientific Rationale for MRD-1872",
        body: "The scientific rationale for developing MRD-1872 in combination with pembrolizumab in 1L PD-L1 high NSCLC rests on three pillars of translational evidence:\n\n**1. Non-redundant checkpoint pathways.** TIGIT and CD112R are co-expressed with PD-1 on exhausted tumor-infiltrating lymphocytes in NSCLC but act through distinct intracellular signaling cascades. Dual blockade of TIGIT / CD112R together with PD-1 releases three non-redundant inhibitory signals in a single cytotoxic lymphocyte, producing additive-to-synergistic effector reactivation in ex-vivo human tumor dissociates.\n\n**2. Enrichment in PD-L1 high tumors.** Multiplexed immunohistochemistry of archival NSCLC specimens (Meridian TM-Atlas, n = 412) demonstrates that TIGIT⁺ / CD112R⁺ exhausted CD8⁺ T cells are most densely represented in PD-L1 TPS ≥ 50% tumors, providing biological support for prioritizing this biomarker-enriched population.\n\n**3. Phase 2 clinical proof of concept.** The Phase 2 HORIZON-Lung-201 trial enrolled 234 biomarker-unselected patients with 1L metastatic NSCLC and demonstrated a confirmed ORR of 52.1% with MRD-1872 + pembrolizumab versus 37.6% with pembrolizumab monotherapy (Δ = 14.5 pp; 95% CI 3.1–25.9). Subgroup analysis within PD-L1 TPS ≥ 50% participants (n = 108) showed ORR 64.3% vs 44.6% and median PFS 16.8 months vs 9.2 months (HR 0.62; 95% CI 0.40–0.96).",
      },
      {
        id: "benefit-risk-assessment",
        title: "Benefit / Risk Assessment",
        body: "**Potential benefits.** Based on the Phase 2 HORIZON-Lung-201 results, participants randomized to the experimental arm may experience an incremental improvement in objective response, progression-free survival, and — potentially — overall survival, relative to the current standard-of-care pembrolizumab monotherapy. There are no validated biomarkers that predict individual benefit beyond PD-L1 TPS; consequently the trial applies a TPS ≥ 50% enrichment strategy.\n\n**Potential risks.** In the Phase 2 study, the addition of MRD-1872 to pembrolizumab increased Grade 3 or higher pneumonitis from 4.2% to 9.1% (RR 2.17; 95% CI 1.18–3.98) and Grade 3 or higher colitis from 2.9% to 5.6% (RR 1.93; 95% CI 0.88–4.25). No treatment-related deaths were observed. To mitigate these risks, HORIZON-Lung-301 implements: (a) stepwise infusion titration (25% → 50% → 100% of target dose over Cycles 1–2); (b) mandatory baseline high-resolution chest CT and weekly pulse oximetry during Cycles 1–4; (c) a pre-specified corticosteroid tapering algorithm (Appendix 5); (d) exclusion of participants with prior Grade 3+ autoimmune disease, active interstitial lung disease, or untreated CNS metastases; (e) independent irAE adjudication.\n\n**Overall assessment.** In the judgment of the Sponsor and the investigators, the anticipated clinical benefit — a potential extension of PFS and OS in a disease setting where 5-year survival remains below 35% — is expected to outweigh the incremental immune-mediated toxicity risk, provided the risk-mitigation procedures specified in this protocol are rigorously implemented.",
      },
    ],
  },
  {
    num: 3,
    title: "Objectives and Estimands",
    sections: [
      {
        id: "primary-objectives-and-estimands",
        title: "Primary Objectives and Estimands",
        body: "The trial has two primary objectives, each with its own pre-specified estimand. Both are tested hierarchically at a one-sided α = 0.025, with PFS tested first; OS may be formally declared positive only if PFS has achieved statistical significance.\n\n**Primary Objective 1 (PFS).** To evaluate the effect of MRD-1872 plus pembrolizumab compared with placebo plus pembrolizumab on Progression-Free Survival per RECIST v1.1 as assessed by Blinded Independent Central Review.\n\n| Estimand 1 (PFS) Component | Description |\n|---|---|\n| **Population** | Intent-to-Treat: all randomized participants, analyzed as randomized |\n| **Treatment** | MRD-1872 + pembrolizumab vs Placebo + pembrolizumab |\n| **Variable** | Time from randomization to documented disease progression per RECIST v1.1 (BICR) or death from any cause, whichever occurs first |\n| **Intercurrent events** | (a) Subsequent anti-cancer therapy before progression → treatment-policy strategy; (b) death from any cause → composite strategy |\n| **Summary measure** | Hazard ratio (stratified Cox), with 95% CI; median PFS (K-M) |\n\n**Primary Objective 2 (OS).** To evaluate the effect of MRD-1872 plus pembrolizumab compared with placebo plus pembrolizumab on Overall Survival.\n\n| Estimand 2 (OS) Component | Description |\n|---|---|\n| **Population** | Intent-to-Treat |\n| **Treatment** | MRD-1872 + pembrolizumab vs Placebo + pembrolizumab |\n| **Variable** | Time from randomization to death from any cause |\n| **Intercurrent events** | Subsequent therapies → treatment-policy strategy (OS is a terminal endpoint) |\n| **Summary measure** | Hazard ratio (stratified Cox) with 95% CI; median OS (K-M) |",
      },
      {
        id: "secondary-objectives",
        title: "Secondary Objectives",
        body: "- Evaluate Objective Response Rate (ORR) per RECIST v1.1 (BICR).\n- Evaluate Duration of Response (DoR) among responders.\n- Evaluate Disease Control Rate (DCR) and time to response (TTR).\n- Evaluate safety and tolerability, as measured by incidence, severity (CTCAE v5), and seriousness of adverse events, with particular attention to immune-mediated events.\n- Evaluate health-related quality of life using EORTC QLQ-C30 and QLQ-LC13 instruments.\n- Evaluate MRD-1872 pharmacokinetics and the incidence of anti-drug antibodies.\n\nAll secondary efficacy endpoints will be tested hierarchically after the primary OS test passes, in the pre-specified order ORR → DoR → DCR.",
      },
      {
        id: "exploratory-objectives",
        title: "Exploratory Objectives",
        body: "- Characterize ctDNA dynamics (variant allele frequency at C1D1, C3D1, C5D1, C9D1, EoT) and their association with radiographic response and survival.\n- Explore tumor mutational burden (TMB, whole-exome sequencing) as a continuous variable correlated with PFS and OS.\n- Explore baseline gene-expression signatures (RNA-seq) associated with differential benefit from MRD-1872.\n- Explore soluble proteomic correlates of immune-mediated adverse events (Olink Explore 3072 panel, baseline and C3D1 serum).\n\nAll exploratory analyses are hypothesis-generating and will not contribute to the primary or key secondary conclusions.",
      },
    ],
  },
  {
    num: 4,
    title: "Trial Design",
    sections: [
      {
        id: "overall-design",
        title: "Overall Design · 1:1 Randomization",
        body: "HORIZON-Lung-301 is a global, randomized, double-blind, placebo-controlled, parallel-group Phase 3 trial. Approximately 600 participants will be randomized in a 1:1 ratio via an interactive web response system (IWRS) to either the experimental arm (MRD-1872 + pembrolizumab) or the control arm (placebo + pembrolizumab). Randomization is stratified by:\n\n- **Geographic region** (US/Canada · Western Europe · East Asia · Rest of World).\n- **ECOG performance status** (0 vs 1).\n- **Smoking status** (current/former vs never-smoker).\n\nBlinding is double — Sponsor, investigator, site staff, participant, and all outcome assessors, including the BICR imaging reviewers, are masked to treatment assignment. MRD-1872 and matching placebo are visually indistinguishable and are administered from blinded kits prepared by unblinded pharmacy staff. Unblinding at the individual-participant level is permitted only in a medical emergency, after consultation with the medical monitor.\n\nTumor assessments are performed every 6 weeks (± 7 days) for the first 48 weeks, then every 9 weeks (± 7 days) until documented disease progression by RECIST v1.1, irrespective of treatment discontinuation. Participants who discontinue study intervention for reasons other than progression continue tumor assessments on the scheduled imaging calendar.\n\n**Geographic caps and floors.** To ensure a globally representative population and support multi-regional regulatory approval, the following targets apply: maximum 35% US + Western Europe combined; minimum 20% Japan + Korea + Taiwan combined; minimum 10% mainland China. Monthly enrollment dashboards are reviewed by the Steering Committee; enrollment in any region exceeding its cap will be temporarily suspended.",
      },
      {
        id: "rationale-for-design-choices",
        title: "Rationale for Design Choices",
        body: "- **Two-arm design.** A two-arm design comparing MRD-1872 + pembrolizumab against the current standard-of-care, pembrolizumab monotherapy, provides the most direct and interpretable efficacy estimate for regulatory decision-making.\n- **Placebo control.** Placebo control preserves blinding of participants, investigators, and BICR assessors, which is particularly important given the subjective elements of RECIST assessment and the safety-reporting bias that can occur in open-label immune-oncology trials.\n- **PD-L1 TPS ≥ 50% enrichment.** Restricting enrollment to PD-L1 high participants concentrates the anticipated treatment benefit in a biologically defined subgroup, reducing the sample size required to detect a clinically meaningful effect.\n- **Dual primary PFS + OS.** PFS provides a more rapid readout and supports potential accelerated-approval discussions; OS is the gold-standard efficacy endpoint. The hierarchical testing strategy controls the family-wise Type I error rate at 0.025.\n- **Continuous until progression.** Treatment to a maximum of 35 cycles (≈ 24 months) is consistent with the approved pembrolizumab monotherapy schedule and allows evaluation of late-onset immune-mediated events.",
      },
    ],
  },
  {
    num: 5,
    title: "Study Population and Eligibility",
    sections: [
      {
        id: "inclusion-criteria",
        title: "Inclusion Criteria",
        body: "Participants must meet **all** of the following criteria at the time of randomization:\n\n1. Male or female adults aged ≥ 18 years (or the legal age of majority in the participating country) at the time of informed consent.\n2. Histologically or cytologically confirmed Stage IV NSCLC (AJCC 8th edition), either squamous or non-squamous histology.\n3. Tumor PD-L1 TPS ≥ 50% as determined by the 22C3 IHC pharmDx assay at a designated central laboratory, confirmed on tumor tissue collected within 24 months prior to screening.\n4. At least one measurable lesion per RECIST v1.1, not previously irradiated.\n5. ECOG performance status 0 or 1 at screening and within 72 hours of Cycle 1 Day 1.\n6. No prior systemic therapy for metastatic NSCLC. Adjuvant or neoadjuvant chemotherapy, radiotherapy, or immunotherapy is permitted if completed ≥ 12 months prior to randomization.\n7. Adequate organ function: ANC ≥ 1.5 × 10⁹/L; platelets ≥ 100 × 10⁹/L; hemoglobin ≥ 9.0 g/dL; ALT/AST ≤ 2.5 × ULN (≤ 5 × ULN if liver metastases); total bilirubin ≤ 1.5 × ULN; creatinine clearance ≥ 30 mL/min (Cockcroft-Gault).\n8. Life expectancy ≥ 12 weeks.\n9. Women of childbearing potential must have a negative serum pregnancy test within 72 hours prior to Cycle 1 Day 1 and must agree to use highly effective contraception (Pearl Index < 1%) for the duration of treatment and for 120 days after the last dose.\n10. Provision of written informed consent prior to any study-specific procedures.",
      },
      {
        id: "exclusion-criteria",
        title: "Exclusion Criteria",
        body: "Participants meeting **any** of the following criteria are not eligible:\n\n1. Tumor harboring a sensitizing EGFR mutation, ALK rearrangement, ROS1 fusion, BRAF V600E mutation, or any other actionable driver alteration for which an approved first-line targeted therapy is available in the participating country.\n2. Active, known, or suspected autoimmune disease requiring systemic treatment within 2 years prior to randomization (replacement therapy, e.g., thyroxine, is permitted).\n3. Prior Grade 3 or higher immune-mediated adverse event on any previous immunotherapy.\n4. Active interstitial lung disease or a history of pneumonitis requiring systemic corticosteroids.\n5. Untreated or symptomatic CNS metastases. Participants with previously treated CNS metastases are eligible if clinically stable for ≥ 4 weeks, off corticosteroids for ≥ 14 days, and without evidence of progression on imaging within 4 weeks of screening.\n6. Significant cardiovascular disease within 6 months prior to randomization: myocardial infarction, unstable angina, CVA, Class III/IV congestive heart failure (NYHA), uncontrolled hypertension, or clinically significant arrhythmia.\n7. Known hypersensitivity to any component of MRD-1872, placebo, or pembrolizumab.\n8. Active infection requiring systemic therapy, including known HIV (unless well-controlled per local guidance), active hepatitis B (HBsAg+ with detectable DNA) or hepatitis C (HCV RNA detectable).\n9. Pregnant or breastfeeding women.\n10. Any condition which, in the opinion of the investigator, would jeopardize participant safety or interfere with evaluation of study objectives.",
      },
    ],
  },
  {
    num: 6,
    title: "Study Intervention — MRD-1872",
    sections: [
      {
        id: "dosing-rationale-and-pk-pd",
        title: "Dosing Rationale and PK/PD",
        body: "The recommended Phase 3 dose of MRD-1872 is 700 mg IV Q3W, administered over 30 minutes. This dose was selected based on the Phase 1b MRD-1872-101 dose-finding study (n = 48) in which receptor-occupancy (RO) of peripheral-blood TIGIT⁺ CD8⁺ T cells exceeded 95% at trough for all participants receiving ≥ 500 mg Q3W, and on the Phase 2 HORIZON-Lung-201 dose-expansion cohort (n = 72) which demonstrated the best benefit-risk profile at 700 mg Q3W relative to lower (350 mg) and higher (1,050 mg) doses.\n\n**Pharmacokinetics.** MRD-1872 exhibits dose-proportional pharmacokinetics over the 100–1,400 mg dose range, with a terminal half-life of approximately 21 days (consistent with a typical IgG1 antibody). Steady-state trough concentrations (≈ 85 µg/mL at 700 mg Q3W) exceed the in-vitro IC₉₀ for dual TIGIT / CD112R blockade by more than 10-fold. No dose adjustment is required based on age, sex, body weight (40–150 kg), or mild to moderate renal or hepatic impairment.\n\n**Pharmacodynamics.** Pharmacodynamic biomarker sampling at C1D1, C2D1, and C4D1 in the Phase 2 study demonstrated rapid and sustained downmodulation of TIGIT and CD112R on peripheral CD8⁺ T cells, accompanied by expansion of effector-memory T-cell subpopulations. Serum IFN-γ and CXCL10 rose approximately 2–4 fold from baseline.\n\n**Stepwise infusion titration.** To mitigate the incremental pneumonitis signal observed in Phase 2, HORIZON-Lung-301 introduces a stepwise titration schedule: 25% of the target dose (175 mg) at Cycle 1, 50% (350 mg) at Cycle 2, and 100% (700 mg) from Cycle 3 onward. This schedule does not compromise target receptor occupancy based on PBPK modeling.",
      },
      {
        id: "preparation-administration-and-storage",
        title: "Preparation, Administration, and Storage",
        body: "**Drug product.** MRD-1872 is supplied as a sterile, preservative-free solution for intravenous infusion at 25 mg/mL in a 6-mL Type-I glass vial (150 mg per vial). Matching placebo is identical in appearance, fill volume, container, and labeling.\n\n**Storage.** Vials are stored refrigerated at 2–8 °C, protected from light, in the original carton until use. Do not freeze. Do not shake.\n\n**Preparation.** The calculated dose is withdrawn from the required number of vials and diluted into a 250-mL infusion bag of 0.9% sodium chloride for injection. The infusion bag is gently inverted 5–10 times. The prepared solution is stable for 24 hours at 2–8 °C or 8 hours at room temperature, inclusive of infusion time. Prepared MRD-1872 / placebo infusions must be administered through a 0.2-µm in-line, low-protein-binding filter.\n\n**Administration.** MRD-1872 / placebo is administered over 30 ± 5 minutes on Day 1 of each 21-day cycle. Pembrolizumab 200 mg is administered over 30 ± 5 minutes on the same day, following completion of the MRD-1872 / placebo infusion by at least 30 minutes to facilitate attribution of any infusion reactions.\n\n**Cold-chain documentation.** All vials are tracked by a per-pack temperature-monitoring device; excursions outside 2–8 °C must be reported within 24 hours to the Meridian Clinical Supply team.",
      },
    ],
  },
  {
    num: 7,
    title: "Discontinuation Criteria · irAEs",
    sections: [
      {
        id: "discontinuation-criteria",
        title: "Discontinuation Criteria · irAEs",
        body: "Participants must be **permanently discontinued** from study intervention for any of the following:\n\n1. Any Grade 3 or 4 pneumonitis (CTCAE v5).\n2. Grade 3 or higher immune-mediated hepatitis not resolving to ≤ Grade 1 within 14 days of initiating corticosteroid therapy.\n3. Any Grade 3 or 4 colitis.\n4. Any Grade 4 endocrinopathy.\n5. Any Grade 4 infusion-related reaction.\n6. Any immune-mediated adverse event requiring systemic corticosteroid therapy at a dose > 10 mg/day prednisone equivalent beyond 12 weeks from event onset.\n7. Recurrence of any Grade 2 immune-mediated adverse event after rechallenge.\n8. Any adverse event that, in the investigator's clinical judgment, precludes safe continuation.\n9. Withdrawal of consent to continue study intervention.\n10. Pregnancy.\n\nParticipants who permanently discontinue MRD-1872 / placebo for immune-mediated toxicity may, at the discretion of the treating investigator and medical monitor, continue pembrolizumab alone for up to the full 35-cycle duration.\n\nSpecific treatment-modification algorithms for pneumonitis, colitis, hepatitis, endocrinopathies, and nephritis are provided in Appendix 5 (Immune-Mediated Adverse Event Management Guidelines), aligned with the 2021 ASCO / NCCN irAE management guidelines and the pembrolizumab US Prescribing Information.",
      },
    ],
  },
  {
    num: 8,
    title: "Statistical Considerations",
    sections: [
      {
        id: "sample-size-and-power",
        title: "Sample Size and Power",
        body: "**Sample size for PFS.** Under the planned 1:1 randomization and an assumed PFS hazard ratio of 0.70 (MRD-1872 + pembrolizumab vs placebo + pembrolizumab), with an 18-month enrollment period and 18 months of minimum follow-up, approximately **385 PFS events** are required to achieve 90% power at a one-sided α = 0.0125 (half of the overall 0.025 after Bonferroni split between interim and final). A total enrollment of 600 participants is projected to produce 385 PFS events by approximately 30 months after first-subject-in.\n\n**Sample size for OS.** Under an assumed OS HR of 0.76, approximately **435 death events** provide 85% power at a one-sided α = 0.025 (alpha recycled from PFS if PFS is positive). This event count is projected at approximately 54 months after first-subject-in.\n\n**Simulation assumptions.** Enrollment follows a truncated-exponential ramp (18 months to full accrual). Median PFS in the control arm is assumed to be 10.3 months (based on KEYNOTE-024 update). Dropout is assumed at 2% per year, independent of treatment arm.",
      },
      {
        id: "hierarchical-testing",
        title: "Hierarchical Testing · PFS then OS",
        body: "To control the overall family-wise Type I error rate at a one-sided α = 0.025, the primary and key secondary hypotheses are tested in the following pre-specified hierarchical order. A subsequent hypothesis is tested at its full prescribed α **only if** the immediately preceding hypothesis has achieved statistical significance.\n\n1. **PFS** (BICR, RECIST v1.1) — α = 0.025 one-sided. Interim at 65% of events (Haybittle-Peto O'Brien-Fleming boundary, α = 0.0001 stop-for-efficacy). Final at 100% of events.\n2. **OS** — α = 0.025 one-sided, recycled from PFS on success. Interim at 50% and 75% of events; final at 100%.\n3. **ORR** (BICR) — α = 0.025 one-sided, recycled on OS success.\n4. **DoR** — descriptive after ORR success.\n\nAll hazard ratio analyses use a stratified Cox proportional-hazards model, with the stratification factors matching the randomization strata (region, ECOG PS, smoking status). Kaplan-Meier medians are reported with 95% confidence intervals (Brookmeyer-Crowley).",
      },
      {
        id: "interim-analyses",
        title: "Interim Analyses",
        body: "Three interim analyses are planned:\n\n- **IA-1 (safety / futility)** — at 33% of PFS events. DSMB review only; no efficacy boundary crossed. Futility tested against a conditional-power threshold of 10% for the PFS primary analysis.\n- **IA-2 (PFS efficacy)** — at 65% of PFS events. Haybittle-Peto boundary for stop-for-efficacy at one-sided p < 0.0001.\n- **IA-3 (OS efficacy)** — at 50% of OS events, conditional on PFS being declared positive. O'Brien-Fleming boundary at one-sided p < 0.0014.\n\nAll interim analyses are performed by an independent statistical data analysis center; the Sponsor and Investigators remain blinded until the corresponding formal readout.",
      },
    ],
  },
  {
    num: 9,
    title: "Safety Monitoring and DSMB",
    sections: [
      {
        id: "safety-monitoring-and-dsmb",
        title: "Safety Monitoring and DSMB",
        body: "An independent Data Safety Monitoring Board (DSMB) composed of three thoracic oncologists, one biostatistician, one pulmonologist, and an independent irAE adjudicator will oversee participant safety per the DSMB Charter (v2.1, Apr 2026).\n\n**DSMB Review Schedule.** The DSMB convenes at approximately 3-month intervals from first-subject-in, with additional ad-hoc meetings called by the DSMB Chair for any serious safety signal.\n\n**Pre-specified stopping rules.** The DSMB **must** recommend study halt for any of the following:\n\n- All-cause mortality hazard ratio ≥ 1.30 (MRD-1872 arm vs control) with a one-sided p < 0.01.\n- Grade 5 immune-mediated adverse event rate > 2.5% in the experimental arm.\n- Grade 3–4 pneumonitis rate > 8% in the experimental arm.\n- Futility criterion: conditional power < 10% for either PFS or OS at any formal interim.\n- Any clinically significant safety signal judged by the DSMB, in consultation with the irAE adjudicator, to materially alter the benefit-risk assessment.\n\n**SAE reporting.** Serious adverse events are reported to the Sponsor within 24 hours of investigator awareness; immune-mediated SAEs are independently adjudicated by a blinded irAE committee within 5 business days of receipt.\n\n**AE reporting.** All adverse events are graded per CTCAE v5 and coded to MedDRA 27.0, with immune-mediated events flagged by a standardized MedDRA query (SMQ).",
      },
    ],
  },
  {
    num: 10,
    title: "Exploratory Biomarkers · ctDNA / TMB",
    sections: [
      {
        id: "exploratory-biomarkers",
        title: "Exploratory Biomarkers · ctDNA / TMB",
        body: "**ctDNA dynamics.** Serial peripheral blood samples (10 mL EDTA) are collected at C1D1 (baseline), C3D1, C5D1, C9D1, and at end-of-treatment, for quantitative ctDNA variant-allele-frequency assay using a tumor-informed panel (central lab: Natera Signatera). The primary exploratory hypothesis is that an on-treatment ctDNA reduction of ≥ 80% from baseline at C3D1 is associated with durable objective response and prolonged PFS.\n\n**TMB.** Tumor mutational burden is determined by whole-exome sequencing of baseline tumor tissue, reported as non-synonymous mutations per Mb. TMB is analyzed as a continuous variable and at a pre-specified cutoff of 10 mut/Mb.\n\n**Specimen retention.** Biological specimens collected for exploratory research are retained for up to 15 years following the end of the trial, consistent with the informed consent form and GDPR Article 5(1)(e). Participants may request destruction of their residual samples at any time.\n\n**Data sharing.** De-identified exploratory biomarker data will be deposited in the Meridian Translational Data Repository; access is governed by a Data Access Committee and is restricted to pre-approved research use.",
      },
    ],
  },
  {
    num: 11,
    title: "Informed Consent and Ethical Considerations",
    sections: [
      {
        id: "informed-consent-and-ethics",
        title: "Informed Consent and Ethical Considerations",
        body: "The informed consent form (ICF) describes the nature, purpose, procedures, anticipated benefits, and potential risks of the trial in plain language suitable for an 8th-grade reading level, in accordance with the NCI Informed Consent Toolkit (2023). Separate, optional consent modules are provided for:\n\n- Collection and exploratory use of tumor tissue.\n- Serial ctDNA sampling.\n- Retention and future research use of residual biospecimens (up to 15 years).\n- Contact for possible future related research.\n\nParticipation in the trial is voluntary and participants may withdraw at any time without penalty or loss of benefits to which they are otherwise entitled.\n\n**Ethical oversight.** The trial is conducted in accordance with the Declaration of Helsinki (2013), the ICH GCP E6(R2) guideline, and applicable local laws and regulations. Each site obtains independent ethics committee / institutional review board approval prior to initiation. Central IRB (Advarra, USA) provides oversight for participating US sites.\n\n**Data privacy.** Personal data are processed in accordance with 45 CFR 164 (HIPAA) and, for EU sites, the General Data Protection Regulation (GDPR). All participant data in the study database are identified only by a pseudonymous participant number; the linking list remains at the site.\n\n**Conflicts of interest.** All investigators disclose financial interests per the Sponsor's COI policy; no investigator holds Meridian equity above 0.5% of outstanding shares.",
      },
    ],
  },
]

export function findSection(id: string): { chapter: ProtocolChapter; section: ProtocolSection } | null {
  for (const chapter of HORIZON_CHAPTERS) {
    const section = chapter.sections.find((s) => s.id === id)
    if (section) return { chapter, section }
  }
  return null
}
