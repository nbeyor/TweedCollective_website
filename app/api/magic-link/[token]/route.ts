import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

interface MagicLink {
  documentId: string
  documentTitle?: string
  targetEmail: string
  createdAt: string
  expiresAt: string
  redeemedAt?: string
  redeemedBy?: string
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
      return NextResponse.json({ error: 'Invalid or expired invitation link' }, { status: 404 })
    }

    // Check if expired
    if (new Date(magicLink.expiresAt) < new Date()) {
      return NextResponse.json({ 
        error: 'This invitation has expired',
        documentId: magicLink.documentId 
      }, { status: 410 })
    }

    // Check if already redeemed
    if (magicLink.redeemedAt) {
      return NextResponse.json({ 
        error: 'This invitation has already been used',
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
        targetEmail: magicLink.targetEmail,
        token 
      })
    }

    // User is authenticated - validate email matches
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Get all user emails and check if any match the target
    const userEmails = user.emailAddresses?.map(e => e.emailAddress.toLowerCase()) || []
    const primaryEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase()
    
    if (primaryEmail && !userEmails.includes(primaryEmail)) {
      userEmails.push(primaryEmail)
    }

    const targetEmailLower = magicLink.targetEmail.toLowerCase()
    
    if (!userEmails.includes(targetEmailLower)) {
      return NextResponse.json({ 
        error: 'Email mismatch',
        message: `This invitation was sent to ${magicLink.targetEmail}. Please sign in with that email address.`,
        targetEmail: magicLink.targetEmail
      }, { status: 403 })
    }

    // Email matches - grant access
    const currentAccess = (user.privateMetadata?.documentAccess as string[]) || []
    
    if (!currentAccess.includes(magicLink.documentId)) {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          documentAccess: [...currentAccess, magicLink.documentId]
        }
      })
    }

    // Mark magic link as redeemed
    magicLinks[token] = {
      ...magicLink,
      redeemedAt: new Date().toISOString(),
      redeemedBy: userId
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
      method: 'invitation' | 'manual'
    }>) || []
    
    auditTrail.push({
      userId: userId,
      email: primaryEmail || magicLink.targetEmail,
      documentIds: [magicLink.documentId],
      timestamp: new Date().toISOString(),
      method: 'invitation'
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
    console.error('Error validating invitation link:', error)
    return NextResponse.json({ error: 'Failed to validate invitation link' }, { status: 500 })
  }
}
