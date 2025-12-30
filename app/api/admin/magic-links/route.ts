import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'

interface MagicLink {
  documentId: string
  documentTitle?: string
  targetEmail: string
  createdAt: string
  expiresAt: string
  redeemedAt?: string
  redeemedBy?: string
}

// Document titles for email content
const DOCUMENT_TITLES: Record<string, string> = {
  'vibe-coding-in-enterprise-for-pe': 'VIBE Coding in Enterprise',
  'health-tech-market-2024': 'Health-Tech Market Landscape',
  'ai-integration-framework': 'AI Integration Framework',
  'salmon-ai-genomics': 'Strategic AI for Salmon Genomics',
}

export async function GET() {
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

    // Get magic links from admin user's public metadata
    const magicLinks = (user.publicMetadata?.magicLinks as Record<string, MagicLink>) || {}
    
    // Convert to array format with token and status
    const linksArray = Object.entries(magicLinks).map(([token, link]) => {
      let status: 'active' | 'expired' | 'redeemed' = 'active'
      if (link.redeemedAt) {
        status = 'redeemed'
      } else if (new Date(link.expiresAt) < new Date()) {
        status = 'expired'
      }
      
      return {
        token,
        ...link,
        status
      }
    })

    return NextResponse.json({ magicLinks: linksArray })
  } catch (error) {
    console.error('Error fetching magic links:', error)
    return NextResponse.json({ error: 'Failed to fetch magic links' }, { status: 500 })
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

    const { documentId, emails, expiresInDays } = await request.json()

    if (!documentId || typeof documentId !== 'string') {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'emails array is required' }, { status: 400 })
    }

    // Validate and normalize emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = emails
      .map((email: string) => email.trim().toLowerCase())
      .filter((email: string) => email && emailRegex.test(email))

    if (validEmails.length === 0) {
      return NextResponse.json({ error: 'No valid email addresses provided' }, { status: 400 })
    }

    // Calculate expiration date (default 7 days)
    const expiresIn = expiresInDays || 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresIn)

    const client = await clerkClient()
    
    // Get current metadata
    const currentMetadata = user.publicMetadata || {}
    const magicLinks = (currentMetadata.magicLinks as Record<string, MagicLink>) || {}
    
    const documentTitle = DOCUMENT_TITLES[documentId] || documentId
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tweedcollective.ai'
    
    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    const resend = new Resend(resendApiKey)

    const results: { email: string; success: boolean; error?: string; token?: string }[] = []

    // Generate a unique token for each email and send invitation
    for (const email of validEmails) {
      try {
        // Generate secure random token (32 characters, URL-safe)
        const token = randomBytes(24).toString('base64url')
        const magicLinkUrl = `${baseUrl}/magic-link/${token}`

        // Store magic link with target email
        magicLinks[token] = {
          documentId,
          documentTitle,
          targetEmail: email,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString()
        }

        // Send invitation email
        await resend.emails.send({
          from: 'Tweed Collective <noreply@tweedcollective.ai>',
          to: email,
          subject: `You're invited to view: ${documentTitle}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Tweed Collective</h1>
              </div>
              
              <div style="background: #f9f8f6; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px;">You're invited to view a document</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  You've been granted access to <strong>${documentTitle}</strong>.
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                  Click the button below to access the document. You'll need to sign in or create an account using this email address (${email}).
                </p>
                <div style="text-align: center;">
                  <a href="${magicLinkUrl}" style="display: inline-block; background: #4A5D4C; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    View Document
                  </a>
                </div>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center;">
                This invitation expires on ${expiresAt.toLocaleDateString()}. 
                If you didn't expect this email, you can safely ignore it.
              </p>
              
              <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 24px; text-align: center;">
                <p style="color: #999; font-size: 12px;">
                  Tweed Collective — Operators and builders at the AI × life sciences frontier.
                </p>
              </div>
            </div>
          `
        })

        results.push({ email, success: true, token })
      } catch (emailError: unknown) {
        console.error(`Failed to send invitation to ${email}:`, emailError)
        results.push({ 
          email, 
          success: false, 
          error: emailError instanceof Error ? emailError.message : 'Failed to send email'
        })
      }
    }

    // Update admin user metadata with all new magic links
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        magicLinks
      }
    })

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({ 
      success: true,
      message: `Sent ${successCount} invitation(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
      results,
      expiresAt: expiresAt.toISOString()
    })
  } catch (error) {
    console.error('Error creating magic links:', error)
    return NextResponse.json({ error: 'Failed to create magic links' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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

    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }

    const client = await clerkClient()
    
    // Get current metadata
    const currentMetadata = user.publicMetadata || {}
    const magicLinks = (currentMetadata.magicLinks as Record<string, MagicLink>) || {}
    
    // Check if token exists
    if (!magicLinks[token]) {
      return NextResponse.json({ error: 'Magic link not found' }, { status: 404 })
    }
    
    // Remove token
    delete magicLinks[token]
    
    // Update admin user metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        magicLinks
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting magic link:', error)
    return NextResponse.json({ error: 'Failed to delete magic link' }, { status: 500 })
  }
}
