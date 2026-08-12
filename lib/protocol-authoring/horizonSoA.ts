/**
 * HORIZON-Lung-301 Schedule of Activities, ported from the client's
 * ProtocolForge schedule-matrix demo data: 14 visits x 38 procedures, each
 * procedure carrying a patient-burden and site-burden weight (0-5). The
 * patient-burden and visit-load analytics compute from this grid.
 * Entirely synthetic demonstration content.
 */

export interface SoaVisit {
  id: string
  name: string
  code: string
  type: string
  day: number | null
  week: number | null
  window: string
}

export interface SoaProcedure {
  id: string
  name: string
  category: string
  burdenPt: number
  burdenSite: number
}

export const SOA_VISITS: SoaVisit[] = [
  { id: "scr", name: "Screening", code: "SCR", type: "screening", day: -28, week: null, window: "Day -28 to -1" },
  { id: "bl", name: "Baseline / Day 1", code: "BL", type: "baseline", day: 1, week: 0, window: "Day 1" },
  { id: "c1d1", name: "Cycle 1 Day 1", code: "C1D1", type: "treatment", day: 1, week: 0, window: "—" },
  { id: "c2d1", name: "Cycle 2 Day 1", code: "C2D1", type: "treatment", day: 22, week: 3, window: "± 3 days" },
  { id: "c3d1", name: "Cycle 3 Day 1", code: "C3D1", type: "treatment", day: 43, week: 6, window: "± 3 days" },
  { id: "c4d1", name: "Cycle 4 Day 1", code: "C4D1", type: "treatment", day: 64, week: 9, window: "± 3 days" },
  { id: "c5d1", name: "Cycle 5 Day 1", code: "C5D1", type: "treatment", day: 85, week: 12, window: "± 3 days" },
  { id: "c7d1", name: "Cycle 7 Day 1", code: "C7D1", type: "treatment", day: 127, week: 18, window: "± 3 days" },
  { id: "c9d1", name: "Cycle 9 Day 1", code: "C9D1", type: "treatment", day: 169, week: 24, window: "± 3 days" },
  { id: "c13d1", name: "Cycle 13 Day 1", code: "C13D1", type: "treatment", day: 253, week: 36, window: "± 3 days" },
  { id: "c17d1", name: "Cycle 17 Day 1", code: "C17D1", type: "treatment", day: 337, week: 48, window: "± 3 days" },
  { id: "eot", name: "End of Treatment", code: "EOT", type: "end_of_treatment", day: null, week: null, window: "≤ 7 days after last dose" },
  { id: "fu1", name: "Follow-up 1", code: "FU1", type: "follow_up", day: null, week: null, window: "30 days post last dose" },
  { id: "fu2", name: "Follow-up 2", code: "FU2", type: "follow_up", day: null, week: null, window: "Q6W until death/withdrawal" },
]

export const SOA_PROCEDURES: SoaProcedure[] = [
  { id: "ic", name: "Informed Consent", category: "regulatory", burdenPt: 1, burdenSite: 2 },
  { id: "demog", name: "Demographics", category: "assessment", burdenPt: 0.3, burdenSite: 0.5 },
  { id: "medhx", name: "Medical History", category: "assessment", burdenPt: 0.5, burdenSite: 1 },
  { id: "incex", name: "Inclusion/Exclusion Review", category: "regulatory", burdenPt: 0.5, burdenSite: 1.5 },
  { id: "pe", name: "Physical Examination", category: "assessment", burdenPt: 1, burdenSite: 1 },
  { id: "vs", name: "Vital Signs", category: "vital_signs", burdenPt: 0.5, burdenSite: 0.5 },
  { id: "wt", name: "Body Weight", category: "vital_signs", burdenPt: 0.2, burdenSite: 0.2 },
  { id: "ecog", name: "ECOG Performance Status", category: "assessment", burdenPt: 0.3, burdenSite: 0.5 },
  { id: "ecg", name: "12-Lead ECG", category: "cardiac", burdenPt: 1.5, burdenSite: 2 },
  { id: "cbc", name: "CBC with Differential", category: "laboratory", burdenPt: 1, burdenSite: 1 },
  { id: "cmp", name: "Comprehensive Metabolic Panel", category: "laboratory", burdenPt: 1, burdenSite: 1 },
  { id: "lft", name: "Liver Function Tests", category: "laboratory", burdenPt: 1, burdenSite: 1 },
  { id: "tft", name: "Thyroid Function (TSH, fT3, fT4)", category: "laboratory", burdenPt: 1, burdenSite: 1.2 },
  { id: "coag", name: "Coagulation (PT/INR, aPTT)", category: "laboratory", burdenPt: 1, burdenSite: 1 },
  { id: "ua", name: "Urinalysis", category: "laboratory", burdenPt: 0.5, burdenSite: 0.5 },
  { id: "preg", name: "Pregnancy Test (serum/urine)", category: "laboratory", burdenPt: 0.5, burdenSite: 0.5 },
  { id: "pdl1", name: "PD-L1 IHC (archival tissue)", category: "biomarker", burdenPt: 0.5, burdenSite: 2.5 },
  { id: "egfr", name: "EGFR/ALK Molecular Testing", category: "biomarker", burdenPt: 0.5, burdenSite: 2 },
  { id: "ctdna", name: "ctDNA (liquid biopsy)", category: "biomarker", burdenPt: 2, burdenSite: 3 },
  { id: "tmb", name: "Tumor Mutational Burden", category: "biomarker", burdenPt: 0.5, burdenSite: 2.5 },
  { id: "ct", name: "CT Chest/Abdomen/Pelvis", category: "imaging", burdenPt: 4, burdenSite: 3.5 },
  { id: "brain", name: "Brain MRI (or CT with contrast)", category: "imaging", burdenPt: 5, burdenSite: 4 },
  { id: "bone", name: "Bone Scan (if clinically indicated)", category: "imaging", burdenPt: 3, burdenSite: 3 },
  { id: "recist", name: "Tumor Assessment (RECIST 1.1)", category: "imaging", burdenPt: 5, burdenSite: 5 },
  { id: "drug", name: "Study Drug Administration (IV)", category: "treatment", burdenPt: 5, burdenSite: 5 },
  { id: "doce", name: "Docetaxel Administration (IV)", category: "treatment", burdenPt: 4, burdenSite: 4 },
  { id: "premed", name: "Premedication (dexamethasone)", category: "treatment", burdenPt: 1, burdenSite: 1 },
  { id: "pk", name: "PK Blood Sample", category: "pk", burdenPt: 2.5, burdenSite: 3 },
  { id: "pkser", name: "Serial PK (pre, 0.5h, 1h, 2h, 4h, EOI)", category: "pk", burdenPt: 6, burdenSite: 5 },
  { id: "ada", name: "Anti-Drug Antibodies (ADA)", category: "immunogenicity", burdenPt: 1.5, burdenSite: 2 },
  { id: "qlqc30", name: "EORTC QLQ-C30", category: "pro", burdenPt: 1.5, burdenSite: 1 },
  { id: "qlclc", name: "EORTC QLQ-LC13 (lung module)", category: "pro", burdenPt: 1, burdenSite: 0.8 },
  { id: "eq5d", name: "EQ-5D-5L", category: "pro", burdenPt: 1, burdenSite: 0.8 },
  { id: "ae", name: "Adverse Event Assessment", category: "safety", burdenPt: 1, burdenSite: 1.5 },
  { id: "conmed", name: "Concomitant Medications Review", category: "safety", burdenPt: 0.5, burdenSite: 1 },
  { id: "irae", name: "irAE Monitoring (immune-related)", category: "safety", burdenPt: 1.5, burdenSite: 2 },
  { id: "infus", name: "Infusion Reaction Monitoring", category: "safety", burdenPt: 1, burdenSite: 1.5 },
  { id: "surv", name: "Survival Follow-up (phone/visit)", category: "follow_up", burdenPt: 0.5, burdenSite: 0.5 },
]

/** procedure id -> visit ids where it is performed. */
export const SOA_MATRIX: Record<string, string[]> = {
  "ic": ["scr"],
  "demog": ["scr"],
  "medhx": ["scr"],
  "incex": ["scr", "bl"],
  "pe": ["scr", "bl", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1"],
  "vs": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1"],
  "wt": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot"],
  "ecog": ["scr", "bl", "c3d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot"],
  "ecg": ["scr", "bl", "c3d1", "c7d1", "c13d1", "eot"],
  "cbc": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1"],
  "cmp": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot"],
  "lft": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot"],
  "tft": ["scr", "bl", "c3d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot"],
  "coag": ["scr"],
  "ua": ["scr", "c3d1", "c5d1", "c9d1", "c17d1", "eot"],
  "preg": ["scr", "bl", "c3d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1"],
  "pdl1": ["scr"],
  "egfr": ["scr"],
  "ctdna": ["bl", "c3d1", "c5d1", "c9d1", "c17d1", "eot"],
  "tmb": ["scr"],
  "ct": ["scr", "bl", "c3d1", "c7d1", "c13d1", "eot"],
  "brain": ["scr", "c7d1", "c13d1", "eot"],
  "bone": ["scr"],
  "recist": ["bl", "c3d1", "c7d1", "c13d1", "eot"],
  "drug": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1"],
  "doce": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1"],
  "premed": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1"],
  "pk": ["c1d1", "c2d1", "c3d1", "c5d1", "c9d1", "c17d1", "eot"],
  "pkser": ["c1d1", "c5d1"],
  "ada": ["bl", "c3d1", "c7d1", "c13d1", "eot"],
  "qlqc30": ["bl", "c3d1", "c7d1", "c13d1", "eot", "fu1"],
  "qlclc": ["bl", "c3d1", "c7d1", "c13d1", "eot", "fu1"],
  "eq5d": ["bl", "c3d1", "c7d1", "c13d1", "eot", "fu1"],
  "ae": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1", "fu2"],
  "conmed": ["scr", "bl", "c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1"],
  "irae": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1", "eot", "fu1", "fu2"],
  "infus": ["c1d1", "c2d1", "c3d1", "c4d1", "c5d1", "c7d1", "c9d1", "c13d1", "c17d1"],
  "surv": ["fu2"],
}
