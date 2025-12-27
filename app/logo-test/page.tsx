import React from 'react'
import TweedLogo, { TweedLogoSimple } from '@/components/ui/tweed-logo'

export default function LogoTest() {
  return (
    <div className="min-h-screen bg-void pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-cream mb-16">Logo Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Animated Logo */}
          <div className="text-center">
            <h2 className="text-cream mb-8">Animated Logo</h2>
            <div className="flex flex-col items-center space-y-8">
              <div>
                <p className="text-sm text-stone mb-4">Small (32px)</p>
                <TweedLogo animated={true} size={32} />
              </div>
              <div>
                <p className="text-sm text-stone mb-4">Medium (80px)</p>
                <TweedLogo animated={true} size={80} />
              </div>
              <div>
                <p className="text-sm text-stone mb-4">Large (128px)</p>
                <TweedLogo animated={true} size={128} />
              </div>
            </div>
          </div>

          {/* Static Logo */}
          <div className="text-center">
            <h2 className="text-cream mb-8">Static Logo</h2>
            <div className="flex flex-col items-center space-y-8">
              <div>
                <p className="text-sm text-stone mb-4">Small (32px)</p>
                <TweedLogo animated={false} size={32} />
              </div>
              <div>
                <p className="text-sm text-stone mb-4">Medium (80px)</p>
                <TweedLogo animated={false} size={80} />
              </div>
              <div>
                <p className="text-sm text-stone mb-4">Large (128px)</p>
                <TweedLogo animated={false} size={128} />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-20">
          <h2 className="text-center text-cream mb-8">Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-carbon p-6 rounded-lg border border-slate">
              <h3 className="text-cream mb-4">Header (Animated)</h3>
              <div className="flex items-center space-x-2">
                <TweedLogo animated={true} size={32} />
                <span className="font-sans text-lg text-cream">Tweed</span>
              </div>
            </div>
            
            <div className="bg-carbon p-6 rounded-lg border border-slate">
              <h3 className="text-cream mb-4">Footer (Static)</h3>
              <div className="flex items-center space-x-2">
                <TweedLogo animated={false} size={32} />
                <span className="font-sans text-lg text-cream">Tweed Collective</span>
              </div>
            </div>
            
            <div className="bg-carbon p-6 rounded-lg border border-slate">
              <h3 className="text-cream mb-4">Large Display</h3>
              <div className="flex justify-center">
                <TweedLogo animated={true} size={128} />
              </div>
            </div>
          </div>
        </div>

        {/* Simple Logo Examples */}
        <div className="mt-20">
          <h2 className="text-center text-cream mb-8">Simple Logo (Small Sizes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-carbon p-6 rounded-lg border border-slate text-center">
              <h3 className="text-cream mb-4">16px</h3>
              <div className="flex justify-center">
                <TweedLogoSimple size={16} />
              </div>
            </div>
            
            <div className="bg-carbon p-6 rounded-lg border border-slate text-center">
              <h3 className="text-cream mb-4">24px</h3>
              <div className="flex justify-center">
                <TweedLogoSimple size={24} />
              </div>
            </div>
            
            <div className="bg-carbon p-6 rounded-lg border border-slate text-center">
              <h3 className="text-cream mb-4">32px</h3>
              <div className="flex justify-center">
                <TweedLogoSimple size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
