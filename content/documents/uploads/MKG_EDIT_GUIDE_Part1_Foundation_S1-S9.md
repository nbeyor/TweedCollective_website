# MKG AI Assessment — Edit Guide Part 1 of 3
## Foundation Slides (S1–S9)
*Target file: `ai-opportunity-roadmap.ts` | Prepared 3/13/2026*

> **How to use this document:** This is Part 1 of 3. Apply these edits first, then move to Part 2.
>
> Each section references a slide by its **final deck position** (S1–S9) and includes the `id` field from the TypeScript data file so you can locate the exact object to edit. A status tag tells you what to do:
>
> - **✅ DONE** — Already correctly implemented in the current TS file. No changes needed. Included here for completeness so you can verify.
> - **🔧 FIX** — Partially implemented but has specific issues to correct. The fix is described inline.
> - **🆕 BUILD** — Needs to be created from scratch.
>
> **Important conventions for all edits:**
> - The data file uses `SlideData[]` with `componentId` referencing React components. Do not change `componentId` values.
> - All text content lives inside `props`. Edit `props` values only.
> - Escape single quotes in strings: `\'`
> - When adding new properties to existing objects, match the naming conventions already in the file (camelCase, same nesting depth).

---

## Master Slide Sequence (Full Deck — 29 Slides)

This table covers all 29 slides for orientation. Parts 2 and 3 cover S10–S23 and S24–S29 respectively.

| Final # | id (in TS) | Title | Status |
|------:|-----------|-------|--------|
| S1 | `cover` | Cover Slide | ✅ DONE |
| S2 | `executive-summary` | Executive Summary | ✅ DONE |
| S3 | `evaluation-framework` | Evaluation Framework | ✅ DONE |
| S4 | `business-context` | Business Context & Competitive Landscape | ✅ DONE |
| S5 | `kinetics` | AI Initiative Inventory — KINETICS (Tiers 1–3) | ✅ DONE |
| S6 | `diffusion` | AI Initiative Inventory — DIFFUSION (Tier 4) | 🔧 FIX |
| S7 | `differentiating-assets` | Differentiating Assets & Moat Assessment | ✅ DONE |
| S8 | `ion-data-lake` | ION Data Lake Deep Dive | ✅ DONE |
| S9 | `value-framework` | AI Value Framework | ✅ DONE |
| S10 | `dynaimic-content` | DynAImic Content | Part 2 |
| S11 | `annotation-activation` | Annotation Activation | Part 2 |
| S12 | `compliance-core` | Compliance Core | Part 2 |
| S13 | `route-reagent` | Route Reagent | Part 2 |
| S14 | `pantheon` | Pantheon | Part 2 |
| S15 | `plexus` | Plexus | Part 2 |
| S16 | `practice-master` | Practice Master | Part 2 |
| S17 | `sentiment-tracker` | Sentiment Tracker | Part 2 |
| S18 | `chatmkg` | ChatMKG | Part 2 |
| S19 | `verba` | Verba | Part 2 |
| S20 | `perspectivx` | PerspectivX | Part 2 |
| S21 | `magpai` | MagpAI | Part 2 |
| S22 | `bloomlab` | BloomLab | Part 2 |
| S23 | `super-product` | Super Product Vision | Part 2 |
| S24 | `internal-productivity-value` | Internal Productivity Value Summary | Part 3 |
| S25 | `external-revenue` | External Revenue Upside | Part 3 |
| S26 | `combined-value-waterfall` | Combined Value Waterfall | Part 3 |
| S27 | `leading-indicators` | Leading Indicators & Measurement | Part 3 |
| S28 | `governance` | Governance & Change Management | Part 3 |
| S29 | `roadmap` | Execution Roadmap | Part 3 |

---

## S1 — Cover `✅ DONE`
**id:** `cover`

Already correct. Date reads `March 13, 2026`. No changes needed.

---

## S2 — Executive Summary `✅ DONE`
**id:** `executive-summary`

Already correct. The `summaryText` includes inline radar score rationale for all six axes. The `radarChart.values` array matches the scores (6, 7, 6, 6, 8, 4). `strengths`, `risks`, and `immediateFocus` are all populated. No changes needed.

---

## S3 — Evaluation Framework `✅ DONE`
**id:** `evaluation-framework`

Already correct. All 7 framework stages are present in the `items` array. The `insightBox.text` footer is correct. No changes needed.

---

## S4 — Business Context & Competitive Landscape `✅ DONE`
**id:** `business-context`

Already correct. The following fields are all present and populated:
- `revenueMixSource` — citation footnote for revenue mix
- `costStructureSource` — citation footnote for cost structure
- `economicSensitivityRationale` — qualifying paragraph for sensitivity scoring

No changes needed.

---

## S5 — AI Initiative Inventory — KINETICS (Tiers 1–3) `✅ DONE`
**id:** `kinetics`

Already correct. The slide has:
- `valuePotentialFootnote` with the three-factor scoring methodology
- Three `sections` (Tier 1, Tier 2, Tier 3) each with `rows` containing `name`, `description`, `valueSource`, `valuePotential`, and `rationale`
- Value sources use the correct bucket names (Cost, Speed, Productivity, Pricing Power)
- Descriptions are trimmed to 1–2 lines
- `callout` referencing the Super Product Vision

No changes needed.

---

## S6 — AI Initiative Inventory — DIFFUSION (Tier 4) `🔧 FIX`
**id:** `diffusion`

### What's wrong

The DIFFUSION slide does not match the format of S5 (KINETICS). Currently it uses a simple table with only 4 columns (`Initiative`, `Positioning`, `Revenue Model`, `Displacement Risk`) and has **no** Value Potential scores, **no** per-item rationale, and **no** qualifying footnote.

The edit guide requires S6 to match S5's format exactly: same column structure, same Value Potential footnote, same per-item rationale.

### Required fix

Replace the current `diffusion` slide object with the following structure. The `componentId` should change from `DiffusionSlide` to `AssessmentTableSlide` (same as S5) so the rendering matches. If `DiffusionSlide` must be preserved for layout reasons, then add the missing data properties to it instead.

**Option A — Switch to `AssessmentTableSlide` (preferred, ensures format match with S5):**

```typescript
{
  id: 'diffusion',
  title: 'AI Initiatives — Client-Facing (DIFFUSION)',
  type: 'custom',
  content: {
    type: 'custom',
    componentId: 'AssessmentTableSlide',
    props: {
      sectionLabel: 'Section 03 — External',
      heading: 'DIFFUSION — Client-Facing AI Products',
      subtitle: 'Tier 4: Revenue-generating and differentiating AI offerings',
      valuePotentialFootnote: 'Value Potential reflects a qualitative assessment of each initiative\'s ability to create measurable business impact within 12 months, considering: (1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, (3) defensibility of the AI-enhanced output versus foundation model displacement. "High" = large addressable base, production-ready or near-ready, defensible through proprietary data or workflow integration. "Moderate" = meaningful but narrower impact, or earlier-stage maturity. "Low" = limited addressable base or high displacement risk.',
      sections: [
        {
          title: 'Tier 4: Client-Facing / DIFFUSION Products',
          rows: [
            { name: 'Pantheon', description: 'HCP search / profiling (subscription).', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'High', displacementRisk: 'Lower', rationale: 'Subscription model shifts 81qd to recurring revenue. Defensible when anchored in proprietary engagement data, not just commercial claims.' },
            { name: 'Plexus', description: 'Influence mapping and network analytics.', valueSource: 'Pricing Power', valuePotential: 'High', displacementRisk: 'Lower', rationale: 'Most defensible analytics asset. Influence network modeling on proprietary engagement data cannot be purchased externally.' },
            { name: 'PerspectivX', description: 'Concept scoring via HCP persona simulation.', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'Moderate–High', displacementRisk: 'Moderate', rationale: 'Differentiated if personas are built on real MKG research data. Displacement risk rises if personas are generic LLM approximations.' },
            { name: 'Verba', description: 'Advisory board synthesis.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate', displacementRisk: 'Higher', rationale: 'Core functionality (transcript-to-summary) is increasingly commoditized. Defensibility requires integration with proprietary longitudinal data.' },
            { name: 'MagpAI', description: 'Stakeholder simulation / conversational intel.', valueSource: 'Pricing Power', valuePotential: 'Moderate', displacementRisk: 'Moderate–Higher', rationale: 'Overlaps with PerspectivX on persona simulation. Earlier stage. Consolidation opportunity with PerspectivX.' },
            { name: 'BloomLab', description: 'Real-time qual/quant hybrid research.', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'Moderate', displacementRisk: 'Lower–Moderate', rationale: 'Novel real-time research methodology is genuinely differentiated. Value depends on proving insight quality parity with traditional qual.' },
            { name: 'Orion', description: 'Patient identification analytics.', valueSource: 'Pricing Power', valuePotential: 'Moderate', displacementRisk: 'Moderate', rationale: 'Patient identification analytics is a real use case but faces competition from IQVIA, Komodo.' },
            { name: 'InfluenceLink', description: 'Dissemination via Plexus-identified leaders.', valueSource: 'Speed-to-Close', valuePotential: 'Moderate', displacementRisk: 'Lower', rationale: 'Dissemination through Plexus-identified leaders. Value is bundled with Plexus, not standalone.' },
          ],
        },
      ],
    },
  },
},
```

**Option B — If `DiffusionSlide` component must be kept:** Add `valuePotential`, `rationale`, and `valuePotentialFootnote` properties to the existing props, and update the `DiffusionSlide` component to render them. The data values are the same as Option A above.

### Also fix: comment numbering

The TS comment above this slide says `SLIDE 6` which is correct. No change needed to the comment.

---

## S7 — Differentiating Assets & Moat Assessment `✅ DONE`
**id:** `differentiating-assets`

Already correct. The `subtitle` contains the moat scoring methodology. The `dataFlow.outputs` array includes all 9 ION-powered products. The `insightText` is populated. No changes needed.

---

## S8 — ION Data Lake Deep Dive `✅ DONE`
**id:** `ion-data-lake`

Already correct. Three-column layout (Acquisition, Analytics, Activation) is present. The `requirements` array has all 4 items (Organized, Mastered, API-Accessible, Secure & Compliant). No changes needed.

---

## S9 — AI Value Framework `✅ DONE`
**id:** `value-framework`

Already correct. `internalBuckets` has 3 items (Cost, Speed, Productivity). `externalBuckets` has 2 items (Pricing Power, Speed-to-Close). The `description` field provides context. No changes needed.

**Note:** The edit guide specifies internal on the left and external on the right. This is a layout/component concern, not a data concern. If the `ValueFrameworkSlide` component renders internal before external, the data order already supports this. Verify in the rendered output.

---

## End of Part 1

**Summary of changes required in Part 1:**
- **1 fix:** S6 (DIFFUSION) — restructure to match S5 format with Value Potential, rationale, and footnote
- **8 slides verified:** S1–S5, S7–S9 are all correctly implemented

**Next:** Proceed to Part 2 (S10–S23: Product Deep-Dives + Super Product Vision).
