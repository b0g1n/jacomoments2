import { NextRequest, NextResponse } from 'next/server'
import { prisma, DEMO_PHOTOS } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    let photos = await prisma.photo.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: { order: 'asc' },
    })

    // If database is empty (fresh deployment), show demo photos
    if (photos.length === 0) {
      let filtered = DEMO_PHOTOS
      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (featured === 'true') {
        filtered = filtered.filter(p => p.featured)
      }
      return NextResponse.json(filtered)
    }

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    // Return demo photos on database connection error
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let filtered = DEMO_PHOTOS
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured)
    }
    return NextResponse.json(filtered)
  }
}

// POST new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, url, thumbnail, title, description, category, tags, featured } = body

    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        thumbnail,
        title,
        description,
        category: category || 'nunta',
        featured: featured || false,
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
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 })
  }
}
