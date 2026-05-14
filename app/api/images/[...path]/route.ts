import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Correct the signature to use the standard Request object
export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const { blobs } = await list({ prefix: path, limit: 1 })

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const blob = blobs[0]
    const response = await fetch(blob.url)

    // Pass through the status from the blob storage fetch
    if (!response.ok) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
      })
    }
    
    if (!response.body) {
      return NextResponse.json({ error: 'Image body not found' }, { status: 404 })
    }

    // Pass through headers and add cache control
    const headers = new Headers(response.headers)
    headers.set('Content-Type', blob.contentType || 'image/jpeg')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(response.body, { status: 200, headers })

  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
