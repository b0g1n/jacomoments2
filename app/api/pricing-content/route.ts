import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all pricing content
export async function GET() {
  try {
    const content = await prisma.pricingContent.findMany()
    return NextResponse.json(content)
  } catch {
    return NextResponse.json([])
  }
}
