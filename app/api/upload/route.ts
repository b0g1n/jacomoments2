import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

// POST - Handle actual file uploads
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

    // Generate filename - always use .jpg extension since we convert to JPEG
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const filename = `${timestamp}-${random}.jpg`

    // Create category directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public', 'photos', category)
    await mkdir(publicDir, { recursive: true })

    // Try to use Sharp for optimization, fall back to saving as-is if it fails
    let finalBuffer = buffer

    try {
      // Dynamic import for Sharp (better for Vercel)
      const sharp = (await import('sharp')).default

      // Get image metadata
      const metadata = await sharp(buffer).metadata()
      const width = metadata.width || 0
      const height = metadata.height || 0

      // Calculate if we need to resize (max dimension 1920px)
      const maxDimension = 1920
      let image = sharp(buffer)

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          image = image.resize(maxDimension, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
        } else {
          image = image.resize(null, maxDimension, {
            withoutEnlargement: true,
            fit: 'inside'
          })
        }
      }

      // Convert to JPEG with 85% quality
      finalBuffer = Buffer.from(await image
        .jpeg({ quality: 85 })
        .toBuffer())

    } catch (sharpError) {
      // Sharp not available or failed - save original file
      console.warn('Sharp optimization failed, saving original:', sharpError)
      // Keep original buffer
    }

    // Save image
    const outputPath = join(publicDir, filename)
    await writeFile(outputPath, finalBuffer)

    // Generate URL path
    const url = `/photos/${category}/${filename}`

    // Create photo in database
    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        thumbnail: url,
        category,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension from title
        featured: false,
      },
    })

    return NextResponse.json({
      success: true,
      filename,
      url,
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
