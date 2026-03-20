# ECS SDLC Dashboard — Analytics Reference

This document describes each analytic in the ECS SDLC Copilot Dashboard, including its purpose and underlying computation logic.

## Three-Phase Model (Core Framework)

All analytics are organized around a three-phase timeline:

- **Phase 1 — Pre-AI Baseline** (before Oct 1, 2025): No AI tools in use. Serves as the control period for before/after comparisons.
- **Phase 2 — Transition** (Oct 1, 2025 – Feb 6, 2026): AI rollout with uneven 26–74% weekly adoption. Shown on charts but excluded from KPI comparisons.
- **Phase 3 — Mature Adoption** (Feb 7, 2026+): 80%+ weekly Copilot adoption. Compared against the pre-AI baseline.

---

## KPI Cards (Summary Metrics)

### Team Productivity (vs pre-AI)

- **Purpose:** Measure whether AI adoption has improved team throughput, normalized for team size and work time.
- **Logic:** Mean-of-weekly productivity during the mature period compared to the same metric from the baseline period. Weekly productivity = `tickets_completed / (unique_authors_that_week × 5 workdays)`. Only "confident" weeks (≥5 tickets) contribute to the mean. The KPI shows the percentage delta: `((mature_productivity − baseline_productivity) / baseline_productivity) × 100`.

### QA Churn (vs pre-AI)

- **Purpose:** Track whether AI-assisted code requires more or less QA rework compared to the pre-AI baseline.
- **Logic:** `tickets_with_qa_churn_lines > 0 / total_tickets`, computed as an overall rate across the entire period (not mean-of-weekly). The delta is `((mature_qa_churn − baseline_qa_churn) / baseline_qa_churn) × 100`. A negative delta indicates quality improvement. Color-coded amber if churn is worse than baseline.

### Total Output (mature period)

- **Purpose:** Provide raw volume context — how many tickets were completed, by how many developers, over how many high-confidence weeks.
- **Logic:** Simple aggregate count of tickets where `pr_end_date >= mature_start`. No normalization or formula applied.

### Copilot Adoption (current)

- **Purpose:** Show the current week's Copilot penetration within the team.
- **Logic:** `weekly_active_copilot_users / total_users_with_copilot_access × 100` for the most recent week in GitHub Copilot telemetry. The delta line shows the monthly adoption trend (first month unique users → last month unique users).

### Weekly Active Users

- **Purpose:** Show the headcount of developers actively using Copilot in the most recent week, broken down by usage intensity.
- **Logic:** Count of distinct `github_user_id` values in Copilot telemetry for the most recent Saturday-ending week. User tiers are computed on cumulative lifetime days: Heavy = 30+ active days, Medium = 10–29 days, Light = <10 days.

### Copilot Acceptance Rate

- **Purpose:** Measure how useful developers find AI suggestions — what proportion they actually keep.
- **Logic:** `code_acceptance_activity_count / code_generation_activity_count × 100` for the most recent week. Context shows the total suggestion volume.

### Copilot Impact on Productivity

- **Purpose:** Directly compare productivity between tickets where the author was actively using Copilot vs tickets where they were not.
- **Logic:** A ticket is classified as "Copilot-assisted" if its PR author (`author_uuid`) appears in Copilot telemetry during the same Saturday-ending week as the PR completion date. Productivity is computed per group: `tickets / (unique_authors × distinct_weeks × 5)`. The KPI shows the percentage lift: `((assisted_prod − non_assisted_prod) / non_assisted_prod) × 100`.

---

## Time Series Charts

### Team Productivity vs Pre-AI Baseline

- **Purpose:** Visualize weekly team productivity across three phases with a Copilot adoption overlay.
- **Primary axis (left):** Tickets/FTE-day. Shows both weekly raw data points and a 4-week rolling average line. The rolling average is computed only over "confident" weeks (≥5 tickets) and requires at least 2 data points in the window to emit a value. Low-confidence weeks are shown as smaller, dimmed dots. Transition-phase dots use a diamond marker shape.
- **Secondary axis (right):** Copilot adoption percentage — the percentage of developers using Copilot that week, rendered as a filled area chart.
- **Annotations:** Horizontal dashed line at the pre-AI baseline productivity (mean-of-weekly from baseline period). Vertical dashed lines mark "AI Rollout" (Oct 1, 2025) and "80%+ Adoption" (Feb 7, 2026). The transition zone is shaded gray.

### Quality — QA Churn Rate vs Copilot Acceptance Rate

- **Purpose:** Track code quality alongside AI suggestion quality over time to see if they correlate.
- **Primary axis (left):** QA Churn Rate (%) — percentage of tickets with any QA rework lines (`qa_churn_lines > 0`). Shows weekly raw dots plus a 4-week rolling average, using the same confidence/window logic as the productivity chart. Lower churn is better.
- **Secondary axis (right):** Copilot Acceptance Rate (%) — 4-week rolling average of `code_acceptances / code_generations × 100`, aligned to the main weekly timeline by matching Saturday-ending week keys from Copilot telemetry.
- **Annotations:** Horizontal dashed line at the pre-AI baseline churn rate. Same phase boundary markers as the productivity chart.

### Cumulative Output & Velocity

- **Purpose:** Show total team throughput accumulation over time and whether the team is accelerating or decelerating.
- **Area (left axis):** Running cumulative sum of all tickets completed across the full timeline (including all phases).
- **Dashed line (right axis):** 4-week rolling velocity = average tickets/week over the rolling window, computed only over confident weeks (≥5 tickets, minimum 2 data points in window).
- **Annotations:** Same three-phase markers (AI Rollout, 80%+ Adoption, transition zone shading). Summary callout at the bottom shows total ticket count and developer headcount.

### Copilot Adoption Over Time

- **Purpose:** Show the trajectory of Copilot usage within the team over time.
- **Bars (left axis):** Weekly count of distinct active Copilot users from GitHub telemetry, bucketed into Saturday-ending weeks (same week alignment as PR data).
- **Line (right axis):** Weekly total code generation events (AI suggestion count) from Copilot telemetry.

---

## Comparison Analytics

### Copilot-Assisted vs Non-Assisted (Grouped Bar Chart)

- **Purpose:** Directly compare outcomes for tickets where the author was actively using Copilot vs tickets where they were not during the mature period.
- **Matching logic:** A ticket is "Copilot-assisted" when the PR author's `author_uuid` has any Copilot telemetry activity during the same Saturday-ending week that the PR was completed. All other mature-period tickets are "non-assisted."
- **Bars:** Side-by-side grouped bars showing Productivity (tickets/FTE-day) and QA Churn Rate for assisted vs non-assisted groups.
- **Intensity breakdown (sub-table):** Assisted tickets are further segmented by Copilot suggestion volume per ticket: Low (1–10 suggestions), Medium (11–50), High (51+). Each bucket shows ticket count and QA churn rate, enabling analysis of whether heavier AI usage correlates with different quality outcomes.

---

## Heatmaps

### Size × Complexity — Productivity vs Baseline (2×2 Grid)

- **Purpose:** Determine whether AI-driven productivity gains hold across different ticket characteristics, or are concentrated in a specific size/complexity category.
- **Dimensions:**
  - **Size:** Total lines of code across all PRs for a ticket. Buckets: `0–300` vs `301+`.
  - **Complexity:** Maximum files touched by any single PR for the ticket. Buckets: `1–10` vs `11+`.
- **Cell logic:** Each cell shows the percentage change in productivity vs baseline: `(post_productivity − baseline_productivity) / baseline_productivity × 100%`. Productivity per cell = `tickets_in_bucket / (unique_authors × distinct_weeks × 5 workdays)`, computed separately for the mature and baseline periods using full-period author and week counts (not per-cell counts).
- **Color scale:** Green shades indicate improvement (darker green = larger gain), red shades indicate regression.

### Size × Complexity — QA Churn vs Baseline (2×2 Grid)

- **Purpose:** Same dimensional breakdown but for code quality. Reveals whether AI-generated code quality varies by ticket size and complexity.
- **Cell logic:** `(post_qa_churn − baseline_qa_churn) / baseline_qa_churn × 100%`. QA churn per cell = `tickets_with_qa_churn / total_tickets_in_bucket`.
- **Color scale:** Inverted from the productivity heatmap — green means churn *decreased* (quality improved), red means churn increased (quality regressed).

---

## Key Definitions

| Term | Definition |
|------|------------|
| **Ticket** | A Jira ticket, which may have one or more associated pull requests. PRs are aggregated to the ticket level. |
| **Week ending** | Saturday-ending ISO week. PR data and Copilot telemetry share this alignment. |
| **Confident week** | A week with ≥5 total tickets. Low-confidence weeks are excluded from rolling averages. |
| **Rolling average** | 4-week sliding window over confident weeks only. Requires ≥2 data points in the window to produce a value. |
| **QA churn** | Any ticket where `qa_churn_lines > 0` across its PRs. Indicates QA rework was needed. |
| **Size bucket** | Sum of `pr_lines` across all PRs for the ticket: `0–300` or `301+`. |
| **Complexity bucket** | Maximum `pr_files` from any single PR for the ticket: `1–10` or `11+`. |
| **User tier** | Copilot usage intensity based on cumulative active days: Heavy (≥30), Medium (10–29), Light (<10). |
| **Copilot-assisted** | A ticket whose PR author had Copilot telemetry activity during the same Saturday-ending week as the PR completion. |
| **FTE-day** | One developer working one day. Productivity denominator = unique authors × 5 workdays per week. |
