import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    // Find admin user in database
    const admin = await prisma.admin.findUnique({
      where: { username },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check password (in production, use bcrypt!)
    if (admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      username: admin.username,
    })
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
