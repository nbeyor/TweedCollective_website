import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

interface MagicLink {
  documentId: string
  createdAt: string
  usedAt?: string
  usedBy?: string
  expiresAt?: string
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Get admin user to check magic links
    const client = await clerkClient()
    
    // Find admin user
    let adminUser = null
    let offset = 0
    const limit = 100
    
    while (!adminUser) {
      const usersResponse = await client.users.getUserList({ limit, offset })
      
      adminUser = usersResponse.data.find(user => 
        user.privateMetadata?.isAdmin === true || 
        user.publicMetadata?.role === 'admin'
      )
      
      if (usersResponse.data.length < limit || adminUser) {
        break
      }
      
      offset += limit
    }
    
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 500 })
    }

    const adminUserData = await client.users.getUser(adminUser.id)
    const magicLinks = (adminUserData.publicMetadata?.magicLinks as Record<string, MagicLink>) || {}
    
    const magicLink = magicLinks[token]

    if (!magicLink) {
      return NextResponse.json({ error: 'Invalid or expired magic link' }, { status: 404 })
    }

    // Check if already used
    if (magicLink.usedAt || magicLink.usedBy) {
      return NextResponse.json({ 
        error: 'This magic link has already been used',
        documentId: magicLink.documentId 
      }, { status: 410 })
    }

    // Check if expired
    if (magicLink.expiresAt && new Date(magicLink.expiresAt) < new Date()) {
      return NextResponse.json({ 
        error: 'This magic link has expired',
        documentId: magicLink.documentId 
      }, { status: 410 })
    }

    // Check if user is authenticated
    const { userId } = await auth()
    
    if (!userId) {
      // Return info that user needs to authenticate
      return NextResponse.json({ 
        needsAuth: true,
        documentId: magicLink.documentId,
        token 
      })
    }

    // User is authenticated - grant access and mark as used
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Grant access to document
    const currentAccess = (user.privateMetadata?.documentAccess as string[]) || []
    
    if (!currentAccess.includes(magicLink.documentId)) {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          documentAccess: [...currentAccess, magicLink.documentId]
        }
      })
    }

    // Mark magic link as used
    magicLinks[token] = {
      ...magicLink,
      usedAt: new Date().toISOString(),
      usedBy: userId
    }

    await client.users.updateUserMetadata(adminUser.id, {
      publicMetadata: {
        ...adminUserData.publicMetadata,
        magicLinks
      }
    })

    // Store audit trail
    const auditTrail = (adminUserData.publicMetadata?.accessAuditTrail as Array<{
      userId: string
      email: string
      documentIds: string[]
      timestamp: string
      method: 'bulk-email' | 'magic-link'
    }>) || []
    
    auditTrail.push({
      userId: userId,
      email: user.primaryEmailAddress?.emailAddress || 'unknown',
      documentIds: [magicLink.documentId],
      timestamp: new Date().toISOString(),
      method: 'magic-link'
    })
    
    const recentAudit = auditTrail.slice(-100)
    
    await client.users.updateUserMetadata(adminUser.id, {
      publicMetadata: {
        ...adminUserData.publicMetadata,
        accessAuditTrail: recentAudit
      }
    })

    return NextResponse.json({ 
      success: true,
      documentId: magicLink.documentId,
      message: 'Access granted successfully'
    })
  } catch (error) {
    console.error('Error validating magic link:', error)
    return NextResponse.json({ error: 'Failed to validate magic link' }, { status: 500 })
  }
}
