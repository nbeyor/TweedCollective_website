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

async function getAdminEmails(): Promise<string[]> {
  try {
    const client = await clerkClient()
    const adminEmails: string[] = []
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
    
    return adminEmails
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
    
    const primaryEmail = email_addresses?.[0]?.email_address || 'No email'
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'No name provided'

    console.log(`[Webhook] New user created: ${primaryEmail} (ID: ${id})`)

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
      
      console.log(`Sending email for new user: ${primaryEmail} to admin(s): ${adminEmails.join(', ')}`)
      
      const resend = getResend()
      if (!resend) {
        console.warn('Resend not configured, skipping email')
        return NextResponse.json({ success: true, warning: 'Email not sent - Resend not configured' })
      }
      
      // Send email notification to all admins
      const result = await resend.emails.send({
        from: 'Tweed Collective <noreply@tweedcollective.ai>',
        to: adminEmails,
        subject: `New User Signup: ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #1a1a1a; margin-bottom: 24px;">New User Signup</h2>
            <p style="color: #666; margin-bottom: 20px;">A new user has signed up on Tweed Collective:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9f8f6; border-radius: 8px;">
              <tr>
                <td style="padding: 16px; font-weight: 600; color: #1a1a1a;">Name</td>
                <td style="padding: 16px; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 16px; font-weight: 600; color: #1a1a1a; border-top: 1px solid #eee;">Email</td>
                <td style="padding: 16px; color: #333; border-top: 1px solid #eee;">${primaryEmail}</td>
              </tr>
              <tr>
                <td style="padding: 16px; font-weight: 600; color: #1a1a1a; border-top: 1px solid #eee;">User ID</td>
                <td style="padding: 16px; color: #333; border-top: 1px solid #eee; font-family: monospace; font-size: 12px;">${id}</td>
              </tr>
            </table>
            <p style="margin-top: 24px;">
              <a href="https://tweedcollective.ai/admin" style="display: inline-block; padding: 14px 28px; background: #4A5D4C; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Manage Access in Admin
              </a>
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 32px;">
              You can grant document access from the Admin dashboard or send an invitation email.
            </p>
          </div>
        `,
      })

      console.log(`Email sent to admin(s) for new user: ${primaryEmail}`, result)
      
      if (result.error) {
        console.error('Resend API error:', result.error)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      // Don't fail the webhook if email fails
    }
  }

  console.log(`Webhook processed: ${eventType}`)

  return NextResponse.json({ success: true })
}
