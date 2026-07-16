import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { CLIENT_CONFIGS } from '@/content/clients'

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

    const { userId, documentId, clientSlug, action } = await request.json()

    if (!userId || !action || (!documentId && !clientSlug)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action !== 'grant' && action !== 'revoke') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const client = await clerkClient()
    const targetUser = await client.users.getUser(userId)

    // Client workspace access lives in PUBLIC metadata (read by
    // requireClientAccess), unlike document access which is private.
    if (clientSlug) {
      if (!CLIENT_CONFIGS.some(c => c.slug === clientSlug)) {
        return NextResponse.json({ error: 'Unknown client workspace' }, { status: 400 })
      }

      const currentSlugs = Array.isArray(targetUser.publicMetadata?.clientSlugs)
        ? (targetUser.publicMetadata.clientSlugs as unknown[]).filter(
            (slug): slug is string => typeof slug === 'string'
          )
        : []

      const newSlugs = action === 'grant'
        ? (currentSlugs.includes(clientSlug) ? currentSlugs : [...currentSlugs, clientSlug])
        : currentSlugs.filter(s => s !== clientSlug)

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...targetUser.publicMetadata,
          clientSlugs: newSlugs,
        },
      })

      return NextResponse.json({ success: true, clientSlugs: newSlugs })
    }

    // Get current user's document access
    const currentAccess = (targetUser.privateMetadata?.documentAccess as string[]) || []

    const newAccess = action === 'grant'
      ? (currentAccess.includes(documentId) ? currentAccess : [...currentAccess, documentId])
      : currentAccess.filter(d => d !== documentId)

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
