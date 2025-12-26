import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Admin emails - add your email here
const ADMIN_EMAILS = [
  'nbeyor@gmail.com',
  // Add more admin emails as needed
]

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }

    // Check if user email is in admin list
    const userEmail = user.primaryEmailAddress?.emailAddress
    const isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false

    // Alternatively, check for isAdmin in user metadata
    const metadataAdmin = user.privateMetadata?.isAdmin === true

    return NextResponse.json({ isAdmin: isAdmin || metadataAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
