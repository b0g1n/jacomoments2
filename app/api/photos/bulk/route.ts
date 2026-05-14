import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST bulk upload photos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { photos } = body

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: 'Invalid photos data' }, { status: 400 })
    }

    const createdPhotos = []

    for (const photoData of photos) {
      const { filename, url, thumbnail, title, description, category, tags } = photoData

      const photo = await prisma.photo.create({
        data: {
          filename,
          url,
          thumbnail,
          title,
          description,
          category: category || 'nunta',
          tags: {
            connectOrCreate: tags?.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })) || [],
          },
        },
        include: { tags: true },
      })

      createdPhotos.push(photo)
    }

    return NextResponse.json({
      success: true,
      count: createdPhotos.length,
      photos: createdPhotos,
    })
  } catch (error) {
    console.error('Error bulk uploading photos:', error)
    return NextResponse.json({ error: 'Failed to bulk upload photos' }, { status: 500 })
  }
}
