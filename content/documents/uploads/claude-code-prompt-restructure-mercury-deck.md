# Claude Code Prompt: Restructure Mercury Deck to 4-Phase Framework

## Context

We're restructuring `mercury-buyer-ai-diligence.ts` to follow a new 4-phase AI due diligence framework. The file exports a `slides: SlideData[]` array that defines the slide order, titles, and metadata for a 39-slide presentation deck (currently 34 core slides + 5 appendix slides).

**The rendering component (`MercuryDiligenceSlide`) uses `slideId` to look up content. This restructure involves TWO categories of ID changes — handle them carefully:**

1. **Most slides: do NOT change `slideId` values** — only reorder the array entries and update `title` strings where noted.
2. **Five former appendix slides: rename both `id` AND `slideId`** — these are being promoted from appendix to main deck. See the ID rename table in Task 2.

---

## Task 1: Add new "Framework Overview" slide after Cover (position 2)

Insert a new slide at array index 1 (after `cover`, before `executive-summary`):

```typescript
{
  id: 'framework-overview',
  title: 'How We Evaluated Mercury\'s AI Portfolio',
  type: 'custom',
  content: {
    type: 'custom',
    componentId: 'MercuryDiligenceSlide',
    props: { slideId: 'framework-overview' }
  }
}
```

This slide will need a corresponding component implementation (separate task), but for now just add the data entry. It presents the 4-phase framework:
- **01 — Business Value & Growth Thesis**: Revenue model, cost structure, competitive positioning. Map internal/external value pools and identify where AI creates highest-leverage P&L impact.
- **02 — AI Initiatives & Disruption Risk**: Inventory all active AI initiatives. Evaluate each individually — what it does, who uses it, defensibility, and displacement risk from foundation models and incumbents.
- **03 — Team, Assets & Defensibility**: Assess whether the team can execute the AI roadmap. Score product, data, channel, and relationship assets for durability.
- **04 — ROI Quantification & Synergy Roadmap**: Quantify value creation through synergies, leading indicator measurement, and a phased execution plan.

---

## Task 2: Reorder slides into the new 4-phase structure

The new slide order (by `id`) must be:

### Front Matter (slides 1–3)
1. `cover`
2. `framework-overview` ← NEW
3. `executive-summary` (title unchanged)

### Phase 1 — Business Value & Growth Thesis (slides 4–8)
4. `growth-thesis-exec` → **change title to:** `"Phase 1: Growth Thesis Alignment — Executive Summary"`
5. `growth-projections` (title unchanged)
6. `offering-ai-growth-matrix` (title unchanged)
7. `ai-roadmap-fit` (title unchanged)
8. `scenarios` (title unchanged)

### Phase 2 — AI Initiatives & Disruption Risk (slides 9–22)
This phase merges the old disruption chapter and AI assessment chapter. Present disruption first (sets up the stakes), then AI inventory (shows what the target built to address them).

9. `disruption-risk-exec` → **change title to:** `"Phase 2: Disruption Risk — Executive Summary"`
10. `who-could-disrupt` (title unchanged)
11. `what-they-would-build` (title unchanged)
12. `what-must-change` (title unchanged)
13. `build-it-today` (title unchanged)
14. `ai-assessment-exec` → **change title to:** `"AI Assessment — Executive Summary"`
15. `ai-inventory` (title unchanged)
16. `architecture-readiness` (title unchanged)
17. `ai-value-framework` (title unchanged)
18. `ai-value-proof` (title unchanged)
19. `internal-value-proofs` (title unchanged)

### Phase 3 — Team, Assets & Defensibility (slides 20–30)
This phase merges old asset value and team/ops chapters. The budget product deep dive (formerly appendix) is inlined after the product asset slide.

20. `asset-value-exec` → **change title to:** `"Phase 3: Underlying Asset Value — Executive Summary"`
21. `product-asset` (title unchanged)
22. `budget-deep-dive` → **change title to:** `"Budget Product Deep Dive"` ← RENAMED from `appendix-budget-deep-dive`
23. `data-asset` (title unchanged)
24. `channel-asset` (title unchanged)
25. `relationship-asset` (title unchanged)
26. `team-ops-exec` → **change title to:** `"Team + Operating Model — Executive Summary"`
27. `people-roles` (title unchanged)
28. `functional-coverage` (title unchanged)
29. `operating-model-maturity` (title unchanged)

### Phase 4 — ROI Quantification & Synergy Roadmap (slides 30–38)
Former appendix slides for CTMS synergy, internal transformation, build vs. buy, and data flywheel are inlined here alongside the existing synergy slides.

30. `synergies-exec` → **change title to:** `"Phase 4: Buyer ↔ Target Synergies — Executive Summary"`
31. `synergy-detail` (title unchanged)
32. `ctms-synergy` → **change title to:** `"CTMS Synergy — Mercury as the Missing ClinSphere Module"` ← RENAMED from `appendix-ctms-synergy`
33. `synergy-waves` (title unchanged)
34. `internal-transformation` → **change title to:** `"Internal WCG Transformation Opportunity"` ← RENAMED from `appendix-internal-transformation`
35. `build-vs-buy` → **change title to:** `"Build vs. Buy — Cost to Replicate"` ← RENAMED from `appendix-build-vs-buy`
36. `data-flywheel` → **change title to:** `"WCG Data Flywheel"` ← RENAMED from `appendix-data-flywheel`
37. `priority-initiatives` (title unchanged)
38. `quantification-placeholder` (title unchanged)
39. `sensitivity` (title unchanged)

### Closing (slide 40)
40. `consolidated-gaps` (title unchanged)

### Appendix ID renames

These five slides are being promoted from appendix to main deck. Update BOTH the `id` field AND the `slideId` inside `props`:

| Old `id` / `slideId` | New `id` / `slideId` | New title |
|---|---|---|
| `appendix-ctms-synergy` | `ctms-synergy` | CTMS Synergy — Mercury as the Missing ClinSphere Module |
| `appendix-budget-deep-dive` | `budget-deep-dive` | Budget Product Deep Dive |
| `appendix-internal-transformation` | `internal-transformation` | Internal WCG Transformation Opportunity |
| `appendix-build-vs-buy` | `build-vs-buy` | Build vs. Buy — Cost to Replicate |
| `appendix-data-flywheel` | `data-flywheel` | WCG Data Flywheel |

**IMPORTANT:** The `MercuryDiligenceSlide` rendering component uses `slideId` in a switch/case or lookup to find content. After renaming IDs here, you MUST also update the corresponding keys in the component file so they match. Search for each old `appendix-*` string in the component and replace with the new short ID.

---

## Task 3: Update the Executive Summary slide's internal section references

The `executive-summary` slide's component currently renders section headers that follow the old chapter structure. Update the component (in the `MercuryDiligenceSlide` renderer, wherever `slideId === 'executive-summary'` is handled) to group the slide titles under the new 4-phase headers instead of the old chapter letters:

**Old structure (replace this):**
```
Front Matter
  1. Cover
  2. Executive Summary

Chapter A — Growth Thesis Alignment
  3–7 ...

Chapter B — Disruption Risk
  8–12 ...

Chapter C — Underlying Asset Value
  13–17 ...

Chapter D — Team + Operating Model
  18–21 ...

Chapter E — AI Assessment
  22–27 ...

Chapter F — Buyer ↔ Target Synergies
  28–33 ...

Appendix
  A-1 through A-5 ...
```

**New structure (use this):**
```
Front Matter
  1. Cover
  2. Framework Overview
  3. Executive Summary

Phase 1 — Business Value & Growth Thesis
  4. Growth Thesis Alignment — Executive Summary
  5. Growth Projections — Snapshot + Assumptions
  6. Offering + AI Initiatives ↔ Growth Drivers
  7. AI Roadmap Fit to Growth Thesis
  8. Scenarios for Growth & Disruption Outcomes

Phase 2 — AI Initiatives & Disruption Risk
  9. Disruption Risk — Executive Summary
  10. Who Could Disrupt
  11. What the Disruptor Would Build
  12. What Must Change for Disruption to Be True
  13. "Build-It-Today" Replicability
  14. AI Assessment — Executive Summary
  15. AI Inventory (What Exists)
  16. Architecture Snapshot + Readiness
  17. AI Value Framework
  18. AI Value & Proof — External Examples
  19. Internal Value Proofs

Phase 3 — Team, Assets & Defensibility
  20. Underlying Asset Value — Executive Summary
  21. Product Asset Strength
  22. Budget Product Deep Dive
  23. Data Asset Strength
  24. Channel Asset Strength
  25. Relationship Asset Strength
  26. Team + Operating Model — Executive Summary
  27. People & Roles
  28. Functional Coverage & Resourcing
  29. Operating Model Maturity

Phase 4 — ROI Quantification & Synergy Roadmap
  30. Buyer ↔ Target Synergies — Executive Summary
  31. Synergy Detail (Selected Connections)
  32. CTMS Synergy — Mercury as the Missing ClinSphere Module
  33. Synergy Pathways (3 Waves)
  34. Internal WCG Transformation Opportunity
  35. Build vs. Buy — Cost to Replicate
  36. WCG Data Flywheel
  37. Priority Initiatives — Assumptions + Uplift
  38. Quantification Placeholder
  39. Sensitivity: Impact on Growth Curve

Closing
  40. Open Questions & Gaps
```

---

## Task 4: Update chapter subtitle annotations in slide components

Several slides display a chapter subtitle badge/annotation (e.g., "CHAPTER A — GROWTH THESIS ALIGNMENT"). Find these in the `MercuryDiligenceSlide` component and update them:

| slideId | Old subtitle/badge | New subtitle/badge |
|---------|-------------------|-------------------|
| `growth-thesis-exec` | CHAPTER A — GROWTH THESIS ALIGNMENT | PHASE 1 — BUSINESS VALUE & GROWTH THESIS |
| `disruption-risk-exec` | CHAPTER B — DISRUPTION RISK | PHASE 2 — AI INITIATIVES & DISRUPTION RISK |
| `asset-value-exec` | CHAPTER C — UNDERLYING ASSET VALUE | PHASE 3 — TEAM, ASSETS & DEFENSIBILITY |
| `team-ops-exec` | CHAPTER D — TEAM + OPERATING MODEL | PHASE 3 — TEAM, ASSETS & DEFENSIBILITY |
| `ai-assessment-exec` | CHAPTER E — AI ASSESSMENT | PHASE 2 — AI INITIATIVES & DISRUPTION RISK |
| `synergies-exec` | CHAPTER F — BUYER ↔ TARGET SYNERGIES | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `priority-initiatives` | CHAPTER G — QUANTIFIED IMPACT | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `sensitivity` | CHAPTER G — QUANTIFIED IMPACT | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `quantification-placeholder` | CHAPTER G — QUANTIFIED IMPACT | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |

Note that `team-ops-exec` and `ai-assessment-exec` change phase assignments — team/ops moves from its own chapter to Phase 3, and AI assessment moves from its own chapter to Phase 2. Look for these strings in the component renderer (they may be in a switch/case, a lookup object, or inline JSX) and update all instances.

Also update the former appendix slides — these are now inlined within their respective phases and should carry phase badges, not "Appendix" or "Deep Dive" labels:

| slideId (NEW) | Old | New |
|---------------|-----|-----|
| `budget-deep-dive` | Any "Appendix" or "A-2" reference | PHASE 3 — TEAM, ASSETS & DEFENSIBILITY |
| `ctms-synergy` | Any "Appendix" or "A-1" reference | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `internal-transformation` | Any "Appendix" or "A-3" reference | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `build-vs-buy` | Any "Appendix" or "A-4" reference | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |
| `data-flywheel` | Any "Appendix" or "A-5" reference | PHASE 4 — ROI QUANTIFICATION & SYNERGY ROADMAP |

---

## Validation

After making changes, verify:
1. The `slides` array has exactly **40 entries** (39 original + 1 new framework-overview slide)
2. Every `slideId` in the `props` objects matches its corresponding `id` field
3. The five former appendix slides use their NEW short IDs (no `appendix-` prefix) in both `id` and `props.slideId`
4. The new `framework-overview` entry exists at index 1
5. No duplicate `id` values exist in the array
6. The corresponding `slideId` keys in the `MercuryDiligenceSlide` component have been updated for the five renamed slides
7. The TypeScript compiles without errors

---

## Files to modify
- `mercury-buyer-ai-diligence.ts` — slide array reorder + title updates + new entry + appendix ID renames (Tasks 1, 2)
- The `MercuryDiligenceSlide` component file (wherever the switch/case or lookup handles `slideId` values) — executive summary content update + chapter badge updates + renamed appendix slide keys (Tasks 3, 4, and the component side of the ID renames from Task 2)
