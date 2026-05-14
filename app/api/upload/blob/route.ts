import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export const dynamic = 'force-dynamic'

// POST - Handle file uploads using Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'nunta'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Read file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const ext = '.jpg' // Always use .jpg
    const filename = `${category}/${timestamp}-${random}${ext}`

    // Try to optimize with Sharp first
    let finalBuffer = buffer
    let finalContentType = file.type

    try {
      const sharp = (await import('sharp')).default
      const metadata = await sharp(buffer).metadata()
      const width = metadata.width || 0
      const height = metadata.height || 0

      const maxDimension = 1920
      let image = sharp(buffer)

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          image = image.resize(maxDimension, null, { withoutEnlargement: true, fit: 'inside' })
        } else {
          image = image.resize(null, maxDimension, { withoutEnlargement: true, fit: 'inside' })
        }
      }

      finalBuffer = Buffer.from(await image.jpeg({ quality: 85 }).toBuffer())
      finalContentType = 'image/jpeg'
    } catch {
      // Sharp failed, use original
    }

    // Upload to Vercel Blob Storage
    const blob = await put(filename, finalBuffer, {
      access: 'public',
      contentType: finalContentType,
    })

    // Create photo in database
    const photo = await prisma.photo.create({
      data: {
        filename: filename.split('/')[1], // Just the filename without category
        url: blob.url,
        thumbnail: blob.url,
        category,
        title: file.name.replace(/\.[^/.]+$/, ''),
        featured: false,
      },
    })

    return NextResponse.json({
      success: true,
      filename: filename.split('/')[1],
      url: blob.url,
      category,
      id: photo.id,
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({
      error: 'Failed to upload photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
