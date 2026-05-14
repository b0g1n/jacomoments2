import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST - Upload photo to Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'nunta'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Read file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

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
      access: 'public',
      contentType: 'image/jpeg',
    })

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        filename: `${timestamp}-${random}.jpg`,
        url: blob.url,
        thumbnail: blob.url,
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
        url: photo.url,
        category: photo.category,
        title: photo.title,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: 'Failed to upload photo',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}