# MKG AI Assessment — Edit Guide Part 3 of 3
## Value Summaries, Measurement, Governance & Roadmap (S24–S29)
*Target file: `ai-opportunity-roadmap.ts` | Prepared 3/13/2026*

> **How to use this document:** This is Part 3 of 3. Apply after Parts 1 and 2 are complete.
>
> Each section references a slide by its **final deck position** and includes the `id` field from the TypeScript data file. Status tags:
>
> - **✅ DONE** — Already correctly implemented. Included for verification.
> - **🔧 FIX** — Partially implemented; specific issues described inline.
> - **🆕 BUILD** — Needs to be created from scratch.

---

## S24 — Internal Productivity Value Summary `✅ DONE`
**id:** `internal-productivity-value`

Already correct. The slide uses `componentId: 'InternalProductivityValueSlide'` with a `rows` array containing 7 initiative groups, each with `initiative`, `primaryValueDriver`, `ftes`, `comp`, `lowUplift`, `lowValue`, `highUplift`, `highValue`, and `rationale`.

Verify these totals:
- `totalLow`: `'$2.5M'`
- `totalHigh`: `'$5.0M'`

No changes needed.

---

## S25 — External Revenue Upside `✅ DONE`
**id:** `external-revenue`

Already correct. The slide uses `componentId: 'ExternalRevenueSlide'` with a `rows` array containing 7 products, each with `product`, `primaryValueDriver`, `lowAssumptions`, `lowRevenue`, `highAssumptions`, `highRevenue`, and `rationale`.

Verify these totals:
- `totalLow`: `'$1.3M'`
- `totalHigh`: `'$4.7M'`

No changes needed.

---

## S26 — Combined Value Waterfall Chart `✅ DONE`
**id:** `combined-value-waterfall`

Already correct. The slide uses `componentId: 'CombinedValueWaterfallSlide'` with:
- `internalItems`: 7 bars with `label`, `low`, `high`, `midpoint`
- `externalItems`: 7 bars with same structure
- `internalTotal`: `{ low: '$2.5M', high: '$5.0M' }`
- `externalTotal`: `{ low: '$1.3M', high: '$4.7M' }`
- `grandTotal`: `{ low: '$3.8M', high: '$9.7M', pctLow: '2.5%', pctHigh: '6.5%' }`
- `footnote` about labor cost equivalent

No changes needed.

---

## S27 — Leading Indicators & Measurement `🔧 FIX`
**id:** `leading-indicators`

### What's already correct
- `componentId: 'LeadingIndicatorsSlide'` — correct
- `coreArgument` text — correct
- `leadingIndicators` array with 9 rows — correct data values
- `makingMeasurementWork` array with 7 items — correct
- `recommendation` text — correct

### Fix 1: Comment numbering (cosmetic but helps agent navigation)

The TS comment above this slide currently reads:
```
// SLIDE 26: LEADING INDICATORS & MEASUREMENT (Section 17)
```

**Change to:**
```
// SLIDE 27: LEADING INDICATORS & MEASUREMENT (Section 17)
```

This is a numbering bug — the prior slide (Combined Value Waterfall) is SLIDE 26, so this one should be SLIDE 27.

### Fix 2: Stale slide reference in `sourceSlides`

One row in the `leadingIndicators` array still uses old `p`-number references. Find this row:

```typescript
{ category: 'Cycle Time', indicator: 'Days from brief to MLR submission', sourceSlides: 'Editorial pipeline (p9–p12)', howToMeasure: '...' },
```

**Change `sourceSlides` to:**
```typescript
sourceSlides: 'DynAImic Content, Annotation Activation, Compliance Core, Route Reagent'
```

This replaces the stale `(p9–p12)` reference with the actual product names, which is consistent with how all other rows in the table reference their source slides (by product name, not slide number).

---

## S28 — Governance & Change Management `✅ DONE` *(with one cosmetic comment fix)*
**id:** `governance`

### What's already correct
- `componentId: 'ChangeManagementSlide'` — correct
- `readiness.items` array with 4 dimensions, each containing dimension name, score rationale, numeric score, and color — correct
- `meetingStructure` array with 4 rows (Weekly, Biweekly, Monthly, Quarterly) — correct
- `optionalAITalentCallout` text — correct

All data is correctly implemented.

### Cosmetic comment fix

The TS comment above this slide currently reads:
```
// SLIDE 27: GOVERNANCE & CHANGE MANAGEMENT (Section 18)
```

**Change to:**
```
// SLIDE 28: GOVERNANCE & CHANGE MANAGEMENT (Section 18)
```

---

## S29 — Execution Roadmap `✅ DONE` *(with one cosmetic comment fix)*
**id:** `roadmap`

### What's already correct
- `componentId: 'RoadmapPhasedSlide'` — correct
- `phases` array with 3 phases (Month 1, Month 2, Months 3–4) — correct
- `fourCards` array with 4 strategic priorities — correct

**Note on Gantt format:** The edit guide calls for a full Gantt chart with 7 workstreams across Months 1–6+. The current TS file uses a phased layout (`RoadmapPhasedSlide`) with 3 phases plus 4 priority cards. This is a different visual treatment but covers the same content. The data is complete and correct for the current component. If a true Gantt component (`RoadmapGanttSlide`) is built later, the data would need restructuring into workstream rows — but the content itself is all present.

### Cosmetic comment fix

The TS comment above this slide currently reads:
```
// SLIDE 28: EXECUTION ROADMAP (Section 19)
```

**Change to:**
```
// SLIDE 29: EXECUTION ROADMAP (Section 19)
```

---

## End of Part 3

**Summary of changes required in Part 3:**

| Slide | Fix Type | Description |
|-------|----------|-------------|
| S27 | 🔧 Comment | Change `SLIDE 26` → `SLIDE 27` in TS comment |
| S27 | 🔧 Data | Change `sourceSlides: 'Editorial pipeline (p9–p12)'` → `'DynAImic Content, Annotation Activation, Compliance Core, Route Reagent'` |
| S28 | 🔧 Comment | Change `SLIDE 27` → `SLIDE 28` in TS comment |
| S29 | 🔧 Comment | Change `SLIDE 28` → `SLIDE 29` in TS comment |

All other slides (S24–S26) are correctly implemented. The 3 comment fixes are cosmetic but will prevent confusion in future agent edits.

---

## Cross-Part Summary: All Changes Across Parts 1–3

| Part | Slide | Fix | Severity |
|------|-------|-----|----------|
| Part 1 | S6 (DIFFUSION) | Restructure to match S5 format: add Value Potential, rationale, footnote | **Substantive** |
| Part 3 | S27 (Leading Indicators) | Fix stale `p9–p12` reference in `sourceSlides` | **Minor data fix** |
| Part 3 | S27, S28, S29 | Fix comment slide numbers (26→27, 27→28, 28→29) | **Cosmetic** |

Everything else across all 29 slides is correctly implemented.

---

*End of Edit Guide — All Parts Complete*

*Document prepared by Tweed Collective | March 13, 2026*
