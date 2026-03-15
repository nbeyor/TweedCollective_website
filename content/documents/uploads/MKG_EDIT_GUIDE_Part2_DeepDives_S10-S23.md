# MKG AI Assessment — Edit Guide Part 2 of 3
## Product Deep-Dives + Super Product Vision (S10–S23)
*Target file: `ai-opportunity-roadmap.ts` | Prepared 3/13/2026*

> **How to use this document:** This is Part 2 of 3. Apply after Part 1 is complete.
>
> Each section references a slide by its **final deck position** and includes the `id` field from the TypeScript data file. Status tags:
>
> - **✅ DONE** — Already correctly implemented. Included for verification.
> - **🔧 FIX** — Partially implemented; specific issues described inline.
> - **🆕 BUILD** — Needs to be created from scratch.
>
> **All 14 slides in this section (S10–S23) are present in the current TS file.** The primary task is verification — confirming each slide's data matches the edit guide specifications. Where discrepancies exist, fixes are described.

---

## Standard Format Template (applies to S10–S22)

Every product deep-dive slide uses `componentId: 'ProductValueStorySlide'` and must have these `props`:

| Property | Type | Description |
|----------|------|-------------|
| `sectionLabel` | string | Always `'Product Deep Dive'` |
| `heading` | string | Product name + one-line descriptor |
| `description` | string | What it does (2–3 sentences) |
| `users` | string | Who uses it (1 sentence) |
| `replaces` | string | What it replaces (1 sentence) |
| `defensibility` | object | `{ rating: string, text: string }` — Value Potential score + rationale |
| `valueMapping` | string | Dollar figures with assumption math |
| `leadingIndicators` | string[] | Max 2 items — stated as market conditions, not "what to track" |
| `valueEstimate` | string | Same dollar figures (may overlap with valueMapping) |
| `assumptions` | string[] | Key assumptions underlying the value estimate |

**Scoring methodology (must be consistent across all slides):**
> Value Potential uses three factors: (1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, (3) defensibility vs. foundation model displacement.

**Removed elements (should NOT appear on any deep-dive slide):**
- No separate "Defensibility Scoring" box
- No separate "Value Framework Mapping" box
- No separate "What Has to Be True" box

---

## S10 — DynAImic Content `✅ DONE`
**id:** `dynaimic-content`

Already correct. Verify these values are present:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References 80 FTEs × $120K × 8–15% = $768K–$1,440K
- `leadingIndicators`: 2 items (days from brief to draft < 2 days; 30%+ adoption in 6 months)
- `assumptions`: 2 items

No changes needed.

---

## S11 — Annotation Activation `✅ DONE`
**id:** `annotation-activation`

Already correct. Verify:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References 30 FTEs × $110K × 15–25% = $495K–$825K (shared with Route Reagent)
- `leadingIndicators`: 2 items (error rate < 5%; revision rounds decrease by 1+)

No changes needed.

---

## S12 — Compliance Core `✅ DONE`
**id:** `compliance-core`

Already correct. Verify:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References 20 FTEs × $140K × 5–12% = $140K–$336K + indirect rework value
- `leadingIndicators`: 2 items (first-pass MLR acceptance +10pp; review hours decrease)

No changes needed.

---

## S13 — Route Reagent `✅ DONE`
**id:** `route-reagent`

Already correct. Verify:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References shared value with Annotation Activation — 30 FTEs × $110K × 15–25% = $495K–$825K combined
- `leadingIndicators`: 2 items (error rates drop; reviewer hours decrease)

No changes needed.

---

## S14 — Pantheon `✅ DONE`
**id:** `pantheon`

Already correct. Verify:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References external $640K–$1.8M + internal $263K–$525K (shared with Practice Master)
- `leadingIndicators`: 2 items (subscription attach rate > 10%; renewal rate > 75%)

No changes needed.

---

## S15 — Plexus `✅ DONE`
**id:** `plexus`

Already correct. Verify:
- `defensibility.rating`: `'HIGH'`
- `valueMapping`: References internal $98K–$234K + external $160K–$720K
- `leadingIndicators`: 2 items (win rate increase; client time savings > 25%)

No changes needed.

---

## S16 — Practice Master `✅ DONE`
**id:** `practice-master`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- `valueMapping`: References $263K–$525K shared with Pantheon
- `leadingIndicators`: 2 items (2+ hours saved per project; correction rate < 5%)

No changes needed.

---

## S17 — Sentiment Tracker `✅ DONE`
**id:** `sentiment-tracker`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- `valueMapping`: References 0.3–0.8% lift on ~$50M = $150K–$400K
- `leadingIndicators`: 2 items (5+ accounts using sentiment in 6 months; upsell variance)

No changes needed.

---

## S18 — ChatMKG `✅ DONE`
**id:** `chatmkg`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- Rating text mentions "conditional" nature — defensibility is zero without ION integration
- `valueMapping`: References 200 FTEs × $95K × 2–5% = $380K–$950K
- `leadingIndicators`: 2 items (DAU > 40%; proprietary data sessions > 25%)

No changes needed.

---

## S19 — Verba `✅ DONE`
**id:** `verba`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- Rating text references commoditization risk and need for proprietary data integration
- `valueMapping`: References internal $368K–$690K (shared) + external $0–$180K
- `leadingIndicators`: 2 items (advisory board to deliverable < 3 days; clients request Verba)

No changes needed.

---

## S20 — PerspectivX `✅ DONE`
**id:** `perspectivx`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE-HIGH'`
- Rating text references the validation question (do scores correlate with market outcomes?)
- `valueMapping`: References 8–20 tests × $15K–$30K = $120K–$600K
- `leadingIndicators`: 2 items (correlation on 3+ case studies; repeat rate > 50%)

No changes needed.

---

## S21 — MagpAI `✅ DONE`
**id:** `magpai`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- Rating text references overlap with PerspectivX and consolidation opportunity
- `valueMapping`: References $0–$200K range
- `leadingIndicators`: 2 items (realistic enough per feedback; quarter-over-quarter growth)

No changes needed.

---

## S22 — BloomLab `✅ DONE`
**id:** `bloomlab`

Already correct. Verify:
- `defensibility.rating`: `'MODERATE'`
- Rating text distinguishes BloomLab from Verba and MagpAI
- `valueMapping`: References 8–18 engagements × $25K–$45K = $200K–$810K
- `leadingIndicators`: 2 items (quality scores meet benchmarks; repeat rate > 40%)

No changes needed.

---

## S23 — Super Product Vision: AI Editorial Platform `✅ DONE`
**id:** `super-product`

Already correct. Verify the `SuperProductSlide` component has:
- `stages`: 4 items — DynAImic Content (Stage 1: Create), Annotation Activation (Stage 2: Annotate), Compliance Core (Stage 3: Check), Route Reagent (Stage 4: Validate)
- `opportunities`: 6 items matching the edit guide (end-to-end lifecycle, faster cycle times, subscription pricing, 30–40% engineering efficiency, unified brand knowledge, stronger positioning)
- `features`: 8 items covering the combined feature set
- `efficiencies`: 4 items (single LLM orchestration, shared document model, unified brand knowledge, one integration surface)
- `valueTable`: 3 rows (Medical Writers, Editorial/QA, Regulatory/Compliance) with correct FTE counts and value ranges
- `totalLow`: `'$1,403K'` and `totalHigh`: `'$2,601K'`

The edit guide calls for **opportunities to be framed positively** (not as "problems"). Verify the `opportunities` array uses opportunity/impact framing, not problem framing. The current data looks correct.

No changes needed.

---

## End of Part 2

**Summary of changes required in Part 2:**
- **0 fixes needed** — All 14 slides (S10–S23) are correctly implemented in the current TS file
- **14 slides verified** — Each matches the edit guide specifications

**Next:** Proceed to Part 3 (S24–S29: Value Summaries, Measurement, Governance, Roadmap).
