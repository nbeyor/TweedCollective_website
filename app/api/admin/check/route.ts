import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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

    // Check for isAdmin in user metadata (managed via Clerk Dashboard)
    const isAdmin = user.privateMetadata?.isAdmin === true ||
                    user.publicMetadata?.role === 'admin'

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
