'use client'

import { useState } from 'react';
import type { Operator } from '@/lib/airtable';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';

// Static operator data for carousel
const staticOperators = [
  {
    id: '1',
    name: 'Bob Battista',
    title: 'Head of Commercial, Salt AI',
    expertise: ['Life sciences go-to-market', 'Medical intelligence platforms', 'Commercial strategy', 'Enterprise AI adoption'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '2',
    name: 'Sibel Sayiner',
    title: 'VP, Business Operations & Analytics, Marley Medical',
    subtitle: '(prev. BCG, Propeller Health)',
    expertise: ['Digital health ops', 'Data-driven commercialization', 'Chronic disease virtual care', 'Payer/provider strategy'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '3',
    name: 'Stuart John',
    title: 'First American',
    expertise: ['Enterprise data platforms', 'Title & escrow tech', 'Large-scale systems modernization'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '4',
    name: 'Syuzi Pakhchyan',
    title: 'Head of Innovation & Emerging Experiences, Target',
    subtitle: '(prev. Design Director, BCG Digital Ventures)',
    expertise: ['Wearable tech & emerging interfaces', 'Experience design', 'Retail innovation', 'Fashion–technology convergence'],
    photo: '/img/placeholder-headshot.svg'
  },
  {
    id: '5',
    name: 'Amy Zhang',
    title: 'Marketing Strategy & Growth',
    subtitle: '(formerly Senior Growth Architect, BCG Digital Ventures)',
    expertise: ['Growth marketing', 'Go-to-market for SaaS', 'Digital experiments & performance', 'Mission-driven brand strategy'],
    photo: '/img/placeholder-headshot.svg'
  }
]

export default function OperatorCarousel({ operators }: { operators: Operator[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use static operators if Airtable operators are not available
  const displayOperators = (operators && operators.length > 0) ? operators : staticOperators;
  const currentOperator = displayOperators[currentIndex];

  const nextOperator = () => {
    setCurrentIndex((prev) => (prev + 1) % displayOperators.length);
  };

  const prevOperator = () => {
    setCurrentIndex((prev) => (prev - 1 + displayOperators.length) % displayOperators.length);
  };

  return (
    <section className="section bg-stone/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4">Our Operating Partners</h2>
          <p className="body-large text-warm-gray">
            Proven C-suite talent with deep health-tech expertise
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-8">
            {/* Previous Button */}
            <button
              onClick={prevOperator}
              className="p-2 rounded-full bg-sage/10 hover:bg-sage/20 transition-colors"
              aria-label="Previous operator"
            >
              <ChevronLeft className="w-6 h-6 text-sage" />
            </button>

            {/* Operator Card */}
            <div className="flex-1 max-w-md">
              <div className="text-center">
                <div className="relative mb-6">
                  <img 
                    src={currentOperator.photo ?? '/img/placeholder-headshot.svg'}
                    alt={currentOperator.name} 
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-sage/20"
                  />
                  {('linkedin' in currentOperator && currentOperator.linkedin) ? (
                    <a
                      href={(currentOperator as any).linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-0 right-0 p-2 bg-sage rounded-full hover:bg-sage/90 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-cream" />
                    </a>
                  ) : null}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{currentOperator.name}</h3>
                
                {(currentOperator as any).title && (
                  <p className="text-sm font-medium text-warm-gray mb-1">{(currentOperator as any).title}</p>
                )}
                
                {(currentOperator as any).subtitle && (
                  <p className="text-xs text-warm-gray/70 mb-3">{(currentOperator as any).subtitle}</p>
                )}
                
                {currentOperator.expertise && currentOperator.expertise.length > 0 && (
                  <p className="text-sm text-warm-gray mb-4">
                    {currentOperator.expertise.join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextOperator}
              className="p-2 rounded-full bg-sage/10 hover:bg-sage/20 transition-colors"
              aria-label="Next operator"
            >
              <ChevronRight className="w-6 h-6 text-sage" />
            </button>
          </div>

          {/* Dots Indicator */}
          {displayOperators.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {displayOperators.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-sage' : 'bg-stone'
                  }`}
                  aria-label={`Go to operator ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 