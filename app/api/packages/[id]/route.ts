import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, category, categoryTitle, price, duration, features, isPopular, order } = await req.json()

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (categoryTitle !== undefined) updateData.categoryTitle = categoryTitle
    if (price !== undefined) updateData.price = Number(price)
    if (duration !== undefined) updateData.duration = duration
    if (features !== undefined) updateData.features = JSON.stringify(features)
    if (isPopular !== undefined) updateData.isPopular = isPopular
    if (order !== undefined) updateData.order = Number(order)

    const updated = await prisma.package.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ ...updated, features: JSON.parse(updated.features) })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.package.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
