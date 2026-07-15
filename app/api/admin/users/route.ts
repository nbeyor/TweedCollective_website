import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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

    // Check if current user is admin (managed via Clerk Dashboard)
    const isAdmin = currentUserData.privateMetadata?.isAdmin === true ||
                    currentUserData.publicMetadata?.role === 'admin'

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
      clientSlugs: Array.isArray(user.publicMetadata?.clientSlugs)
        ? (user.publicMetadata.clientSlugs as unknown[]).filter(
            (slug): slug is string => typeof slug === 'string'
          )
        : [],
      createdAt: user.createdAt
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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
    const isAdmin = currentUserData.privateMetadata?.isAdmin === true ||
                    currentUserData.publicMetadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId: targetUserId } = await request.json()

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete the user from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(targetUserId)

    console.log(`[Admin] User ${targetUserId} deleted by admin ${userId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
