import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const runtime = 'nodejs'

// CORRECTED SIGNATURE
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  try {
    // Await the params to resolve
    const { path } = await params;
    
    // Reconstruct the full path from the dynamic segments
    const fullPath = path.join('/')

    // Fetch the blob from Vercel's storage
    const { blobs } = await list({ prefix: fullPath, limit: 1 })

    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const blob = blobs[0]
    
    // Fetch the actual image content from its private URL
    const response = await fetch(blob.url)

    // Handle cases where the image content can't be fetched
    if (!response.ok) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
      })
    }

    if (!response.body) {
      return NextResponse.json({ error: 'Image body not found' }, { status: 404 })
    }

    // Create new headers for the response to the client
    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    // Stream the image content back to the client
    return new Response(response.body, { status: 200, headers })

  } catch (error) {
    console.error('Error proxying image:', error)
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    )
  }
}
