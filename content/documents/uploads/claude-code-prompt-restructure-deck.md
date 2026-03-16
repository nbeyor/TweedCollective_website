# Claude Code Prompt: Restructure Apollo Deck to 4-Phase Framework

## Context

We're restructuring `apollo-wcg-ai-diligence.ts` to follow a new 4-phase AI due diligence framework. The file exports a `slides: SlideData[]` array that defines the slide order, titles, and metadata for a 32-slide (+4 deep dive appendix) presentation deck.

**The rendering component (`ApolloDiligenceSlide`) uses `slideId` to look up content. Do NOT change any `slideId` values — only reorder the array entries and update `title` strings where noted.**

---

## Task 1: Add new "Framework Overview" slide after Cover (position 2)

Insert a new slide at array index 1 (after `cover`, before `executive-summary`):

```typescript
{
  id: 'framework-overview',
  title: 'How We Evaluated Apollo\'s AI Portfolio',
  type: 'custom',
  content: {
    type: 'custom',
    componentId: 'ApolloDiligenceSlide',
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

### Phase 2 — AI Initiatives & Disruption Risk (slides 9–20)
This phase merges the old Chapter B (disruption) and Chapter E (AI assessment). Present disruption first (sets up the stakes), then AI inventory (shows what the target built to address them). The two disruption-related deep dives are inlined at the end of the disruption block.

9. `disruption-risk-exec` → **change title to:** `"Phase 2: Disruption Risk — Executive Summary"`
10. `who-could-disrupt` (title unchanged)
11. `what-they-would-build` (title unchanged)
12. `what-must-change` (title unchanged)
13. `build-it-today` (title unchanged)
14. `dd-veeva-consolidation` → **change title to:** `"Veeva — Long-Term Platform Consolidation Threat"`
15. `dd-econsent-landscape` → **change title to:** `"eICF & eConsent — Competitive Landscape"`
16. `ai-assessment-exec` → **change title to:** `"AI Assessment — Executive Summary"`
17. `ai-inventory` (title unchanged)
18. `architecture-readiness` (title unchanged)
19. `ai-value-framework` (title unchanged)
20. `ai-value-proof` (title unchanged)

### Phase 3 — Team, Assets & Defensibility (slides 21–31)
This phase merges old Chapter C (asset value) and Chapter D (team & ops). The two asset/data deep dives are inlined at the end.

21. `asset-value-exec` → **change title to:** `"Phase 3: Underlying Asset Value — Executive Summary"`
22. `product-asset` (title unchanged)
23. `data-asset` (title unchanged)
24. `channel-asset` (title unchanged)
25. `relationship-asset` (title unchanged)
26. `team-ops-exec` → **change title to:** `"Team + Operating Model — Executive Summary"`
27. `people-roles` (title unchanged)
28. `functional-coverage` (title unchanged)
29. `operating-model-maturity` (title unchanged)
30. `dd-data-rights` → **change title to:** `"Data Rights — Content vs. Metadata"`
31. `dd-data-architecture` → **change title to:** `"Data Architecture Gap Assessment & Modernization Cost"`

### Phase 4 — ROI Quantification & Synergy Roadmap (slides 32–37)
32. `synergies-exec` → **change title to:** `"Phase 4: Buyer ↔ Target Synergies — Executive Summary"`
33. `synergy-matrix` (title unchanged)
34. `synergy-detail` (title unchanged)
35. `synergy-waves` (title unchanged)
36. `priority-initiatives` (title unchanged)
37. `sensitivity` (title unchanged)

---

## Task 3: Update the Executive Summary slide's internal section references

The `executive-summary` slide's component currently renders section headers that follow the old A–G chapter structure. Update the component (in the `ApolloDiligenceSlide` renderer, wherever `slideId === 'executive-summary'` is handled) to group the slide titles under the new 4-phase headers instead of the old chapter letters:

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
  22–26 ...

Chapter F — Buyer ↔ Target Synergies
  27–30 ...

Chapter G — Quantified Impact
  31–32 ...
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
  14. Veeva — Long-Term Platform Consolidation Threat
  15. eICF & eConsent — Competitive Landscape
  16. AI Assessment — Executive Summary
  17. AI Inventory (What Exists)
  18. Architecture Snapshot + Readiness
  19. AI Value Framework
  20. AI Value & Proof — Examples

Phase 3 — Team, Assets & Defensibility
  21. Underlying Asset Value — Executive Summary
  22. Product Asset Strength
  23. Data Asset Strength
  24. Channel Asset Strength
  25. Relationship Asset Strength
  26. Team + Operating Model — Executive Summary
  27. People & Roles
  28. Functional Coverage & Resourcing
  29. Operating Model Maturity
  30. Data Rights — Content vs. Metadata
  31. Data Architecture Gap Assessment & Modernization Cost

Phase 4 — ROI Quantification & Synergy Roadmap
  32. Buyer ↔ Target Synergies — Executive Summary
  33. Synergy Connections Mapped to Assets
  34. Synergy Detail (Selected Connections)
  35. Synergy Pathways (3 Waves)
  36. Priority Initiatives — Assumptions + Uplift
  37. Sensitivity: Impact on Growth Curve
```

---

## Task 4: Update chapter subtitle annotations in slide components

Several slides display a chapter subtitle badge/annotation (e.g., "CHAPTER A — GROWTH THESIS ALIGNMENT"). Find these in the `ApolloDiligenceSlide` component and update them:

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

Note that `team-ops-exec` and `ai-assessment-exec` change phase assignments — team/ops moves from its own chapter to Phase 3, and AI assessment moves from its own chapter to Phase 2. Look for these strings in the component renderer (they may be in a switch/case, a lookup object, or inline JSX) and update all instances.

Also update the deep dive slides — these are now inlined within their respective phases and should carry the same phase badge as their siblings, not "Appendix" or "Deep Dive" labels:

| slideId | Old | New |
|---------|-----|-----|
| `dd-veeva-consolidation` | Any "Chapter B" or "Deep Dive" or "Appendix" reference | PHASE 2 — AI INITIATIVES & DISRUPTION RISK |
| `dd-econsent-landscape` | Any "Chapter B" or "Deep Dive" or "Appendix" reference | PHASE 2 — AI INITIATIVES & DISRUPTION RISK |
| `dd-data-rights` | Any "Chapter C" or "Deep Dive" or "Appendix" reference | PHASE 3 — TEAM, ASSETS & DEFENSIBILITY |
| `dd-data-architecture` | Any "Chapter C" or "Chapter E" or "Deep Dive" or "Appendix" reference | PHASE 3 — TEAM, ASSETS & DEFENSIBILITY |

---

## Validation

After making changes, verify:
1. The `slides` array has exactly 37 entries (33 core + 4 deep dives, up from 36 due to the new framework-overview slide)
2. Every `slideId` in the `props` objects is unchanged (only `title` strings and array order changed)
3. The new `framework-overview` entry exists at index 1
4. No duplicate `id` values exist in the array
5. The TypeScript compiles without errors

---

## Files to modify
- `apollo-wcg-ai-diligence.ts` — slide array reorder + title updates + new entry (Tasks 1, 2)
- The `ApolloDiligenceSlide` component file (wherever the switch/case or lookup handles `slideId` values) — executive summary content update + chapter badge updates (Tasks 3, 4)
