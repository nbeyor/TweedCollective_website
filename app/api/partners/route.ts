import { NextResponse } from 'next/server'
import { getPartners } from '@/lib/airtable'

export async function GET() {
  try {
    const partners = await getPartners()
    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
} 