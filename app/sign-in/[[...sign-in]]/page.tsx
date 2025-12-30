'use client'

import { SignIn } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/documents'

  return (
    <div className="pt-28 min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-charcoal mb-2">Welcome Back</h1>
            <p className="text-warm-gray">Sign in to access your documents</p>
          </div>
          <div className="card p-8">
            <SignIn 
              fallbackRedirectUrl={redirectUrl}
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none bg-transparent",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
