import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { checkDocumentAccess } from '@/lib/document-access'

export async function GET() {
  // Verify the user has access to the dashboard document
  const { hasAccess } = await checkDocumentAccess('dashboard')

  if (!hasAccess) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const htmlPath = join(process.cwd(), 'content', 'documents', 'dashboard.html')

  try {
    const html = readFileSync(htmlPath, 'utf-8')
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch {
    return new NextResponse('Dashboard not built yet. Run: npm run refresh-dashboard', {
      status: 404,
    })
  }
}
