import React from 'react'
import TweedLogo from '@/components/ui/tweed-logo'

export default function LogoTest() {
  return (
    <div className="min-h-screen bg-neutral-cream pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16">Logo Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Animated Logo */}
          <div className="text-center">
            <h2 className="mb-8">Animated Logo</h2>
            <div className="flex flex-col items-center space-y-8">
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Small (32px)</p>
                <TweedLogo animated={true} size={32} />
              </div>
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Medium (80px)</p>
                <TweedLogo animated={true} size={80} />
              </div>
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Large (128px)</p>
                <TweedLogo animated={true} size={128} />
              </div>
            </div>
          </div>

          {/* Static Logo */}
          <div className="text-center">
            <h2 className="mb-8">Static Logo</h2>
            <div className="flex flex-col items-center space-y-8">
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Small (32px)</p>
                <TweedLogo animated={false} size={32} />
              </div>
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Medium (80px)</p>
                <TweedLogo animated={false} size={80} />
              </div>
              <div>
                <p className="text-sm text-neutral-warm-gray mb-4">Large (128px)</p>
                <TweedLogo animated={false} size={128} />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-20">
          <h2 className="text-center mb-8">Usage Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="mb-4">Header (Animated when not scrolled)</h3>
              <div className="flex items-center space-x-2">
                <TweedLogo animated={true} size={32} />
                <span className="font-display text-lg">Tweed</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="mb-4">Footer (Static)</h3>
              <div className="flex items-center space-x-2">
                <TweedLogo animated={false} size={32} />
                <span className="font-display text-lg">Tweed Collective</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="mb-4">Large Display</h3>
              <div className="flex justify-center">
                <TweedLogo animated={true} size={128} />
              </div>
            </div>
          </div>
        </div>

        {/* With Text Examples */}
        <div className="mt-20">
          <h2 className="text-center mb-8">With Text Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="mb-4">Animated with Text</h3>
              <div className="flex justify-center">
                <TweedLogo animated={true} size={80} withText={true} />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="mb-4">Static with Text</h3>
              <div className="flex justify-center">
                <TweedLogo animated={false} size={80} withText={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 