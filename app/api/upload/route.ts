import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import sharp from 'sharp'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

// POST - Handle actual file uploads with image optimization
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
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${ext}`

    // Create category directory if it doesn't exist
    const publicDir = join(process.cwd(), 'public', 'photos', category)
    await mkdir(publicDir, { recursive: true })

    // Optimize image based on size
    let optimizedBuffer: Buffer = buffer

    // Get image metadata
    const metadata = await sharp(buffer).metadata()
    const width = metadata.width || 0
    const height = metadata.height || 0

    // Calculate if we need to resize (max dimension 1920px)
    const maxDimension = 1920
    if (width > maxDimension || height > maxDimension) {
      const image = sharp(buffer)
      if (width > height) {
        image.resize(maxDimension, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      } else {
        image.resize(null, maxDimension, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      }
      optimizedBuffer = Buffer.from(await image
        .jpeg({ quality: 85 }) // Compress to 85% quality
        .toBuffer())
    } else {
      // Just compress if under size limit
      optimizedBuffer = Buffer.from(await sharp(buffer)
        .jpeg({ quality: 85 })
        .toBuffer())
    }

    // Save optimized image
    const outputPath = join(publicDir, filename)
    await writeFile(outputPath, optimizedBuffer)

    // Generate URL path
    const url = `/photos/${category}/${filename}`

    // Create photo in database
    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        thumbnail: url,
        category,
        title: file.name,
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
