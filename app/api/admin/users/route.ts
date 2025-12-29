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
    
    // Get admin user to access audit trail
    let adminUser = null
    let offset = 0
    const limit = 100
    
    while (!adminUser) {
      const adminResponse = await client.users.getUserList({ limit, offset })
      
      adminUser = adminResponse.data.find(user => 
        user.privateMetadata?.isAdmin === true || 
        user.publicMetadata?.role === 'admin'
      )
      
      if (adminResponse.data.length < limit || adminUser) {
        break
      }
      
      offset += limit
    }
    
    const auditTrail = adminUser 
      ? ((await client.users.getUser(adminUser.id)).publicMetadata?.accessAuditTrail as Array<{
          userId: string
          email: string
          documentIds: string[]
          timestamp: string
          method: 'bulk-email' | 'magic-link'
        }>) || []
      : []
    
    // Create a map of user grants from audit trail
    const userGrants: Record<string, { method: 'bulk-email' | 'magic-link' | 'manual', timestamp: string, documentIds: string[] }[]> = {}
    
    auditTrail.forEach(entry => {
      if (!userGrants[entry.userId]) {
        userGrants[entry.userId] = []
      }
      entry.documentIds.forEach(docId => {
        userGrants[entry.userId].push({
          method: entry.method,
          timestamp: entry.timestamp,
          documentIds: [docId]
        })
      })
    })
    
    const users = usersResponse.data.map(user => {
      const grants = userGrants[user.id] || []
      const grantInfo: Record<string, { method: 'bulk-email' | 'magic-link' | 'manual', timestamp: string }> = {}
      
      grants.forEach(grant => {
        grant.documentIds.forEach(docId => {
          if (!grantInfo[docId] || new Date(grant.timestamp) > new Date(grantInfo[docId].timestamp)) {
            grantInfo[docId] = {
              method: grant.method,
              timestamp: grant.timestamp
            }
          }
        })
      })
      
      // Mark documents without grant info as manual
      const documentAccess = (user.privateMetadata?.documentAccess as string[]) || []
      documentAccess.forEach(docId => {
        if (!grantInfo[docId]) {
          grantInfo[docId] = {
            method: 'manual',
            timestamp: user.createdAt.toString()
          }
        }
      })
      
      return {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || 'No email',
        firstName: user.firstName,
        lastName: user.lastName,
        documentAccess,
        createdAt: user.createdAt,
        grantInfo // Map of documentId -> { method, timestamp }
      }
    })

    return NextResponse.json({ 
      users,
      auditTrail: auditTrail.slice(-50) // Return last 50 entries
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
