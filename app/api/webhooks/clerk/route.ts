import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

async function getAdminUser(client: ReturnType<typeof clerkClient> extends Promise<infer T> ? T : never): Promise<{ id: string; email: string } | null> {
  try {
    // Try to get all users with pagination to find admin
    let adminUser = null
    let offset = 0
    const limit = 100
    
    while (!adminUser) {
      const usersResponse = await client.users.getUserList({ limit, offset })
      
      adminUser = usersResponse.data.find(user => 
        user.privateMetadata?.isAdmin === true || 
        user.publicMetadata?.role === 'admin'
      )
      
      // If no more users or found admin, break
      if (usersResponse.data.length < limit || adminUser) {
        break
      }
      
      offset += limit
    }
    
    if (adminUser && adminUser.primaryEmailAddress?.emailAddress) {
      return {
        id: adminUser.id,
        email: adminUser.primaryEmailAddress.emailAddress
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching admin user:', error)
    return null
  }
}

async function getAdminEmails(): Promise<string[]> {
  try {
    const client = await clerkClient()
    const adminUser = await getAdminUser(client)
    
    if (adminUser) {
      return [adminUser.email]
    }
    
    return []
  } catch (error) {
    console.error('Error fetching admin emails:', error)
    return []
  }
}

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Check if webhook secret is configured
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    // Normalize all email addresses
    const allEmails = (email_addresses || [])
      .map(addr => addr?.email_address?.trim().toLowerCase())
      .filter((email): email is string => !!email && email.includes('@'))
    
    const primaryEmail = allEmails[0] || 'No email'
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'No name provided'

    console.log(`[Webhook] New user created: ${primaryEmail} (ID: ${id})`)
    console.log(`[Webhook] All emails for user: ${allEmails.join(', ')}`)

    // Check approved emails and auto-grant access
    try {
      const client = await clerkClient()
      const adminUser = await getAdminUser(client)
      
      if (!adminUser) {
        console.warn('[Webhook] No admin user found, skipping auto-grant check')
      } else {
        console.log(`[Webhook] Found admin user: ${adminUser.email} (ID: ${adminUser.id})`)
        
        // Get admin user's full data to access metadata
        const adminUserData = await client.users.getUser(adminUser.id)
        const documentApprovals = (adminUserData.publicMetadata?.documentApprovals as Record<string, string[]>) || {}
        const documentsToGrant: string[] = []
        
        console.log(`[Webhook] Checking ${Object.keys(documentApprovals).length} document(s) for approved emails`)
        
        // Check each document's approved emails against all user emails
        for (const [documentId, approvedEmails] of Object.entries(documentApprovals)) {
          if (!Array.isArray(approvedEmails)) {
            console.warn(`[Webhook] Invalid approved emails format for document ${documentId}`)
            continue
          }
          
          // Check if any of the user's emails match approved emails
          const normalizedApproved = approvedEmails.map(e => e.trim().toLowerCase())
          const hasMatch = allEmails.some(userEmail => normalizedApproved.includes(userEmail))
          
          if (hasMatch) {
            documentsToGrant.push(documentId)
            console.log(`[Webhook] Match found for document ${documentId} - user email matches approved list`)
          }
        }
        
        // Auto-grant access to matching documents
        if (documentsToGrant.length > 0) {
          const currentAccess = (evt.data.private_metadata?.documentAccess as string[]) || []
          const newAccess = Array.from(new Set([...currentAccess, ...documentsToGrant]))
          
          await client.users.updateUserMetadata(id, {
            privateMetadata: {
              ...(evt.data.private_metadata || {}),
              documentAccess: newAccess
            }
          })
          
          // Store audit trail in admin metadata
          const auditTrail = (adminUserData.publicMetadata?.accessAuditTrail as Array<{
            userId: string
            email: string
            documentIds: string[]
            timestamp: string
            method: 'bulk-email' | 'magic-link'
          }>) || []
          
          auditTrail.push({
            userId: id,
            email: primaryEmail,
            documentIds: documentsToGrant,
            timestamp: new Date().toISOString(),
            method: 'bulk-email'
          })
          
          // Keep only last 100 audit entries
          const recentAudit = auditTrail.slice(-100)
          
          await client.users.updateUserMetadata(adminUser.id, {
            publicMetadata: {
              ...adminUserData.publicMetadata,
              accessAuditTrail: recentAudit
            }
          })
          
          console.log(`[Webhook] ✅ Auto-granted access to ${documentsToGrant.length} document(s) for ${primaryEmail}: ${documentsToGrant.join(', ')}`)
        } else {
          console.log(`[Webhook] No matching approved emails found for ${primaryEmail}`)
        }
      }
      
      // Check for pending magic link grants
      if (adminUser) {
        const adminUserData = await client.users.getUser(adminUser.id)
        const magicLinks = (adminUserData.publicMetadata?.magicLinks as Record<string, {
          documentId: string
          createdAt: string
          usedAt?: string
          usedBy?: string
          expiresAt?: string
        }>) || {}
        
        const pendingLinks = Object.entries(magicLinks).filter(([token, link]) => {
          // Check if link is unused and not expired
          if (link.usedAt || link.usedBy) return false
          if (link.expiresAt && new Date(link.expiresAt) < new Date()) return false
          return true
        })
        
        if (pendingLinks.length > 0) {
          console.log(`[Webhook] Found ${pendingLinks.length} pending magic link(s), checking for matches...`)
          
          // Note: Magic links are redeemed via the magic link page, not automatically on signup
          // This is intentional - user must click the link to redeem it
        }
      }
    } catch (error) {
      console.error('[Webhook] Error checking approved emails:', error)
      console.error('[Webhook] Error details:', error instanceof Error ? error.message : String(error))
      // Don't fail the webhook if this fails
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json({ success: true, warning: 'Email not sent - API key missing' })
    }

    try {
      // Get admin emails from Clerk
      const adminEmails = await getAdminEmails()
      
      if (adminEmails.length === 0) {
        console.warn('No admin emails found, skipping email notification')
        return NextResponse.json({ success: true, warning: 'No admin emails found' })
      }
      
      console.log(`Attempting to send email for new user: ${primaryEmail} to admin(s): ${adminEmails.join(', ')}`)
      
      const resend = getResend()
      if (!resend) {
        console.warn('Resend not configured, skipping email')
        return NextResponse.json({ success: true, warning: 'Email not sent - Resend not configured' })
      }
      
      // Send email notification to all admins
      const result = await resend.emails.send({
        from: 'Tweed Collective <onboarding@resend.dev>',
        to: adminEmails,
        subject: `New User Signup: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">New User Signup</h2>
            <p>A new user has signed up on Tweed Collective:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${primaryEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">User ID</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${id}</td>
              </tr>
            </table>
            <p style="margin-top: 20px;">
              <a href="https://tweedcollective.ai/admin" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
                Manage Access in Admin
              </a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              To grant document access, go to the Admin dashboard or Clerk Dashboard.
            </p>
          </div>
        `,
      })

      console.log(`Email sent to admin(s) for new user: ${primaryEmail}`, result)
      
      // Check for Resend errors
      if (result.error) {
        console.error('Resend API error:', result.error)
      }
      
      if (!result.data) {
        console.error('Resend API returned no data:', result)
      } else {
        console.log('Email ID:', result.data.id)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      // Don't fail the webhook if email fails
    }
  }

  console.log(`Webhook processed: ${eventType}`)

  return NextResponse.json({ success: true })
}
