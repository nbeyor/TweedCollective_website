import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getClientConfig } from '@/content/clients'

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

    const { userId, clientSlug, action } = await request.json()

    if (!userId || !clientSlug || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!getClientConfig(clientSlug)) {
      return NextResponse.json({ error: 'Unknown client workspace' }, { status: 400 })
    }

    const client = await clerkClient()
    const targetUser = await client.users.getUser(userId)
    const currentSlugs = Array.isArray(targetUser.publicMetadata?.clientSlugs)
      ? (targetUser.publicMetadata.clientSlugs as unknown[]).filter(
          (slug): slug is string => typeof slug === 'string'
        )
      : []

    let newSlugs: string[]

    if (action === 'grant') {
      newSlugs = currentSlugs.includes(clientSlug)
        ? currentSlugs
        : [...currentSlugs, clientSlug]
    } else if (action === 'revoke') {
      newSlugs = currentSlugs.filter(slug => slug !== clientSlug)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        clientSlugs: newSlugs,
      },
    })

    return NextResponse.json({ success: true, clientSlugs: newSlugs })
  } catch (error) {
    console.error('Error updating client workspace access:', error)
    return NextResponse.json({ error: 'Failed to update client workspace access' }, { status: 500 })
  }
}
