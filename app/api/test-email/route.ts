import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

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
  // Check if user is admin
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const isAdmin = user?.privateMetadata?.isAdmin === true || user?.publicMetadata?.role === 'admin'

  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ 
      error: 'RESEND_API_KEY is not configured',
      message: 'Please add RESEND_API_KEY to your Vercel environment variables'
    }, { status: 500 })
  }

  // Get admin emails from Clerk
  const adminEmails = await getAdminEmails()
  
  if (adminEmails.length === 0) {
    return NextResponse.json({ 
      success: false,
      error: 'No admin emails found',
      details: 'Please ensure at least one user has admin privileges in Clerk'
    }, { status: 500 })
  }

  try {
    console.log(`Sending test email to admin(s): ${adminEmails.join(', ')}`)
    console.log(`Resend API key configured: ${!!process.env.RESEND_API_KEY}`)
    console.log(`Resend API key prefix: ${process.env.RESEND_API_KEY?.substring(0, 5)}...`)
    
    const resend = getResend()
    if (!resend) {
      return NextResponse.json({ 
        success: false,
        error: 'Resend not configured',
        details: 'RESEND_API_KEY environment variable is not set'
      }, { status: 500 })
    }
    
    // Send test email notification to all admins
    const result = await resend.emails.send({
      from: 'Tweed Collective <onboarding@resend.dev>',
      to: adminEmails,
      subject: 'Test Email: New User Signup Notification',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">🧪 Test Email - New User Signup</h2>
          <p>This is a test email to verify the webhook email notification system is working correctly.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Test User</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">test@example.com</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">User ID</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">test_user_123</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://tweedcollective.ai/admin" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
              Manage Access in Admin
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            ✅ If you received this email, the webhook email notification system is working correctly!
          </p>
        </div>
      `,
    })

    console.log('Resend API response:', JSON.stringify(result, null, 2))

    // Check if Resend returned an error
    if (result.error) {
      console.error('Resend API error:', result.error)
      return NextResponse.json({ 
        success: false,
        error: 'Resend API returned an error',
        details: result.error.message || JSON.stringify(result.error)
      }, { status: 500 })
    }

    // Check if data exists
    if (!result.data) {
      console.error('Resend API returned no data:', result)
      return NextResponse.json({ 
        success: false,
        error: 'Resend API returned no data',
        details: 'The email may not have been sent. Check Resend dashboard for details.'
      }, { status: 500 })
    }

    console.log('Test email sent successfully. Email ID:', result.data.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully to Admin',
      emailId: result.data.id,
      adminEmails: adminEmails,
      note: 'If you don\'t see the email, check your spam folder or verify your Resend domain configuration. Check Resend dashboard for delivery status.'
    })
  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send email',
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}





