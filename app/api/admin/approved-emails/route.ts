import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const isAdmin = user.privateMetadata?.isAdmin === true || user.publicMetadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Get approved emails from admin user's public metadata
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({ limit: 100 })
    
    // Find admin user to get document approvals
    const adminUser = usersResponse.data.find(user => 
      user.privateMetadata?.isAdmin === true || 
      user.publicMetadata?.role === 'admin'
    )
    
    if (adminUser) {
      const documentApprovals = (adminUser.publicMetadata?.documentApprovals as Record<string, string[]>) || {}
      const approvedEmails = documentApprovals[documentId] || []
      return NextResponse.json({ approvedEmails })
    }
    
    return NextResponse.json({ approvedEmails: [] })
  } catch (error) {
    console.error('Error fetching approved emails:', error)
    return NextResponse.json({ error: 'Failed to fetch approved emails' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const isAdmin = user.privateMetadata?.isAdmin === true || user.publicMetadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { documentId, emails } = await request.json()

    if (!documentId || !Array.isArray(emails)) {
      return NextResponse.json({ error: 'documentId and emails array are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = emails
      .map((email: string) => email.trim().toLowerCase())
      .filter((email: string) => email && emailRegex.test(email))

    // Store approved emails in admin user's public metadata
    // This will be checked by the webhook when new users sign up
    const client = await clerkClient()
    
    // Get current metadata
    const currentMetadata = user.publicMetadata || {}
    const documentApprovals = (currentMetadata.documentApprovals as Record<string, string[]>) || {}
    
    // Update approved emails for this document
    documentApprovals[documentId] = validEmails
    
    // Update admin user metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        documentApprovals
      }
    })
    
    // Also grant access to any existing users whose emails match
    const usersResponse = await client.users.getUserList({ limit: 500 })
    let grantedCount = 0
    
    for (const existingUser of usersResponse.data) {
      const userEmail = existingUser.primaryEmailAddress?.emailAddress?.toLowerCase()
      if (userEmail && validEmails.includes(userEmail)) {
        const currentAccess = (existingUser.privateMetadata?.documentAccess as string[]) || []
        if (!currentAccess.includes(documentId)) {
          await client.users.updateUserMetadata(existingUser.id, {
            privateMetadata: {
              ...existingUser.privateMetadata,
              documentAccess: [...currentAccess, documentId]
            }
          })
          grantedCount++
        }
      }
    }
    
    if (grantedCount > 0) {
      console.log(`Granted access to ${grantedCount} existing user(s) for document ${documentId}`)
    }

    return NextResponse.json({ 
      success: true, 
      approvedEmails: validEmails,
      count: validEmails.length
    })
  } catch (error) {
    console.error('Error updating approved emails:', error)
    return NextResponse.json({ error: 'Failed to update approved emails' }, { status: 500 })
  }
}

