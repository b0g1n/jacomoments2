import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import sharp from 'sharp'

export const runtime = 'nodejs'

// POST - Upload a new photo
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const category = formData.get('category') as string

  if (!file || !category) {
    return NextResponse.json({ error: 'File and category are required' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const filename = `photos/${category}/${timestamp}-${random}.jpg`

    // Optimize image with Sharp
    let uploadBuffer = buffer
    try {
      const metadata = await sharp(buffer).metadata()
      const width = metadata.width || 0
      const height = metadata.height || 0

      const maxDimension = 1920
      let pipeline = sharp(buffer)

      if (width > maxDimension || height > maxDimension) {
        pipeline = pipeline.resize(maxDimension, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
      }

      uploadBuffer = Buffer.from(await pipeline.jpeg({ quality: 85 }).toBuffer())
    } catch (sharpError) {
      console.warn('Sharp optimization failed, using original:', sharpError)
    }

    // Upload to Vercel Blob
    const blob = await put(filename, uploadBuffer, {
      access: 'public', // <--- FIX: Changed from 'private' to 'public'
      contentType: 'image/jpeg',
    })

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        filename: blob.pathname, // Use pathname for consistency
        url: blob.url, // Public URL
        thumbnail: blob.url, // Public URL
        category,
        title: file.name.replace(/\.[^/.]+$/, ''),
        featured: false,
      },
    })

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        filename: photo.filename,
        url: blob.url,
        category: photo.category,
        title: photo.title,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload photo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
