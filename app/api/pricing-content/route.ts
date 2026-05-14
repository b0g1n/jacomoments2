import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch all pricing content
export async function GET() {
  try {
    const content = await prisma.pricingContent.findMany()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching pricing content:', error)
    return NextResponse.json([])
  }
}

// POST - Create new pricing content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const content = await prisma.pricingContent.create({
      data: { key, value },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error creating pricing content:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing content' },
      { status: 500 }
    )
  }
}

// PUT - Update pricing content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, value } = body

    if (!id || value === undefined) {
      return NextResponse.json(
        { error: 'ID and value are required' },
        { status: 400 }
      )
    }

    const content = await prisma.pricingContent.update({
      where: { id },
      data: { value },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating pricing content:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing content' },
      { status: 500 }
    )
  }
}
