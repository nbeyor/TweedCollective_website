'use client'

import React, { useState } from 'react'
import PresentationLayout, { Slide } from '@/components/presentation/PresentationLayout'
import DocumentAccessWrapper from '@/components/DocumentAccessWrapper'
import { Dna, Database, Target, Brain, Eye, TrendingUp, Users, BarChart3, Shield } from 'lucide-react'

// Define slides
const slides: Slide[] = [
  {
    id: 'title',
    title: 'Title',
    content: (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cream/20 bg-cream/5 mb-6">
          <span className="text-xs uppercase tracking-wider text-cream/60">Strategic AI Integration</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-light text-cream mb-4 leading-tight">
          Strategic AI for Salmon Genetic Improvement
        </h1>
        <p className="text-xl md:text-2xl text-cream/70 mb-8 max-w-2xl">
          Turn 2.5 generations of genomic+phenotypic data into a predictive asset; move from "records" → "moat."
        </p>
        
        {/* Key Insight Box */}
        <div className="w-full max-w-4xl p-6 rounded-xl border-l-4 border-purple-500 bg-purple-500/10 mb-8 text-left">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Why Now</div>
          <p className="text-sm text-cream/80 leading-relaxed">
            Proprietary longitudinal data becomes defensible when used to train custom models. 
            Transform historical records into competitive advantage through AI-driven genomic selection.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'core-asset',
    title: 'The Core Asset',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 02</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">The 2.5-Generation Dataset is the Moat</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          Proprietary longitudinal data becomes defensible when used to train custom models. 
          Competitors can buy software; they can't replicate models trained on <em>your</em> dataset.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Data Layers</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Genomics: SNP arrays, whole-genome sequences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Phenotype: Growth, disease resistance, feed efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Environment: Water quality, temperature, pen conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Pedigree: Family relationships, breeding history</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">AI Transformation</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Historical records → Predictive models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Data becomes proprietary IP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Competitive moat through custom training</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'three-levels',
    title: 'Three Strategic Levels',
    content: <ThreeLevelsSlide />
  },
  {
    id: 'landscape-map',
    title: 'AI Platform Landscape',
    content: <LandscapeMapSlide />
  },
  {
    id: 'archetype-1',
    title: 'Archetype 1: Data Foundation',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 05</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Data is the Prerequisite (Archetype 1)</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          Data lake + ETL + harmonization; without this, advanced modeling fails.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border-2 border-red-500/50 bg-red-500/10">
            <h3 className="text-lg font-semibold text-red-300 mb-4">❌ Before: Messy Sources</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Fragmented databases across systems</li>
              <li>• Inconsistent formats and schemas</li>
              <li>• Missing metadata and lineage</li>
              <li>• No single source of truth</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border-2 border-green-500/50 bg-green-500/10">
            <h3 className="text-lg font-semibold text-green-300 mb-4">✅ After: Single Source of Truth</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Unified data lake architecture</li>
              <li>• Standardized ETL pipelines</li>
              <li>• Complete data harmonization</li>
              <li>• Ready for advanced modeling</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'archetype-2',
    title: 'Archetype 2: Quick Wins',
    content: <BreedingAccuracySlide />
  },
  {
    id: 'archetype-3',
    title: 'Archetype 3: Custom Models',
    content: <CustomModelsSlide />
  },
  {
    id: 'sea-lice',
    title: 'Use Case: Sea Lice Resistance',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 08</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Dissect Complex Traits with AI</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          AI-driven GWAS identifies gene <em>networks</em> driving lice resistance; accelerates selection.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Dna className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-2">Immune Pathways</h3>
            <p className="text-xs text-cream/70">Innate immune response networks</p>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-2">Mucus Production</h3>
            <p className="text-xs text-cream/70">Protective barrier mechanisms</p>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-2">Skin Integrity</h3>
            <p className="text-xs text-cream/70">Structural defense systems</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Key Insight</div>
          <p className="text-sm text-cream/80">
            Traditional GWAS finds individual genes. AI identifies interacting networks, revealing polygenic 
            resistance mechanisms that accelerate breeding programs.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'gill-health',
    title: 'Use Case: Gill Health',
    content: (
      <div className="min-h-[50vh] flex flex-col justify-center">
        <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 09</div>
        <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Convert Images into a Selectable Trait</h2>
        
        <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
          CNN/computer vision scores gill health from photos/histology; link scores back to genome → new breeding value.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Computer Vision Pipeline</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Capture gill images/photos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>CNN model scores health (0-100)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Link scores to genomic data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Create new breeding value (g-Gill)</span>
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-cream mb-3">Breeding Impact</h3>
            <ul className="space-y-2 text-sm text-cream/70">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Previously unmeasurable trait</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Now selectable in breeding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">•</span>
                <span>Accelerates genetic gain</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'g-fcr',
    title: 'Proprietary g-FCR',
    content: <GFCRSlide />
  },
  {
    id: 'strategic-fork',
    title: 'The Strategic Fork',
    content: <StrategicForkSlide />
  },
  {
    id: 'pathway-1',
    title: 'Pathway 1: AI-Accelerated Breeding',
    content: <BreedingPathwaySlide />
  },
  {
    id: 'pathway-2',
    title: 'Pathway 2: AI-Informed Gene Editing',
    content: <GeneEditingSlide />
  },
  {
    id: 'regulatory',
    title: 'Regulatory Reality',
    content: <RegulatoryMapSlide />
  },
  {
    id: 'dual-track',
    title: 'Dual-Track Program',
    content: <DualTrackSlide />
  },
  {
    id: 'roadmap',
    title: 'Implementation Roadmap',
    content: <RoadmapSlide />
  },
  {
    id: 'operating-model',
    title: 'Operating Model',
    content: <OperatingModelSlide />
  },
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    content: <DashboardSlide />
  },
  {
    id: 'glossary',
    title: 'Glossary',
    content: <GlossarySlide />
  }
]

// Three Levels Slide Component
function ThreeLevelsSlide() {
  const [activeTab, setActiveTab] = useState(0)
  
  const levels = [
    {
      title: 'Now: Optimize Breeding',
      description: 'Immediate accuracy gains through genomic selection',
      actions: ['Implement GEBVs', 'Modernize breeding program', 'Baseline accuracy uplift']
    },
    {
      title: 'Next: Proprietary Phenotypes',
      description: 'Create hard-to-measure traits (g-FCR, g-Gill)',
      actions: ['Train custom models', 'Link phenotypes to genome', 'New selectable traits']
    },
    {
      title: 'Moat: Dual Regulatory Strategies',
      description: 'Run GM + non-GM lines from same broodstock',
      actions: ['AI-managed pedigrees', 'Compliance tracking', 'Market optimization']
    }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 03</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">3 Strategic Levels Enabled by AI</h2>

      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === index
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'bg-cream/5 text-cream/60 border border-cream/20 hover:bg-cream/10'
              }`}
            >
              {level.title.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-xl border border-cream/20 bg-cream/5">
          <h3 className="text-lg font-semibold text-cream mb-2">{levels[activeTab].title}</h3>
          <p className="text-cream/70 mb-4">{levels[activeTab].description}</p>
          <ul className="space-y-2">
            {levels[activeTab].actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                <span className="text-sage mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Landscape Map Slide Component
function LandscapeMapSlide() {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null)
  
  const archetypes = [
    {
      id: 1,
      name: 'Data Unification/Governance',
      description: 'Data lake + ETL + harmonization',
      what: 'Unified data platform',
      why: 'Foundation for all advanced work',
      buildVsBuy: 'Build core, partner for tools'
    },
    {
      id: 2,
      name: 'Off-the-Shelf GS Tools',
      description: 'Standard GEBVs for measurable traits',
      what: 'Genomic selection software',
      why: 'Quick wins, baseline modernization',
      buildVsBuy: 'Buy/license, customize'
    },
    {
      id: 3,
      name: 'Custom Proprietary Models',
      description: 'Models trained on your dataset',
      what: 'g-FCR, proprietary phenotypes',
      why: 'Competitive moat, defensible IP',
      buildVsBuy: 'Build internally, own IP'
    }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 04</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Three Archetypes of AI Platforms</h2>

      <div className="space-y-4">
        {archetypes.map((archetype) => (
          <div
            key={archetype.id}
            className="p-5 rounded-xl border border-cream/20 bg-cream/5 cursor-pointer hover:bg-cream/10 transition-all"
            onClick={() => setExpandedLayer(expandedLayer === archetype.id ? null : archetype.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-cream">Archetype {archetype.id}: {archetype.name}</h3>
                <p className="text-xs text-cream/60 mt-1">{archetype.description}</p>
              </div>
              <span className="text-xs text-cream/40">{expandedLayer === archetype.id ? '−' : '+'}</span>
            </div>
            {expandedLayer === archetype.id && (
              <div className="mt-4 pt-4 border-t border-cream/20 space-y-2 text-sm text-cream/70">
                <p><strong className="text-cream">What it does:</strong> {archetype.what}</p>
                <p><strong className="text-cream">Why it matters:</strong> {archetype.why}</p>
                <p><strong className="text-cream">Build vs Buy:</strong> {archetype.buildVsBuy}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Breeding Accuracy Slide Component
function BreedingAccuracySlide() {
  const [useGenomic, setUseGenomic] = useState(true)

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 06</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Off-the-Shelf GS = Immediate Uplift</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Standard GEBVs for measurable traits; near-term accuracy gains (baseline modernization).
      </p>

      <div className="mb-6">
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setUseGenomic(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !useGenomic
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'bg-cream/5 text-cream/60 border border-cream/20'
            }`}
          >
            Pedigree Selection
          </button>
          <button
            onClick={() => setUseGenomic(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              useGenomic
                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                : 'bg-cream/5 text-cream/60 border border-cream/20'
            }`}
          >
            Genomic Selection
          </button>
        </div>

        <div className="p-6 rounded-xl border border-cream/20 bg-cream/5">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-cream/60 mb-2">
              <span>Breeding Accuracy</span>
              <span>{useGenomic ? '85%' : '45%'}</span>
            </div>
            <div className="w-full h-8 bg-cream/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  useGenomic ? 'bg-green-500' : 'bg-purple-500'
                }`}
                style={{ width: useGenomic ? '85%' : '45%' }}
              />
            </div>
          </div>
          <p className="text-sm text-cream/70">
            {useGenomic 
              ? 'Genomic selection provides ~40% accuracy improvement over traditional pedigree methods.'
              : 'Traditional pedigree selection has limited accuracy due to incomplete information.'}
          </p>
        </div>
      </div>
    </div>
  )
}

// Custom Models Slide Component
function CustomModelsSlide() {
  const [position, setPosition] = useState(50)

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 07</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Custom Models Turn Data into IP</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Competitors can buy software; they can't replicate models trained on <em>your</em> dataset.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className={`p-6 rounded-xl border-2 transition-all ${
          position < 50 ? 'border-red-500/50 bg-red-500/10' : 'border-cream/20 bg-cream/5'
        }`}>
          <h3 className="text-lg font-semibold text-cream mb-4">Copyable</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>• Off-the-shelf software</li>
            <li>• Standard algorithms</li>
            <li>• Generic training data</li>
            <li>• No competitive advantage</li>
          </ul>
        </div>
        <div className={`p-6 rounded-xl border-2 transition-all ${
          position >= 50 ? 'border-green-500/50 bg-green-500/10' : 'border-cream/20 bg-cream/5'
        }`}>
          <h3 className="text-lg font-semibold text-cream mb-4">Defensible</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>• Custom models</li>
            <li>• Proprietary datasets</li>
            <li>• Unique training data</li>
            <li>• Competitive moat</li>
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-cream/20 bg-cream/5">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs text-cream/60">Copyable</span>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(parseInt(e.target.value))}
            className="flex-1 accent-sage"
          />
          <span className="text-xs text-cream/60">Defensible</span>
        </div>
        <p className="text-xs text-cream/60 text-center">
          Slide to compare: {position < 50 ? 'Standard tools' : 'Custom IP'}
        </p>
      </div>
    </div>
  )
}

// g-FCR Slide Component
function GFCRSlide() {
  const [dataVolume, setDataVolume] = useState(50)

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 10</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Proprietary Feed Efficiency Score (g-FCR)</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Impute individual feed conversion from sparse pen-level outcomes using genomic + family assignment + pen FCR; 
        becomes unique selectable trait.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="text-xs text-cream/50 mb-2">Step 1</div>
          <h3 className="text-sm font-semibold text-cream mb-2">Pen-Level FCR</h3>
          <p className="text-xs text-cream/70">Aggregate feed conversion data</p>
        </div>
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="text-xs text-cream/50 mb-2">Step 2</div>
          <h3 className="text-sm font-semibold text-cream mb-2">Model Training</h3>
          <p className="text-xs text-cream/70">AI learns individual patterns</p>
        </div>
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="text-xs text-cream/50 mb-2">Step 3</div>
          <h3 className="text-sm font-semibold text-cream mb-2">Per-Fish g-FCR</h3>
          <p className="text-xs text-cream/70">Individual selectable trait</p>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-cream/60">Data Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={dataVolume}
            onChange={(e) => setDataVolume(parseInt(e.target.value))}
            className="flex-1 accent-sage"
          />
          <span className="text-xs text-cream/60">{dataVolume}%</span>
        </div>
        <div className="text-sm text-cream/70">
          <p><strong className="text-cream">Prediction Confidence:</strong> {Math.round(60 + (dataVolume * 0.4))}%</p>
          <p className="text-xs text-cream/60 mt-2">
            More data → Higher confidence → Better breeding decisions
          </p>
        </div>
      </div>
    </div>
  )
}

// Strategic Fork Slide Component
function StrategicForkSlide() {
  const [selectedPathway, setSelectedPathway] = useState<'breed' | 'edit' | null>(null)

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 11</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">AI Reveals Targets, Then You Choose the Pathway</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Same AI insight can drive selective breeding (non-GM) or gene editing (bioengineered).
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => setSelectedPathway(selectedPathway === 'breed' ? null : 'breed')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedPathway === 'breed'
              ? 'border-green-500/50 bg-green-500/10'
              : 'border-cream/20 bg-cream/5 hover:border-green-500/30'
          }`}
        >
          <h3 className="text-xl font-semibold text-cream mb-3">Breed</h3>
          <p className="text-sm text-cream/70 mb-4">
            AI-accelerated selective breeding (non-GM)
          </p>
          {selectedPathway === 'breed' && (
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Weight beneficial variants</li>
              <li>• Stack polygenic contributions</li>
              <li>• Multiple generations</li>
              <li>• Avoids GM label</li>
            </ul>
          )}
        </button>
        <button
          onClick={() => setSelectedPathway(selectedPathway === 'edit' ? null : 'edit')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedPathway === 'edit'
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-cream/20 bg-cream/5 hover:border-purple-500/30'
          }`}
        >
          <h3 className="text-xl font-semibold text-cream mb-3">Edit</h3>
          <p className="text-sm text-cream/70 mb-4">
            AI-informed gene editing (bioengineered)
          </p>
          {selectedPathway === 'edit' && (
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Edit once, gain in one generation</li>
              <li>• Efficacy prediction</li>
              <li>• Off-target risk scanning</li>
              <li>• Regulatory-critical safety</li>
            </ul>
          )}
        </button>
      </div>
    </div>
  )
}

// Breeding Pathway Slide Component
function BreedingPathwaySlide() {
  const [generation, setGeneration] = useState(0)

  const generations = [
    { gen: 0, freq: 20, desc: 'Baseline allele frequency' },
    { gen: 1, freq: 28, desc: 'Initial selection pressure' },
    { gen: 2, freq: 38, desc: 'Accelerated gain' },
    { gen: 3, freq: 50, desc: 'Mid-program progress' },
    { gen: 4, freq: 65, desc: 'Near target' },
    { gen: 5, freq: 80, desc: 'Target achieved' }
  ]

  const currentGen = generations[generation]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 12</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Breed for Naturally Occurring Favorable Alleles</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Weight beneficial variants; stack polygenic contributions over multiple generations; avoids GM label.
      </p>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-cream/60">Gen 0</span>
          <input
            type="range"
            min="0"
            max="5"
            value={generation}
            onChange={(e) => setGeneration(parseInt(e.target.value))}
            className="flex-1 accent-sage"
          />
          <span className="text-xs text-cream/60">Gen 5</span>
        </div>

        <div className="p-6 rounded-xl border border-cream/20 bg-cream/5">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-cream/60 mb-2">
              <span>Generation {currentGen.gen}</span>
              <span>Allele Frequency: {currentGen.freq}%</span>
            </div>
            <div className="w-full h-8 bg-cream/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage transition-all duration-500"
                style={{ width: `${currentGen.freq}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-cream/70">{currentGen.desc}</p>
        </div>
      </div>
    </div>
  )
}

// Gene Editing Slide Component
function GeneEditingSlide() {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 13</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Edit Once, Gain in One Generation</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        AI supports (a) efficacy prediction (which edit works best) and (b) off-target risk scanning (regulatory-critical).
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-cream mb-3">Efficacy Prediction</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Which edit works best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Expected phenotypic outcome</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Success probability scoring</span>
            </li>
          </ul>
        </div>
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-sm font-semibold text-cream mb-3">Off-Target Risk Scanning</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Regulatory-critical safety</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Predicted off-target sites</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Safety score with explainable factors</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
        <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Safety Score Panel</div>
        <div className="grid grid-cols-3 gap-4 text-sm text-cream/70">
          <div>
            <strong className="text-cream">Target Site:</strong> High confidence
          </div>
          <div>
            <strong className="text-cream">Off-Targets:</strong> 2 predicted (low risk)
          </div>
          <div>
            <strong className="text-cream">Overall Safety:</strong> 92/100
          </div>
        </div>
      </div>
    </div>
  )
}

// Regulatory Map Slide Component
function RegulatoryMapSlide() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const regions = [
    {
      id: 'eu',
      name: 'European Union',
      allowed: 'Restrictive',
      labeling: 'Mandatory GM labeling',
      strategy: 'Non-GM line only'
    },
    {
      id: 'us',
      name: 'United States',
      allowed: 'Permissive',
      labeling: 'Case-by-case',
      strategy: 'Bioengineered line viable'
    },
    {
      id: 'asia',
      name: 'Asia',
      allowed: 'Mixed',
      labeling: 'Varies by country',
      strategy: 'Dual-track approach'
    }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 14</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Regulation is the Constraint—and the Opportunity</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        EU restrictive; other markets more permissive / case-by-case; this drives product-line strategy.
      </p>

      <div className="space-y-4">
        {regions.map((region) => (
          <div
            key={region.id}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedRegion === region.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-cream/20 bg-cream/5 hover:border-cream/30'
            }`}
            onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-cream">{region.name}</h3>
              <span className="text-xs text-cream/40">{selectedRegion === region.id ? '−' : '+'}</span>
            </div>
            {selectedRegion === region.id && (
              <div className="mt-4 pt-4 border-t border-cream/20 space-y-2 text-sm text-cream/70">
                <p><strong className="text-cream">Allowed:</strong> {region.allowed}</p>
                <p><strong className="text-cream">Labeling:</strong> {region.labeling}</p>
                <p><strong className="text-cream">Recommended Strategy:</strong> {region.strategy}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Dual Track Slide Component
function DualTrackSlide() {
  const [activeTrack, setActiveTrack] = useState<'a' | 'b' | null>(null)

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 15</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Dual-Track Program: Non-GM Line + Bioengineered Line</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Run two lines from one broodstock. AI manages pedigrees, compliance, and economic tradeoffs.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => setActiveTrack(activeTrack === 'a' ? null : 'a')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            activeTrack === 'a'
              ? 'border-green-500/50 bg-green-500/10'
              : 'border-cream/20 bg-cream/5 hover:border-green-500/30'
          }`}
        >
          <h3 className="text-xl font-semibold text-cream mb-3">Program A: EU/Non-GM</h3>
          <p className="text-sm text-cream/70 mb-4">Genomic Selection Only</p>
          {activeTrack === 'a' && (
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Market: EU, premium markets</li>
              <li>• Speed: Moderate (multi-generation)</li>
              <li>• Premium: Higher price</li>
              <li>• Compliance: Non-GM certified</li>
            </ul>
          )}
        </button>
        <button
          onClick={() => setActiveTrack(activeTrack === 'b' ? null : 'b')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            activeTrack === 'b'
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-cream/20 bg-cream/5 hover:border-purple-500/30'
          }`}
        >
          <h3 className="text-xl font-semibold text-cream mb-3">Program B: Americas/Asia</h3>
          <p className="text-sm text-cream/70 mb-4">GS + Gene Editing</p>
          {activeTrack === 'b' && (
            <ul className="space-y-2 text-sm text-cream/70">
              <li>• Market: US, Asia, permissive regions</li>
              <li>• Speed: Fast (single generation)</li>
              <li>• Premium: Standard pricing</li>
              <li>• Compliance: Bioengineered label</li>
            </ul>
          )}
        </button>
      </div>

      {activeTrack && (
        <div className="p-5 rounded-xl border-l-4 border-purple-500 bg-purple-500/10">
          <div className="text-xs uppercase tracking-wider text-purple-300 mb-2">Tradeoff Chart</div>
          <p className="text-sm text-cream/80">
            {activeTrack === 'a' 
              ? 'Program A: Higher market premium vs slower genetic gain'
              : 'Program B: Faster genetic gain vs standard market pricing'}
          </p>
        </div>
      )}
    </div>
  )
}

// Roadmap Slide Component
function RoadmapSlide() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  const phases = [
    {
      phase: 1,
      title: 'Data Platform + GS Quick Wins',
      months: '0-6',
      milestones: ['Data lake setup', 'ETL pipelines', 'GS implementation', 'Baseline accuracy gains']
    },
    {
      phase: 2,
      title: 'Custom Models (g-FCR, Lice)',
      months: '6-18',
      milestones: ['Model training', 'g-FCR development', 'Lice resistance models', 'Validation']
    },
    {
      phase: 3,
      title: 'In Silico CRISPR Validation',
      months: '18-30',
      milestones: ['Safety package', 'Off-target analysis', 'Efficacy prediction', 'Regulatory prep']
    },
    {
      phase: 4,
      title: 'Go/No-Go and Deploy Dual Lines',
      months: '30-36+',
      milestones: ['Decision point', 'Line separation', 'Compliance tracking', 'Market deployment']
    }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 16</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Phased Plan (0–36+ Months)</h2>

      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.phase}
            className="p-5 rounded-xl border border-cream/20 bg-cream/5 cursor-pointer hover:bg-cream/10 transition-all"
            onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-cream">
                  Phase {phase.phase}: {phase.title}
                </h3>
                <p className="text-xs text-cream/60 mt-1">Months {phase.months}</p>
              </div>
              <span className="text-xs text-cream/40">{expandedPhase === phase.phase ? '−' : '+'}</span>
            </div>
            {expandedPhase === phase.phase && (
              <div className="mt-4 pt-4 border-t border-cream/20">
                <ul className="space-y-2">
                  {phase.milestones.map((milestone, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-sage mt-1">•</span>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Operating Model Slide Component
function OperatingModelSlide() {
  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 17</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Small Core Team + Targeted Partners</h2>
      
      <p className="text-cream/80 mb-8 max-w-3xl text-lg leading-relaxed">
        Hire 2–3 computational bio / bioinformatics experts to own models + manage vendors; 
        pair with GS vendor + boutique AI/genomics partner(s).
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-cream mb-3">Build Internally</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>2-3 computational biologists</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Model ownership & IP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Vendor management</span>
            </li>
          </ul>
        </div>
        <div className="p-5 rounded-xl border border-cream/20 bg-cream/5">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-sm font-semibold text-cream mb-3">Partner Strategically</h3>
          <ul className="space-y-2 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>GS vendor (off-the-shelf tools)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Boutique AI/genomics partners</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-1">•</span>
              <span>Specialized expertise on-demand</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Dashboard Slide Component
function DashboardSlide() {
  const [scenario, setScenario] = useState<'baseline' | 'premium-high' | 'premium-low' | 'fast-approval' | 'slow-approval'>('baseline')

  const kpis = [
    { name: 'Selection Accuracy Uplift', value: '42%', trend: '+5%' },
    { name: 'g-FCR Model Performance', value: 'R² = 0.78', trend: '+0.12' },
    { name: 'Feed Cost Impact', value: '-18%', trend: 'Improving' },
    { name: 'Lice Resistance Gain', value: '+35%', trend: '+8%' },
    { name: 'Off-Target Risk Score', value: '92/100', trend: 'Safe' },
    { name: 'Regulatory Readiness', value: '75%', trend: 'On track' }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Card 18</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">KPIs & Decision Points</h2>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {['baseline', 'premium-high', 'premium-low', 'fast-approval', 'slow-approval'].map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                scenario === s
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'bg-cream/5 text-cream/60 border border-cream/20 hover:bg-cream/10'
              }`}
            >
              {s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-4 rounded-xl border border-cream/20 bg-cream/5">
              <div className="text-xs text-cream/60 mb-1">{kpi.name}</div>
              <div className="text-2xl font-serif text-cream mb-1">{kpi.value}</div>
              <div className="text-xs text-sage">{kpi.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Glossary Slide Component
function GlossarySlide() {
  const terms = [
    { term: 'GEBV', definition: 'Genomic Estimated Breeding Value - prediction of breeding value using genomic data' },
    { term: 'GWAS', definition: 'Genome-Wide Association Study - identifies genetic variants associated with traits' },
    { term: 'GBLUP', definition: 'Genomic Best Linear Unbiased Prediction - statistical method for genomic selection' },
    { term: 'ssGBLUP', definition: 'Single-Step GBLUP - combines pedigree and genomic data in one analysis' },
    { term: 'CNN', definition: 'Convolutional Neural Network - deep learning model for image analysis' },
    { term: 'gRNA', definition: 'Guide RNA - RNA molecule that directs CRISPR to target DNA sequence' },
    { term: 'g-FCR', definition: 'Genomic Feed Conversion Ratio - individual feed efficiency score imputed from genomic data' },
    { term: 'g-Gill', definition: 'Genomic Gill Health Score - selectable trait derived from computer vision analysis' }
  ]

  return (
    <div className="min-h-[50vh] flex flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-cream/50 mb-2">Appendix</div>
      <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6">Glossary</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {terms.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-cream/20 bg-cream/5">
            <h3 className="text-sm font-semibold text-cream mb-2">{item.term}</h3>
            <p className="text-xs text-cream/70">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SalmonAIGenomicsPage() {
  return (
    <DocumentAccessWrapper 
      documentId="salmon-ai-genomics"
      documentTitle="Strategic AI for Salmon Genetic Improvement"
    >
      <PresentationLayout
        title="Strategic AI for Salmon Genetic Improvement"
        subtitle="Turn 2.5 generations of genomic+phenotypic data into a predictive asset"
        slides={slides}
      />
    </DocumentAccessWrapper>
  )
}



