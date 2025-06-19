import React from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import CaseStudies from '@/components/CaseStudies'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Services />
      <CaseStudies />
      <Footer />
    </main>
  )
} 