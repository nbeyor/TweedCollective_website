import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId: currentUserId } = await auth()
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserData = await currentUser()
    
    if (!currentUserData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin (managed via Clerk Dashboard)
    const isAdmin = currentUserData.privateMetadata?.isAdmin === true ||
                    currentUserData.publicMetadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, documentId, action } = await request.json()

    if (!userId || !documentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get current user's document access
    const client = await clerkClient()
    const targetUser = await client.users.getUser(userId)
    const currentAccess = (targetUser.privateMetadata?.documentAccess as string[]) || []

    let newAccess: string[]

    if (action === 'grant') {
      // Add document if not already present
      newAccess = currentAccess.includes(documentId) 
        ? currentAccess 
        : [...currentAccess, documentId]
    } else if (action === 'revoke') {
      // Remove document
      newAccess = currentAccess.filter(d => d !== documentId)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update user's private metadata
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...targetUser.privateMetadata,
        documentAccess: newAccess,
      },
    })

    return NextResponse.json({ success: true, documentAccess: newAccess })
  } catch (error) {
    console.error('Error updating access:', error)
    return NextResponse.json({ error: 'Failed to update access' }, { status: 500 })
  }
}
