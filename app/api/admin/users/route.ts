import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Admin emails - must match check/route.ts
const ADMIN_EMAILS = [
  'nbeyor@gmail.com',
]

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserData = await currentUser()
    
    if (!currentUserData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const userEmail = currentUserData.primaryEmailAddress?.emailAddress
    const isAdmin = (userEmail && ADMIN_EMAILS.includes(userEmail)) || 
                    currentUserData.privateMetadata?.isAdmin === true

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all users from Clerk
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({ limit: 100 })
    
    const users = usersResponse.data.map(user => ({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || 'No email',
      firstName: user.firstName,
      lastName: user.lastName,
      documentAccess: (user.privateMetadata?.documentAccess as string[]) || [],
      createdAt: user.createdAt,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
