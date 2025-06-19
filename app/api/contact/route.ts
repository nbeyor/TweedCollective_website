import { NextRequest, NextResponse } from 'next/server'
import { submitContactForm } from '@/lib/airtable'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, message, service } = body

    // Basic validation
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await submitContactForm({
      name,
      email,
      company,
      message,
      service,
    })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 