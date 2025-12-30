'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/documents'

  return (
    <div className="pt-28 min-h-screen flex items-center justify-center bg-void">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-cream mb-2">Create Account</h1>
            <p className="text-stone">Sign up to access exclusive documents</p>
          </div>
          <div className="bg-cream rounded-2xl p-8 shadow-xl border border-stone/20">
            <SignUp 
              fallbackRedirectUrl={redirectUrl}
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none bg-transparent p-0",
                  headerTitle: "text-charcoal",
                  headerSubtitle: "text-warm-gray",
                  formFieldInput: "bg-white border-stone/30 text-charcoal",
                  formFieldLabel: "text-charcoal",
                  formButtonPrimary: "bg-sage hover:bg-sage/90 text-cream",
                  footerActionLink: "text-sage hover:text-sage/80",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
