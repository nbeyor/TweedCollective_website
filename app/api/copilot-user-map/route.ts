import { NextResponse } from 'next/server'
import { checkDocumentAccess } from '@/lib/document-access'
import userIdMap from '@/data/copilot-user-id-map.json'

// The alias->UUID map for the eCS per-developer view. UUIDs are intentionally kept
// out of the public dashboard JSON; they are returned here only to a signed-in user
// who is authorized for the ecs-sdlc-dashboard document (mirrors /api/document-access).
// Auth forces this route to run dynamically per request.
export const dynamic = 'force-dynamic'

const DOCUMENT_ID = 'ecs-sdlc-dashboard'

export async function GET() {
  try {
    const { hasAccess, userId } = await checkDocumentAccess(DOCUMENT_ID)

    if (!hasAccess) {
      // 401 when not signed in, 403 when signed in but not authorized.
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: userId ? 403 : 401 },
      )
    }

    return NextResponse.json({ map: userIdMap as Record<string, string> })
  } catch (error) {
    console.error('Error resolving copilot user map:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
