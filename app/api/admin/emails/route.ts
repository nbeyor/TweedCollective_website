import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public endpoint to get admin contact emails for access requests
export async function GET() {
  try {
    const client = await clerkClient()
    
    // Find all admin users
    let adminEmails: string[] = []
    let offset = 0
    const limit = 100
    
    while (true) {
      const usersResponse = await client.users.getUserList({ limit, offset })
      
      for (const user of usersResponse.data) {
        const isAdmin = user.privateMetadata?.isAdmin === true || 
                       user.publicMetadata?.role === 'admin'
        
        if (isAdmin && user.primaryEmailAddress?.emailAddress) {
          adminEmails.push(user.primaryEmailAddress.emailAddress)
        }
      }
      
      if (usersResponse.data.length < limit) {
        break
      }
      
      offset += limit
    }
    
    // If no admins found, return empty array
    if (adminEmails.length === 0) {
      console.warn('[Admin Emails] No admin users found')
      return NextResponse.json({ emails: [] })
    }
    
    return NextResponse.json({ emails: adminEmails })
  } catch (error) {
    console.error('Error fetching admin emails:', error)
    return NextResponse.json({ emails: [] }, { status: 500 })
  }
}

