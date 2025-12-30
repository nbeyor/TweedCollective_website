'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { Database, Dna, Shield, TrendingUp, BarChart3, Target, Zap, Lock, AlertTriangle, Check, Cpu, Rocket, Map } from 'lucide-react'

// Define slides based on AI × Genomics × Aquaculture (Salmon) - Choices, Partners, and a Regulatory Lens
const slides: Slide[] = [
  // Slide 1: Title
  {
    id: 'title',
    title: 'Title',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          AI × Genomics × Aquaculture (Salmon)
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-3xl">
          Choices, Partners, and a Regulatory Lens
        </p>
        <p className="text-sm text-cream/50">
          Date: December 30, 2025
        </p>
      </div>
    ),
  },

  // Slide 2: Executive Summary
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 02</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Executive Summary</h2>
          <p className="text-cream/60 text-sm">December 30, 2025</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <TrendingUp className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-3">Why now</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Terrestrial ag proved the playbook (dense phenotyping + genomics + AI). Aquaculture is just beginning to unlock similar gains.</li>
              <li>• The moat is longitudinal genotype–phenotype–environment data you own—and your ability to act on it quickly across cohorts and sites.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Target className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-3">Four key questions</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• 1. AI strategy against the regulatory backdrop: where to place AI bets to maximize market upside given regional constraints.</li>
              <li>• 2. AI capability investment appetite: C1 Data Infrastructure → C2 Genomic Selection with AI Phenotyping → C3 Custom Multi-Modal ML Model (not a foundation LLM).</li>
              <li>• 3. Trait prioritization: rank by business value, data readiness, and AI fit.</li>
              <li>• 4. Partners: short, high-impact list that preserves IP and speed.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 3: AI Strategy vs. Regulatory Backdrop: The Two Paths
  {
    id: 'two-paths',
    title: 'AI Strategy vs. Regulatory Backdrop: The Two Paths',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 03</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">AI Strategy vs. Regulatory Backdrop: The Two Paths</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Shield className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-3">Path A — Selection-only (AI-accelerated)</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Pros: widest market access (EU-safe), brand flexibility; compounding gains each cohort.</li>
              <li>• Cons: slower genetic gain than edits.</li>
              <li>• AI role: richer phenotyping (vision/sensors), higher-accuracy genomic prediction, better selection decisions.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Dna className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-3">Path B — Selection + AI-informed gene editing (where allowed)</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Pros: faster trait deltas; strong demo value.</li>
              <li>• Cons: market-limited SKUs, labeling/segregation requirements.</li>
              <li>• AI role: in-silico target discovery/validation, &quot;edit-or-select&quot; prioritization, off-target risk modeling.</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-sage-500/10 border-l-4 border-sage-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-sage-300 mb-1">Decision</div>
          <p className="text-sm text-cream/80">Choose where each path runs (by market) and how to allocate AI effort across A vs. B while maintaining supply-chain separation for edited lines.</p>
        </div>
      </div>
    ),
  },

  // Slide 4: Global Map (Regulatory Segmentation Prompt)
  {
    id: 'global-map',
    title: 'Global Map (Regulatory Segmentation Prompt)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 04</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Global Map (Regulatory Segmentation Prompt)</h2>
        </div>

        <div className="p-6 bg-white/5 border border-cream/10 rounded-xl mt-8">
          <Map className="w-8 h-8 text-gold mb-4" />
          <h3 className="text-xl font-semibold text-cream mb-4">Use a world map with four labeled call-outs:</h3>
          <ul className="space-y-3 text-cream/80">
            <li className="border-l-2 border-gold pl-4">
              <span className="text-gold text-sm font-medium">EU:</span> Transgenic fish banned; gene-edited organisms treated as GMOs—Path A only. (<a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2018-07/cp180111en.pdf?utm_source=chatgpt.com" className="underline hover:text-gold" target="_blank" rel="noopener noreferrer">Curia</a>)
            </li>
            <li className="border-l-2 border-gold pl-4">
              <span className="text-gold text-sm font-medium">UK:</span> Precision Breeding Act in force; plants moving ahead now, animals pending secondary rules—Path A primary; B potential later. (<a href="https://www.ft.com/content/32c085d6-0170-462d-86d6-a6a35d071ec1?utm_source=chatgpt.com" className="underline hover:text-gold" target="_blank" rel="noopener noreferrer">Financial Times</a>)
            </li>
            <li className="border-l-2 border-gold pl-4">
              <span className="text-gold text-sm font-medium">US:</span> GE salmon allowed with bioengineered labeling and strict containment—Path A + B (segregated). (<a href="https://www.fda.gov/animal-veterinary/aquadvantage-salmon/aquadvantage-salmon-fact-sheet?utm_source=chatgpt.com" className="underline hover:text-gold" target="_blank" rel="noopener noreferrer">U.S. Food and Drug Administration</a>)
            </li>
            <li className="border-l-2 border-gold pl-4">
              <span className="text-gold text-sm font-medium">Japan (exemplar):</span> CRISPR red sea bream &amp; tiger puffer cleared for sale—Path A + B. (<a href="https://www.asahi.com/ajw/articles/14445610?utm_source=chatgpt.com" className="underline hover:text-gold" target="_blank" rel="noopener noreferrer">Asahi Shimbun</a>)
            </li>
          </ul>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-taupe-500/10 border-l-4 border-taupe-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-taupe-300 mb-1">Footer</div>
          <p className="text-sm text-cream/80">Based on current rules. Regulations and available AI/phenotype data will evolve; revisit segmentation periodically.</p>
        </div>
      </div>
    ),
  },

  // Slide 5: Risk Posture & How It Evolves (Scenarios)
  {
    id: 'risk-scenarios',
    title: 'Risk Posture & How It Evolves (Scenarios)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 05</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Risk Posture &amp; How It Evolves (Scenarios)</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Lock className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">R1: &quot;EU-first moat&quot; scenario (2026–2030)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reg: EU stays restrictive on edited animals.</li>
              <li>• AI/Data: Non-invasive phenotyping (lice/gill/biomass/feeding) and enviromics improve quickly; selection-only ROI rises.</li>
              <li>• Implication: Double-down on Path A globally; keep in-silico edit work warm for selective markets.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Check className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">R2: &quot;Selective openings&quot; scenario (UK/US/Japan 2026–2028)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reg: UK finalizes animal rules; US/Japan remain permissive with labeling and segregation.</li>
              <li>• AI/Data: Larger labeled datasets improve target ranking and predicted editing benefit.</li>
              <li>• Implication: Maintain Path A; pilot small edited SKUs only in permissive markets with tight chain-of-custody.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">R3: &quot;Backlash or delay&quot; scenario (any region, any year)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reg: Heightened scrutiny slows edited-animal approvals; labeling becomes stricter.</li>
              <li>• AI/Data: Still compounds selection accuracy and operations (feeding/lice timing).</li>
              <li>• Implication: Keep edited lines siloed; lean harder into AI-accelerated selection to protect market access.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Zap className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">R4: &quot;Tech step-change&quot; scenario (2027+)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reg: No major change.</li>
              <li>• AI/Data: Autonomy + multimodal models yield materially better g-FCR and lice outcomes, making Path A even more attractive on EBITDA.</li>
              <li>• Implication: Path A remains the default profit engine; edits remain optional, market-specific accelerants.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 6: Investment Appetite in AI Capabilities (C1 → C2 → C3)
  {
    id: 'investment-appetite',
    title: 'Investment Appetite in AI Capabilities (C1 → C2 → C3)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 06</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Investment Appetite in AI Capabilities (C1 → C2 → C3)</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Database className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C1 — Data Infrastructure (must-have; enables everything else)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Make the lake AI-ready: stable IDs, time-aligned events, partner-grade APIs, private-cloud training zone, gap-fill phenotypes (e.g., lice-laser time series; pen-level g-FCR proxy).</li>
              <li>• Output: a governed, queryable data product partners and models can actually use.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <BarChart3 className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C2 — Genomic Selection with AI Phenotyping (buy &amp; deploy)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Generate scalable labels at vaccination/handling (robustness/gill, sex/maturation) plus continuous lice/biomass/feeding.</li>
              <li>• Build a custom selection index (growth, g-FCR proxy, lice, robustness); benchmark classical genomic prediction vs. ML on your population.</li>
              <li>• Output: selection decisions improve this season; ops wins (feeding, treatment timing).</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Cpu className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C3 — Custom Multi-Modal ML Model (the differentiator; not an LLM)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Train on your genotypes + AI phenotypes + environment; serve Select-Now scores and Edit-or-Select prioritization by market; expose APIs.</li>
              <li>• Output: a compounding model moat tied to your data and processes.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 7: Technical Considerations (mirrors Slide 6 layout)
  {
    id: 'technical-considerations',
    title: 'Technical Considerations (mirrors Slide 6 layout)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 07</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Technical Considerations (mirrors Slide 6 layout)</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Database className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C1 — Data Infrastructure</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reality: most lakes aren&apos;t modeled for joins/time windows; ontologies (feed/transfers/treatments) are inconsistent; partner APIs are thin.</li>
              <li>• Work: entity resolution; event schemas; RBAC APIs; CDC pipelines; compute lice time-series from laser logs; derive and validate g-FCR proxies.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <BarChart3 className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C2 — Genomic Selection with AI Phenotyping</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reality: hands-on data science, not push-button; requires experimental design, clean join keys, environment covariates, and bioeconomic framing.</li>
              <li>• Work: label QA; genotyping strategy (LD→HD where needed); benchmark classical genomic prediction vs. ML; governance for index updates.</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Cpu className="w-10 h-10 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">C3 — Custom Multi-Modal ML Model</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Reality: not a foundation LLM. Focused model; synthetic data may be needed to cover gaps; secure deployment; IP over features and weights.</li>
              <li>• Work: feature engineering across time-series CV + genotype + env; uncertainty estimates; model serving/MLOps; monitoring &amp; drift controls.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 8: Trait Prioritization (Forced Rank—table)
  {
    id: 'trait-prioritization',
    title: 'Trait Prioritization (Forced Rank—table)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 08</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Trait Prioritization (Forced Rank—table)</h2>
        </div>

        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-sage">
                <th className="text-left p-3 text-cream font-semibold">Trait</th>
                <th className="text-left p-3 text-cream font-semibold">Business value</th>
                <th className="text-left p-3 text-cream font-semibold">Why enabled here</th>
                <th className="text-left p-3 text-cream font-semibold">Why AI is suited</th>
              </tr>
            </thead>
            <tbody className="text-cream/80">
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Feed Conversion Ratio (g-FCR proxy)</td>
                <td className="p-3">Largest COGS lever → biggest long-run EBITDA; <strong>global (EU-safe)</strong></td>
                <td className="p-3">You already collect longitudinal ops data; robust proxies are feasible now; compounds every cohort</td>
                <td className="p-3">CV biomass + sensor fusion + time-series ML for feeding decisions; strongest case for a proprietary model moat</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Sea-lice resistance / burden</td>
                <td className="p-3">High pain/cost; strong demo; treatment reductions</td>
                <td className="p-3">Existing lice imaging/laser provides rich labeled data</td>
                <td className="p-3">Vision models for counts/severity; ML/genomics to lift resistance predictions; optional edit exploration in permissive markets</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Gill health &amp; robustness</td>
                <td className="p-3">Reduces mortality/handling losses; additive to the above</td>
                <td className="p-3">Existing datasets likely support progress; near-term value &lt; FCR/lice</td>
                <td className="p-3">Behavioural CV and event-linked models; welfare scoring feeding the selection index</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },

  // Slide 9: Other Traits (Why Not Now)
  {
    id: 'other-traits',
    title: 'Other Traits (Why Not Now)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 09</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Other Traits (Why Not Now)</h2>
        </div>

        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-sage">
                <th className="text-left p-3 text-cream font-semibold">Trait</th>
                <th className="text-left p-3 text-cream font-semibold">Status / reason to defer</th>
              </tr>
            </thead>
            <tbody className="text-cream/80">
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Growth rate</td>
                <td className="p-3">Partly addressed historically; lower incremental EBITDA vs. FCR; reassess if models surface outsized signal</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Fillet yield / quality</td>
                <td className="p-3">Valuable but slower feedback and harder to measure consistently at scale; add after C2 phenotypes stabilize</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Disease-specific resistances (e.g., CMS)</td>
                <td className="p-3">Important but may need wet-lab validation/regulatory gating; keep in <strong>in-silico</strong> queue</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Sterility / escapes</td>
                <td className="p-3">Strong ESG angle; better aligned to edit track and regulatory timing; scope under C3 academic guidance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },

  // Slide 10: Partners & Why (short list)
  {
    id: 'partners',
    title: 'Partners & Why (short list)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 10</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Partners &amp; Why (short list)</h2>
        </div>

        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-purple-400">
                <th className="text-left p-3 text-cream font-semibold">Capability</th>
                <th className="text-left p-3 text-cream font-semibold">Partner</th>
                <th className="text-left p-3 text-cream font-semibold">Why them</th>
                <th className="text-left p-3 text-cream font-semibold">Where they plug in</th>
              </tr>
            </thead>
            <tbody className="text-cream/80">
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">C2</td>
                <td className="p-3 font-medium text-purple-300">Aquaticode (SORTpro)</td>
                <td className="p-3">Production-scale AI phenotyping at vaccination/handling; standardized robustness/gill/sex/maturation labels</td>
                <td className="p-3">Generate scalable phenotypes to feed selection and operations</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">C3</td>
                <td className="p-3 font-medium text-purple-300">SINTEF Digital/Ocean</td>
                <td className="p-3">Tech-native builder for production ML in aquaculture (vision, sensor fusion, behaviour/feeding control); secure deployment</td>
                <td className="p-3">Build and operate the multi-modal model; APIs; reliability targets</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">C3 Academic</td>
                <td className="p-3 font-medium text-purple-300">Nofima <em>(existing relationship to deepen)</em></td>
                <td className="p-3">Scandinavian authority in salmon genetics and lice/gill biology; regulatory-aware; strong in <strong>in-silico</strong> CRISPR target triage</td>
                <td className="p-3">Trait biology guidance; market-specific edit-or-select priorities</td>
              </tr>
              <tr className="border-b border-cream/10">
                <td className="p-3 font-medium text-cream">Option</td>
                <td className="p-3 font-medium text-purple-300">IMR (if sterility/escapes prioritized)</td>
                <td className="p-3">Deep sterility/escapes expertise and field context</td>
                <td className="p-3">Advisory and study design for sterility strategy</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-taupe-500/10 border-l-4 border-taupe-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-taupe-300 mb-1">Note</div>
          <p className="text-sm text-cream/80">Verify existing discussions; surprising there is no formal arrangement with Aquaticode. There is a clear opportunity to expand the Nofima collaboration. SINTEF can work alongside Nofima to accelerate model delivery.</p>
        </div>
      </div>
    ),
  },

  // Slide 11: Recent Announcements & Signals (with citations)
  {
    id: 'recent-announcements',
    title: 'Recent Announcements & Signals (with citations)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 11</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Recent Announcements &amp; Signals (with citations)</h2>
        </div>

        <div className="p-6 bg-white/5 border border-cream/10 rounded-xl mt-8">
          <ul className="space-y-3 text-cream/80">
            <li className="border-l-2 border-sage pl-4">
              • Aquaticode signs agreements to sort &gt;60M fish with Australis &amp; AquaChile (June 2025). (<a href="https://www.fishfarmingexpert.com/ai-powered-sorting-aquachile-aquaticode/aquaticodes-ai-driven-system-will-sort-over-60-million-fish-in-chile-deal/1949293?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">Fish Farming Expert</a>)
            </li>
            <li className="border-l-2 border-sage pl-4">
              • Tidal (spinout from Alphabet&apos;s X) launches as independent company; &gt;250 pens globally; expands in Chile (2024–2025). (<a href="https://www.aquafeed.co.uk/tidal-launches-from-alphabets-moonshot-factory/?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">AquaFeed</a>)
            </li>
            <li className="border-l-2 border-sage pl-4">
              • Tidal forms alliance with Maqsur to scale in Chile (June 2025). (<a href="https://www.aquafeed.co.uk/tidal-and-maqsur-companies-form-alliance-to-scale-operations-in-chile/?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">AquaFeed</a>)
            </li>
            <li className="border-l-2 border-sage pl-4">
              • Japan commercializes CRISPR-edited red sea bream (2021); tiger puffer follows (2021–2022). (<a href="https://www.asahi.com/ajw/articles/14445610?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">Asahi Shimbun</a>)
            </li>
            <li className="border-l-2 border-sage pl-4">
              • EU: CJEU confirms gene-edited organisms regulated as GMOs (2018). (<a href="https://curia.europa.eu/jcms/upload/docs/application/pdf/2018-07/cp180111en.pdf?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">Curia</a>)
            </li>
            <li className="border-l-2 border-sage pl-4">
              • US: FDA/USDA require &quot;bioengineered&quot; disclosure; land-based containment for GE salmon. (<a href="https://www.fda.gov/animal-veterinary/aquadvantage-salmon/aquadvantage-salmon-fact-sheet?utm_source=chatgpt.com" className="underline hover:text-sage-300" target="_blank" rel="noopener noreferrer">U.S. Food and Drug Administration</a>)
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  // Slide 12: Overall Recommendations (ties back to Slide 2's questions)
  {
    id: 'recommendations',
    title: 'Overall Recommendations (ties back to Slide 2\'s questions)',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 12</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Overall Recommendations (ties back to Slide 2&apos;s questions)</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Shield className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">Q1 (AI vs. regulatory backdrop):</h3>
            <p className="text-sm text-cream/70">• Default to selection-only, AI-accelerated as the global path; run a contained, market-segmented edit exploration in permissive geographies with segregated supply/labeling.</p>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Database className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">Q2 (AI capability investment appetite):</h3>
            <p className="text-sm text-cream/70">• Fund C1 + C2 now (AI-ready data product; Aquaticode + Xelect; custom index; classical vs. ML benchmark). Scope C3 with SINTEF + Nofima/IMR for model design and in-silico CRISPR triage.</p>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Target className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">Q3 (Traits):</h3>
            <p className="text-sm text-cream/70">• Long-run anchor = FCR (global moat via selection-first); near-term demo/value = sea-lice (leverage existing imaging/laser data); gill/robustness as additive.</p>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Rocket className="w-8 h-8 text-sage-300 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-2">Q4 (Partners):</h3>
            <p className="text-sm text-cream/70">• Validate current conversations; onboard C2 first, begin C3 scoping in parallel. IP rule: your data ⇒ your weights; vendors keep device/code; partner APIs from day one.</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function SalmonAIGenomicsPage() {
  return (
    <DocumentAccessWrapper documentId="salmon-ai-genomics">
      <PresentationLayout
        title="AI × Genomics × Aquaculture (Salmon)"
        subtitle="Choices, Partners, and a Regulatory Lens"
        slides={slides}
      />
    </DocumentAccessWrapper>
  )
}
