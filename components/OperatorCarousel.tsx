'use client'

import type { Operator } from '@/lib/airtable';
import { operators as staticOperators } from '@/data/operators';
import { Linkedin } from 'lucide-react';

export default function OperatorCarousel({ operators }: { operators: Operator[] }) {
  // Use static operators if Airtable operators are not available
  const displayOperators = (operators && operators.length > 0) ? operators : staticOperators;

  // Duplicate operators for seamless infinite scroll
  const duplicatedOperators = [...displayOperators, ...displayOperators];

  return (
    <section className="section bg-graphite relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-graphite" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="mono-label mb-4 block">// Our Team</span>
          <h2 className="text-cream mb-4">Operating Partners</h2>
          <p className="body-large text-stone">
            Proven C-suite talent with deep health-tech expertise
          </p>
        </div>

        {/* Continuous Scrolling Carousel */}
        <div className="relative">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-graphite to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-graphite to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-left">
              {duplicatedOperators.map((operator, index) => (
                <div
                  key={`${operator.id}-${index}`}
                  className="flex-shrink-0 w-80 mx-4"
                >
                  <div className="bg-slate/30 border border-violet/20 rounded-xl p-6 h-full hover:bg-slate/50 hover:border-violet/40 transition-all">
                    <div className="flex flex-col items-center text-center">
                      {/* Photo */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-violet/30 bg-slate">
                          <img
                            src={(operator as any).photo ?? '/img/placeholder-headshot.svg'}
                            alt={operator.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-violet/10 blur-xl -z-10" />

                        {/* LinkedIn icon */}
                        {('linkedin' in operator && (operator as any).linkedin) && (
                          <a
                            href={(operator as any).linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute -bottom-1 -right-1 p-1.5 bg-violet rounded-full hover:bg-violet-light transition-colors"
                          >
                            <Linkedin className="w-3 h-3 text-cream" />
                          </a>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-semibold text-cream mb-1">{operator.name}</h3>

                      {/* Title */}
                      {(operator as any).title && (
                        <p className="text-sm font-medium text-violet-light mb-1 line-clamp-2">{(operator as any).title}</p>
                      )}

                      {/* Subtitle */}
                      {(operator as any).subtitle && (
                        <p className="text-xs text-zinc mb-3 line-clamp-1">{(operator as any).subtitle}</p>
                      )}

                      {/* Expertise */}
                      {operator.expertise && operator.expertise.length > 0 && (
                        <p className="text-xs text-stone line-clamp-3">
                          {operator.expertise.join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for continuous scroll animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
