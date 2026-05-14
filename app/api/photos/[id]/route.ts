import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET single photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: { tags: true },
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Error fetching photo:', error)
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 })
  }
}

// PUT update photo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, category, tags, featured, order } = body

    // Disconnect all existing tags and connect new ones
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (featured !== undefined) updateData.featured = featured
    if (order !== undefined) updateData.order = order

    if (tags !== undefined) {
      updateData.tags = {
        set: [],
        connectOrCreate: tags.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      }
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

// DELETE photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.photo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
