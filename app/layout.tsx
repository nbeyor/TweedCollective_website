import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import SiteChrome from '@/components/SiteChrome'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Tweed Collective | AI × Life Sciences Advisory',
    template: '%s | Tweed Collective',
  },
  description: 'Operators and builders at the frontier of AI and life sciences. We advise, we embed, we build.',
  keywords: 'AI life sciences, biotech consulting, fractional operators, due diligence, computational biology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Card and modal backgrounds - light for readability
          card: "bg-cream shadow-xl border border-stone/20",
          modalContent: "bg-cream",
          
          // Headers
          headerTitle: "text-charcoal font-semibold",
          headerSubtitle: "text-warm-gray",
          
          // Form elements
          formFieldInput: "bg-white border-stone/30 text-charcoal placeholder:text-stone/50 focus:border-sage focus:ring-sage/20",
          formFieldLabel: "text-charcoal font-medium",
          formFieldInputShowPasswordButton: "text-warm-gray hover:text-charcoal",
          
          // Buttons
          formButtonPrimary: "bg-sage hover:bg-sage/90 text-cream font-medium",
          formButtonReset: "text-sage hover:text-sage/80",
          
          // Links
          footerActionLink: "text-sage hover:text-sage/80 font-medium",
          
          // Social buttons
          socialButtonsBlockButton: "bg-white border-stone/30 text-charcoal hover:bg-stone/10",
          socialButtonsBlockButtonText: "text-charcoal font-medium",
          
          // Dividers
          dividerLine: "bg-stone/30",
          dividerText: "text-warm-gray",
          
          // Verification code inputs
          otpCodeFieldInput: "bg-white border-stone/30 text-charcoal text-lg font-mono",
          
          // Identity preview
          identityPreviewText: "text-charcoal",
          identityPreviewEditButton: "text-sage hover:text-sage/80",
          
          // Alert messages
          alert: "bg-cream border-stone/30",
          alertText: "text-charcoal",
          
          // User button
          userButtonPopoverCard: "bg-cream border border-stone/20 shadow-xl",
          userButtonPopoverActionButton: "text-charcoal hover:bg-stone/10",
          userButtonPopoverActionButtonText: "text-charcoal",
          userButtonPopoverFooter: "border-stone/20",
        },
        variables: {
          colorPrimary: "#4A5D4C",
          colorText: "#1a1a1a",
          colorTextSecondary: "#666",
          colorBackground: "#F5F4F0",
          colorInputBackground: "#ffffff",
          colorInputText: "#1a1a1a",
          borderRadius: "0.75rem",
        }
      }}
    >
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="antialiased">
          <div className="min-h-screen flex flex-col bg-void">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
