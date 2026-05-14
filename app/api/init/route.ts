import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Create default admin user
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: 'Admin123',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user initialized',
      admin: { username: admin.username },
    })
  } catch (error) {
    console.error('Error initializing admin:', error)
    return NextResponse.json(
      { error: 'Failed to initialize admin', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const adminCount = await prisma.admin.count()
    return NextResponse.json({
      initialized: adminCount > 0,
      count: adminCount,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }
}
