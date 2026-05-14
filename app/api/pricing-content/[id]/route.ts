import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { value } = await req.json()

    const updated = await prisma.pricingContent.update({
      where: { id },
      data: { value },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating pricing content:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
