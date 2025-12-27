import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

const resend = new Resend(process.env.RESEND_API_KEY)

async function getAdminEmails(): Promise<string[]> {
  try {
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({ limit: 100 })
    
    const adminEmails = usersResponse.data
      .filter(user => 
        user.privateMetadata?.isAdmin === true || 
        user.publicMetadata?.role === 'admin'
      )
      .map(user => user.primaryEmailAddress?.emailAddress)
      .filter((email): email is string => !!email)
    
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
    const email = email_addresses?.[0]?.email_address || 'No email'
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'No name provided'

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
      
      console.log(`Attempting to send email for new user: ${email} to admin(s): ${adminEmails.join(', ')}`)
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
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
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

      console.log(`Email sent to admin(s) for new user: ${email}`, result)
      
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
