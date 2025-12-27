import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Admin email to receive notifications
const ADMIN_EMAIL = 'nbeyor@gmail.com'

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

  try {
    console.log(`Sending test email to admin: ${ADMIN_EMAIL}`)
    console.log(`Resend API key configured: ${!!process.env.RESEND_API_KEY}`)
    
    // Send test email notification
    const result = await resend.emails.send({
      from: 'Tweed Collective <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
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
      message: 'Test email sent successfully',
      emailId: result.data.id,
      note: 'If you don\'t see the email, check your spam folder or verify your Resend domain configuration.'
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
