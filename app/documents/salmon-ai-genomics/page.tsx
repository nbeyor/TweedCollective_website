'use client'

import React from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { Database, Dna, Brain, TrendingUp, BarChart3, Shield, Heart, Zap, Target, Info, Check, Rocket } from 'lucide-react'

// Define slides based on AI × Genomics × Aquaculture Partner Roadmap
const slides: Slide[] = [
  // Slide 1: Title
  {
    id: 'title',
    title: 'Title',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cream/20 bg-cream/5 mb-6">
          <span className="text-xs uppercase tracking-wider text-cream/60">Partner Roadmap</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          AI × Genomics × Aquaculture
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-3xl">
          Partner Roadmap for Salmon Genetic Improvement
        </p>

        <div className="w-full max-w-4xl p-6 rounded-xl border-l-4 border-green-500 bg-green-500/10 text-left">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-2">Tagline</div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Transforming a 2.5-Generation Dataset into Competitive Advantage
          </p>
        </div>
      </div>
    ),
  },

  // Slide 2: The Opportunity
  {
    id: 'opportunity',
    title: 'The Opportunity',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 02</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">The Opportunity</h2>
          <p className="text-cream/60 text-sm">Transform raw breeding data into predictive, proprietary competitive advantage</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-xl border-2 border-neutral-300 bg-neutral-50">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">The Asset</h3>
            <ul className="space-y-2 text-neutral-700">
              <li>• 2.5-generation genomic and phenotypic dataset</li>
              <li>• Longitudinal breeding records across multiple traits</li>
              <li>• Operational data: feed, treatments, lice counts, mortality</li>
              <li>• Your most valuable unrefined asset</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border-2 border-green-300 bg-green-50">
            <h3 className="text-xl font-semibold text-green-900 mb-4">The Unlock</h3>
            <ul className="space-y-2 text-green-700">
              <li>• AI transforms raw data into predictive, proprietary IP</li>
              <li>• Genomic selection delivers 10-25% improvement over pedigree methods</li>
              <li>• Custom models create capabilities competitors cannot replicate</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 3: Three Platform Archetypes
  {
    id: 'archetypes',
    title: 'Three Platform Archetypes',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 03</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Three Platform Archetypes</h2>
          <p className="text-cream/60 text-sm">Progressive capabilities that build upon each other</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Database className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-2">Archetype 1: Data Foundation</h3>
            <p className="text-sm text-cream/60 mb-2">Data ingestion, cleaning, harmonization</p>
            <p className="text-sm text-green-300">Prerequisite for all AI</p>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Dna className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-2">Archetype 2: Purpose-Built GS</h3>
            <p className="text-sm text-cream/60 mb-2">Standard genomic selection (GBLUP)</p>
            <p className="text-sm text-green-300">10-25% immediate accuracy gain</p>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Brain className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-semibold text-cream mb-2">Archetype 3: Custom AI Models</h3>
            <p className="text-sm text-cream/60 mb-2">Novel discovery, trait imputation</p>
            <p className="text-sm text-green-300">Competitive moat—proprietary IP</p>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Strategy</div>
          <p className="text-sm text-cream/80">Buy Archetype 2 for efficiency → Build Archetype 3 for advantage</p>
        </div>
      </div>
    ),
  },

  // Slide 4: The Staged Roadmap
  {
    id: 'roadmap',
    title: 'The Staged Roadmap',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 04</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">The Staged Roadmap</h2>
          <p className="text-cream/60 text-sm">Three overlapping phases building toward production AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Database className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">A1: AI-Ready Data</h3>
            <p className="text-sm text-cream/50 mb-3">0-6 months</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Clean IDs, standardized ontologies</li>
              <li>• API front-door for partners</li>
              <li>• Backfill phenotypes from existing logs</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">A2: Scalable Phenotypes</h3>
            <p className="text-sm text-cream/50 mb-3">3-12 months</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• High-throughput AI phenotyping</li>
              <li>• Index v1: growth, g-FCR, lice, robustness</li>
              <li>• GBLUP vs ML validation</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Brain className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">A3: Multi-Modal Model</h3>
            <p className="text-sm text-cream/50 mb-3">6-24 months</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Production-grade model integrating all data streams</li>
              <li>• Edit-or-Select dashboard by region</li>
              <li>• Regulatory pathway preparation</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },

  // Slide 5: High-Value AI Use Cases
  {
    id: 'use-cases',
    title: 'High-Value AI Use Cases',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 05</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Creating Proprietary Phenotypes</h2>
          <p className="text-cream/60 text-sm">AI enables breeding for traits that were previously unmeasurable</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">AI-Imputed FCR (g-FCR)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Problem: Can't measure individual FCR in net-pens</li>
              <li>• Solution: AI imputes individual scores from family/genomic data</li>
              <li>• Impact: Only operator breeding for feed efficiency</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Shield className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Sea Lice Resistance</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Problem: Costs industry $1B+ annually</li>
              <li>• Solution: AI-enhanced GWAS identifies resistance gene networks</li>
              <li>• Impact: Accelerated selection for resistant broodstock</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Heart className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Robustness & Gill Health</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Problem: Difficult to quantify at scale</li>
              <li>• Solution: AI image analysis → genomic linkage</li>
              <li>• Impact: New GEBVs for previously unmeasurable traits</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Competitive Moat</div>
          <p className="text-sm text-cream/80">These proprietary phenotypes cannot be replicated without equivalent longitudinal data</p>
        </div>
      </div>
    ),
  },

  // Slide 6: Recommended Partner Ecosystem
  {
    id: 'partners',
    title: 'Recommended Partner Ecosystem',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 06</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Recommended Partner Ecosystem</h2>
          <p className="text-cream/60 text-sm">Four specialized partners to execute the staged roadmap</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Zap className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">Aquaticode</h3>
            <p className="text-sm text-cream/50 mb-3">A2 Phenotyping</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• SORTpro: 10,000 fish/hour at >97% accuracy</li>
              <li>• 60M+ fish sorted with major producers</li>
              <li>• Grieg Seafood adoption Nov 2025</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Dna className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">Xelect / Genus</h3>
            <p className="text-sm text-cream/50 mb-3">A2 Genomics</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Aquaculture-native GS at scale</li>
              <li>• Optimate software for complex breeding</li>
              <li>• Population-specific index design with IP protection</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Brain className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">SINTEF Digital</h3>
            <p className="text-sm text-cream/50 mb-3">A3 Model Builder</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Hybrid AI expertise (domain + ML)</li>
              <li>• Production deployment capability</li>
              <li>• Full-scale ACE research facility</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Target className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-1">Nofima</h3>
            <p className="text-sm text-cream/50 mb-3">A3 Scientific Advisory</p>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>• Leading salmon genetics research</li>
              <li>• CMSEdit, CrispResist projects</li>
              <li>• Regulatory navigation expertise</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Central Asset</div>
          <p className="text-sm text-cream/80">Your 2.5-generation dataset is the foundation—partners provide specialized capabilities</p>
        </div>
      </div>
    ),
  },

  // Slide 7: Regulatory Landscape
  {
    id: 'regulatory',
    title: 'Regulatory Landscape',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 07</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Regulatory Landscape</h2>
          <p className="text-cream/60 text-sm">Global regulatory environment for gene editing in aquaculture</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Target className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Regional Status</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• EU: Restrictive — GMO regulations apply to all gene editing</li>
              <li>• UK, Norway: Evolving — Precision breeding pathways emerging</li>
              <li>• US, Canada, Japan, Argentina: Permissive — Case-by-case or not regulated as GMO</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Info className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Recent Updates</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• UK: Precision Breeding Regulations in force (Nov 2025)</li>
              <li>• UK: Plants operational; animals pending</li>
              <li>• UK: First gene-edited foods expected late 2026</li>
              <li>• Norway: 7-4 committee recommendation favorable</li>
              <li>• Norway: Industry awaiting legislative action</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Strategic Flexibility</div>
          <p className="text-sm text-cream/80">AI enables parallel breeding programs—selection-only for restrictive markets, selection + editing for permissive markets</p>
        </div>
      </div>
    ),
  },

  // Slide 8: Recent Market Developments
  {
    id: 'developments',
    title: 'Recent Market Developments',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 08</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Recent Market Developments</h2>
          <p className="text-cream/60 text-sm">Last 60 Days</p>
        </div>

        <div className="p-6 bg-white/5 border border-cream/10 rounded-xl mt-8">
          <Rocket className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-cream mb-4">Industry Momentum</h3>
          <ul className="space-y-3 text-cream/80">
            <li className="border-l-2 border-green-500 pl-4">
              <span className="text-green-300 text-sm">Aug 2025:</span> Tidal (Google X) launches autonomous AI lice control at AquaNor 2025
            </li>
            <li className="border-l-2 border-green-500 pl-4">
              <span className="text-green-300 text-sm">Nov 2025:</span> Grieg Seafood adopts Aquaticode—first vaccination line integration
            </li>
            <li className="border-l-2 border-green-500 pl-4">
              <span className="text-green-300 text-sm">Apr 2025:</span> ISAV resistance breakthrough via triple gene CRISPR knockout
            </li>
            <li className="border-l-2 border-green-500 pl-4">
              <span className="text-green-300 text-sm">Nov 2025:</span> UK Precision Breeding Regulations enter force
            </li>
            <li className="border-l-2 border-green-500 pl-4">
              <span className="text-green-300 text-sm">Apr 2025:</span> SINTEF releases SOLAQUA dataset for aquaculture AI research
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  // Slide 9: Success Metrics
  {
    id: 'metrics',
    title: 'Success Metrics',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 09</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Investment & Success Metrics</h2>
          <p className="text-cream/60 text-sm">Clear milestones for each phase</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Check className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Phase 1 (A1 Complete)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>✓ Queryable trait time series operational</li>
              <li>✓ Reliable pen-level g-FCR proxy validated</li>
              <li>✓ 2-3 partner APIs integrated</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Check className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Phase 2 (A2 Complete)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>✓ Selection decisions incorporate AI-derived traits</li>
              <li>✓ 15-20% GEBV accuracy improvement on lice/robustness</li>
              <li>✓ Visible feed efficiency improvements</li>
            </ul>
          </div>

          <div className="p-6 bg-white/5 border border-cream/10 rounded-xl">
            <Check className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-cream mb-3">Phase 3 (A3 Complete)</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              <li>✓ Model v1 serving "Select-Now" predictions</li>
              <li>✓ Edit-or-Select dashboard by trait/region</li>
              <li>✓ Regulatory playbooks for EU vs permissive markets</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-4xl p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500 mt-6">
          <div className="text-xs uppercase tracking-wider text-green-300 mb-1">Key Talent Investment</div>
          <p className="text-sm text-cream/80">2-3 computational biologists to own proprietary models and manage partner ecosystem</p>
        </div>
      </div>
    ),
  },

  // Slide 10: Summary & Next Steps
  {
    id: 'summary',
    title: 'Summary & Next Steps',
    content: (
      <div className="space-y-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-cream/40 mb-2">Slide 10</div>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-cream mb-2">Summary & Next Steps</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-xl border-2 border-green-300 bg-green-50">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Key Takeaways</h3>
            <ul className="space-y-2 text-green-700">
              <li>• <strong>The Asset:</strong> Your 2.5-generation dataset is a formidable competitive moat—AI is the only tool to unlock its full value</li>
              <li>• <strong>The Strategy:</strong> Buy Archetype 2 for immediate gains; Build Archetype 3 for defensible advantage</li>
              <li>• <strong>The Opportunity:</strong> AI-managed parallel breeding programs enable serving global markets from single broodstock</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border-2 border-neutral-300 bg-neutral-50">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Next Steps</h3>
            <ul className="space-y-2 text-neutral-700">
              <li>☐ Initiate A1 data architecture workstream</li>
              <li>☐ Engage Aquaticode for pilot phenotyping assessment</li>
              <li>☐ Open discussions with Xelect on index design</li>
              <li>☐ Schedule SINTEF/Nofima advisory scoping</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
]

export default function SalmonAIGenomicsPage() {
  return (
    <DocumentAccessWrapper documentId="salmon-ai-genomics">
      <PresentationLayout slides={slides} />
    </DocumentAccessWrapper>
  )
}
