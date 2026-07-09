'use client'

import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/insights'

  return (
    <div className="pt-28 min-h-screen flex items-center justify-center bg-void">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-cream mb-2">Welcome Back</h1>
            <p className="text-stone">Sign in to access your documents</p>
          </div>
          <div className="bg-cream rounded-2xl p-8 shadow-xl border border-stone/20">
            <SignIn 
              fallbackRedirectUrl={redirectUrl}
              signUpUrl="/sign-up"
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
