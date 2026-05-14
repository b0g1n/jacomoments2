import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const { blobs } = await list({ prefix: path, limit: 1 })

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const blob = blobs[0]
    const response = await fetch(blob.url)

    if (!response.body) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const headers = new Headers(response.headers)
    headers.set('Content-Type', blob.contentType || 'image/jpeg')

    return new Response(response.body, { headers })

  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
