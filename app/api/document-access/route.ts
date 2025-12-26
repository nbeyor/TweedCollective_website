import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const { documentId } = await request.json()
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Admins have access to all documents
    const isAdmin = user.privateMetadata?.isAdmin === true ||
                    user.publicMetadata?.role === 'admin'
    
    if (isAdmin) {
      return NextResponse.json({ hasAccess: true, userId })
    }

    // Get document access from user's private metadata
    const documentAccess = user.privateMetadata?.documentAccess as string[] | undefined
    
    if (!documentAccess || !Array.isArray(documentAccess)) {
      return NextResponse.json({ hasAccess: false, userId })
    }

    const hasAccess = documentAccess.includes(documentId)
    
    return NextResponse.json({ hasAccess, userId })
  } catch (error) {
    console.error('Error checking document access:', error)
    return NextResponse.json({ hasAccess: false }, { status: 500 })
  }
}
