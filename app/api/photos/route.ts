'''import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch all photos with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const photos = await prisma.photo.findMany({
      where,
      include: { tags: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    // If no photos, return empty array
    if (photos.length === 0) {
      return NextResponse.json([])
    }

    const photosWithUrls = photos.map(photo => {
      // Construct the public URL directly
      const publicUrl = `${process.env.BLOB_URL}/${photo.filename}`;
      return {
        ...photo,
        url: publicUrl,
      };
    });

    return NextResponse.json(photosWithUrls)

  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

// POST - Create new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, url, title, description, category, tags, featured, order } = body

    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        title,
        description,
        category: category || 'nunta',
        featured: featured || false,
        order: order || 0,
        tags: {
          connectOrCreate: tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Error creating photo:', error)
    return NextResponse.json(
      { error: 'Failed to create photo', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

// DELETE - Delete multiple photos
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    await prisma.photo.deleteMany({
      where: { id: { in: ids } },
    })

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error('Error deleting photos:', error)
    return NextResponse.json(
      { error: 'Failed to delete photos' },
      { status: 500 }
    )
  }
}
''