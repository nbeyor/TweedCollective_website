import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Document access control
 * 
 * This file manages which users have access to which documents.
 * Access is stored in Clerk user metadata as a private array of document IDs.
 * 
 * To grant access to a user:
 * 1. Go to Clerk Dashboard > Users > Select User > Metadata
 * 2. Add to private metadata: { "documentAccess": ["document-id-1", "document-id-2"] }
 * 
 * Document IDs match the document href paths (e.g., "vibe-coding-pe-life-sciences")
 */

export interface DocumentAccess {
  hasAccess: boolean
  userId?: string
}

/**
 * Check if the current user has access to a specific document
 */
export async function checkDocumentAccess(documentId: string): Promise<DocumentAccess> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { hasAccess: false }
    }

    const user = await currentUser()
    
    if (!user) {
      return { hasAccess: false }
    }

    // Get document access from user's private metadata
    const documentAccess = user.privateMetadata?.documentAccess as string[] | undefined
    
    if (!documentAccess || !Array.isArray(documentAccess)) {
      return { hasAccess: false, userId }
    }

    const hasAccess = documentAccess.includes(documentId)
    
    return { hasAccess, userId }
  } catch (error) {
    console.error('Error checking document access:', error)
    return { hasAccess: false }
  }
}

/**
 * Get all document IDs that the current user has access to
 */
export async function getUserDocumentAccess(): Promise<string[]> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return []
    }

    const user = await currentUser()
    
    if (!user) {
      return []
    }

    const documentAccess = user.privateMetadata?.documentAccess as string[] | undefined
    
    return Array.isArray(documentAccess) ? documentAccess : []
  } catch (error) {
    console.error('Error getting user document access:', error)
    return []
  }
}
