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

    // Upload to Vercel Blob with PRIVATE access
    const blob = await put(filename, uploadBuffer, {
      access: 'private', // CORRECT: Must be private for this store
      contentType: 'image/jpeg',
    })

    // The URL for the database will now point to our new proxy route
    const proxyUrl = `/api/images/${blob.pathname}`

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        filename: blob.pathname,
        url: proxyUrl, // Use the proxy URL
        thumbnail: proxyUrl, // Use the proxy URL for thumbnail as well
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
        url: proxyUrl,
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
