import React from 'react'

const workLines = [
  'AI diligence for a private equity buyer evaluating a clinical trials software platform, including a quantified opportunity model',
  'Product strategy sprint for a global clinical research company rebuilding its flagship intelligence product',
  'AI transformation program for an eClinical software company, from executive workshop through a measured developer productivity pilot',
  'Ongoing AI advisory to a global life sciences investor and its portfolio companies',
]

export default function RecentWork() {
  return (
    <section className="section bg-void relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="mono-label mb-4 block">// Recent work</span>
          <h2 className="text-cream mb-8">Recent work</h2>
          <ul className="space-y-4">
            {workLines.map((line) => (
              <li key={line} className="text-stone leading-relaxed flex gap-3">
                <span className="text-gold font-mono shrink-0">–</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
