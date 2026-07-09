import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/client-access'

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

    return NextResponse.json({ isAdmin: isAdminUser(user) })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
