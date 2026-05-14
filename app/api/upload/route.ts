import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Add photo by URL (for Vercel deployment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, title, description, category, featured } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract filename from URL
    const filename = url.split('/').pop() || 'photo.jpg'

    // Create photo in database
    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        thumbnail: url, // Using same URL as thumbnail
        title: title || filename,
        description: description || '',
        category: category || 'nunta',
        featured: featured || false,
      },
    })

    return NextResponse.json({
      success: true,
      photo,
    })
  } catch (error) {
    console.error('Error adding photo:', error)
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 })
  }
}

// GET - Get upload instructions
export async function GET() {
  return NextResponse.json({
    message: 'To add photos, upload them to an image hosting service (Imgur, Cloudinary, etc.) and use the POST endpoint with the URL.',
    usage: {
      method: 'POST',
      body: {
        url: 'string (required) - Image URL from hosting service',
        title: 'string (optional) - Photo title',
        description: 'string (optional) - Photo description',
        category: 'string (optional) - Category (nunta, botez, majorat)',
        featured: 'boolean (optional) - Show in featured section',
      },
      example: {
        url: 'https://i.imgur.com/abc123.jpg',
        title: 'Nuntă frumoasă',
        description: 'Moment special',
        category: 'nunta',
        featured: true,
      }
    },
    recommended_services: [
      'Imgur (https://imgur.com) - Free, no account needed for basic use',
      'Cloudinary (https://cloudinary.com) - Free tier available',
      'Postimages (https://postimages.org) - Simple, no registration',
    ]
  })
}
