# ECS SDLC Dashboard — Analytics Reference & Insights

This document describes each analytic in the ECS SDLC Copilot Dashboard, including its purpose, underlying computation logic, and key insights from the current data (as of March 18, 2026).

---

## Three-Phase Model (Core Framework)

All analytics are organized around a three-phase timeline:

- **Phase 1 — Pre-AI Baseline** (before Oct 1, 2025): No AI tools in use. Serves as the control period for before/after comparisons. 240 tickets across 19 authors over 14 weeks.
- **Phase 2 — Transition** (Oct 1, 2025 – Feb 6, 2026): AI rollout with uneven 26–74% weekly adoption. Shown on charts but excluded from KPI comparisons.
- **Phase 3 — Mature Adoption** (Feb 7, 2026+): 80%+ weekly Copilot adoption. Compared against the pre-AI baseline. 182 tickets across 21 authors over 7 high-confidence weeks.

---

## KPI Cards (Summary Metrics)

### Team Productivity (vs pre-AI)

- **Purpose:** Measure whether AI adoption has improved team throughput, normalized for team size and work time.
- **Logic:** Mean-of-weekly productivity during the mature period compared to the same metric from the baseline period. Weekly productivity = `tickets_completed / (unique_authors_that_week × 5 workdays)`. Only "confident" weeks (≥5 tickets) contribute to the mean. The KPI shows the percentage delta: `((mature_productivity − baseline_productivity) / baseline_productivity) × 100`.
- **Current reading:** 0.452 tickets/FTE-day vs 0.389 baseline → **+16.1%** improvement.

### QA Churn (vs pre-AI)

- **Purpose:** Track whether AI-assisted code requires more or less QA rework compared to the pre-AI baseline.
- **Logic:** `tickets_with_qa_churn_lines > 0 / total_tickets`, computed as an overall rate across the entire period (not mean-of-weekly). The delta is `((mature_qa_churn − baseline_qa_churn) / baseline_qa_churn) × 100`. A negative delta indicates quality improvement. Color-coded amber if churn is worse than baseline.
- **Current reading:** 23.1% vs 24.2% baseline → **-4.5%** (slight improvement; quality has held steady).

### Total Output (mature period)

- **Purpose:** Provide raw volume context — how many tickets were completed, by how many developers, over how many high-confidence weeks.
- **Logic:** Simple aggregate count of tickets where `pr_end_date >= mature_start`. No normalization or formula applied.
- **Current reading:** 182 tickets, 21 developers, 7 high-confidence weeks.

### Copilot Adoption (current)

- **Purpose:** Show the current week's Copilot penetration within the team.
- **Logic:** `weekly_active_copilot_users / total_users_with_copilot_access × 100` for the most recent week in GitHub Copilot telemetry. The delta line shows the monthly adoption trend (first month unique users → last month unique users).
- **Current reading:** 61.5% (current partial week); recent full weeks consistently 81–92%. Trend: 10 → 25 monthly users.

### Weekly Active Users

- **Purpose:** Show the headcount of developers actively using Copilot in the most recent week, broken down by usage intensity.
- **Logic:** Count of distinct `github_user_id` values in Copilot telemetry for the most recent Saturday-ending week. User tiers are computed on cumulative lifetime days: Heavy = 30+ active days, Medium = 10–29 days, Light = <10 days.
- **Current reading:** 16 active (partial week; recent full weeks: 20–24). Tiers: 19 heavy / 4 medium / 3 light. Average 13 daily active users.

### Copilot Acceptance Rate

- **Purpose:** Measure how useful developers find AI suggestions — what proportion they actually keep.
- **Logic:** `code_acceptance_activity_count / code_generation_activity_count × 100` for the most recent week. Context shows the total suggestion volume.
- **Current reading:** Acceptance rates have ranged from ~22% to ~37% week-over-week, with recent weeks around 22–31%.

### Copilot Impact on Productivity

- **Purpose:** Directly compare productivity between tickets where the author was actively using Copilot vs tickets where they were not.
- **Logic:** A ticket is classified as "Copilot-assisted" if its PR author (`author_uuid`) appears in Copilot telemetry during the same Saturday-ending week as the PR completion date. Productivity is computed per group: `tickets / (unique_authors × distinct_weeks × 5)`. The KPI shows the percentage lift: `((assisted_prod − non_assisted_prod) / non_assisted_prod) × 100`.
- **Current reading:** -14.4% (assisted: 0.380, non-assisted: 0.444). See caveats in the Insights section below.

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

---

## Data Insights (as of March 18, 2026)

### Headline: Productivity is up +16.1% with quality holding steady

The team is producing 0.452 tickets/FTE-day in the mature adoption period vs 0.389 during the pre-AI baseline — a **16.1% improvement**. QA churn has edged down slightly from 24.2% to 23.1% (-4.5%), meaning the productivity gain has not come at the expense of code quality.

### The Feb 21 week is an outlier pulling the average down

The week ending Feb 21 stands out as the weakest week of the mature period: productivity dropped to 0.329 tickets/FTE-day (vs the mature average of 0.452) and QA churn spiked to 39.3% (vs the mature average of 23.1%). This was the single worst quality week in the mature period — 11 of 28 tickets required QA rework. That week also had the highest author count (17), suggesting the team was spread thin across more tickets simultaneously. Excluding this single week, the mature productivity average would be notably higher than the reported +16.1%.

### The most recent weeks show an acceleration, not a plateau

The two most recent full weeks are the highest-volume weeks in the entire 9-month dataset:
- **Week of Mar 7:** 38 tickets, 0.633 tickets/FTE-day (the single highest productivity week recorded), QA churn just 10.5%
- **Week of Mar 14:** 47 tickets (the single highest ticket count recorded), 0.588 tickets/FTE-day, QA churn 25.5%

For context, baseline weeks averaged ~19 tickets per week and peaked at 29. The team is currently producing nearly 2x the volume of baseline with better per-capita productivity. The rolling velocity trend confirms this acceleration.

### Copilot adoption grew from 27% to 92% in 5 months

Copilot adoption climbed steadily from 26.9% (week of Oct 11, 2025) to a peak of 92.3% (week of Mar 7, 2026). Of 26 developers with Copilot access, 19 (73%) are classified as "heavy" users (30+ active days). Weekly code generation volume grew from ~500 suggestions/week in early October to 3,000–4,000/week by February–March, roughly a 7x increase. The monthly user trend went from 10 to 25 unique monthly users.

### Quality has held steady — not degraded — despite faster output

The overall QA churn rate improved slightly from 24.2% (baseline) to 23.1% (mature), a -4.5% reduction. This is significant because the team is completing 16% more work per person per day — faster output with equal-or-better quality is a net positive. The Feb 21 spike (39.3%) is the only week where churn meaningfully exceeded the baseline average, and it appears to be an isolated event: the weeks immediately before and after it returned to 15.6% and 17.9%.

### The assisted vs non-assisted comparison is counterintuitive but explainable

The Copilot-assisted vs non-assisted comparison shows a -14.4% productivity "lift" (assisted: 0.380, non-assisted: 0.444) and +23.3% worse QA churn for assisted tickets. However, this comparison has significant methodological caveats:

- **Tiny control group:** Only 26 of 182 mature-period tickets (14%) are non-assisted, making the non-assisted group statistically fragile. A single week can swing the numbers dramatically — for example, the week of Feb 28 had 8 non-assisted tickets at 0.800 productivity, nearly double the assisted rate, which heavily skews the aggregate.
- **Selection bias:** With 86% of tickets being Copilot-assisted, the non-assisted group likely represents a non-random subset — possibly simpler tickets, tickets from developers who didn't happen to use Copilot that particular week, or tickets completed by a small number of prolific non-users.
- **The team-wide before/after comparison is more reliable:** Because 96% of the team has Copilot access, there is no true control group. The pre-AI baseline comparison (which shows +16.1% productivity, -4.5% QA churn) is methodologically stronger because it compares the same team against itself before any AI tools existed.

### The biggest productivity gains are on large, complex tickets

The size × complexity heatmap reveals where AI is helping most:

| Bucket | Productivity Change | QA Churn Change | Post/Baseline Tickets |
|--------|--------------------|-----------------|-----------------------|
| Small (0–300 lines) / Simple (1–10 files) | +15.9% | -32.5% (improved) | 114 / 178 |
| Small (0–300 lines) / Complex (11+ files) | +15.2% | +57.1% (worse) | 7 / 11 |
| Large (301+ lines) / Simple (1–10 files) | -19.6% | +125% (worse) | 4 / 9 |
| Large (301+ lines) / Complex (11+ files) | **+145.6%** | -3.3% (flat) | 57 / 42 |

Key observations:
- **Large/complex tickets** (301+ lines, 11+ files) show a massive +145.6% productivity improvement with quality holding flat. This is the bucket where AI coding assistants would theoretically help most — scaffolding boilerplate, navigating large file sets — and the data supports that thesis. This bucket also has strong sample sizes (57 post vs 42 baseline).
- **Small/simple tickets** — the most common category — show a solid +15.9% productivity gain with a 32.5% *improvement* in QA churn. AI is helping with routine work and quality is better.
- **The two off-diagonal cells** (small/complex and large/simple) have very low ticket counts (7 and 4 respectively) and should be interpreted with caution.

### Code generation volume has plateaued at 3,000–4,000 suggestions/week

After ramping from ~500/week in October to ~4,000/week by late January, weekly code generation volume has stabilized in the 2,400–3,900 range. This suggests the team has reached a steady-state level of AI usage rather than still experimenting. Acceptance rates have been relatively consistent at 22–31%, meaning roughly 1 in 4 suggestions is kept — a typical range for inline code completion tools.

### Summary

The data tells a clear story: the team adopted Copilot rapidly (27% → 92% in 5 months), productivity improved meaningfully (+16.1%), and code quality has held steady or slightly improved (-4.5% churn). The Feb 21 week is an outlier driven by a quality spike, not a trend. The most recent weeks (Mar 7, Mar 14) show the team hitting its highest-ever output levels. The largest productivity gains are concentrated in large/complex tickets (+146%), which is where AI assistance would be expected to provide the most leverage. The assisted vs non-assisted comparison should be treated with caution due to the tiny non-assisted sample (14% of tickets), but the team-wide before/after analysis provides a robust picture of genuine improvement.
