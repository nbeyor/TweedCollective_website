import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

interface MagicLink {
  documentId: string
  createdAt: string
  usedAt?: string
  usedBy?: string
  expiresAt?: string
}

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

    // Get magic links from admin user's public metadata
    const magicLinks = (user.publicMetadata?.magicLinks as Record<string, MagicLink>) || {}
    
    // Convert to array format with token
    const linksArray = Object.entries(magicLinks).map(([token, link]) => ({
      token,
      ...link,
      status: link.usedAt ? 'used' : (link.expiresAt && new Date(link.expiresAt) < new Date()) ? 'expired' : 'active'
    }))

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

    const { documentId, expiresInDays } = await request.json()

    if (!documentId || typeof documentId !== 'string') {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Generate secure random token (32 characters, URL-safe)
    const token = randomBytes(24).toString('base64url')

    // Calculate expiration date (default 30 days)
    const expiresIn = expiresInDays || 30
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresIn)

    const client = await clerkClient()
    
    // Get current metadata
    const currentMetadata = user.publicMetadata || {}
    const magicLinks = (currentMetadata.magicLinks as Record<string, MagicLink>) || {}
    
    // Create new magic link
    magicLinks[token] = {
      documentId,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }
    
    // Update admin user metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        magicLinks
      }
    })
    
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tweedcollective.ai'}/magic-link/${token}`

    return NextResponse.json({ 
      success: true, 
      token,
      magicLinkUrl,
      expiresAt: expiresAt.toISOString()
    })
  } catch (error) {
    console.error('Error creating magic link:', error)
    return NextResponse.json({ error: 'Failed to create magic link' }, { status: 500 })
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

