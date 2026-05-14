import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Helper functions
function parseFeatures(features: string | null): string[] {
  if (!features) return []
  try {
    return JSON.parse(features)
  } catch {
    return []
  }
}

function serializeFeatures(features: string[] | string): string {
  if (Array.isArray(features)) {
    return JSON.stringify(features.filter((f) => f?.trim()))
  }
  return features || '[]'
}

// GET - Fetch all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })

    // Parse features from JSON strings
    const result = packages.map((p) => ({
      ...p,
      features: parseFeatures(p.features),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json([])
  }
}

// POST - Create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, categoryTitle, price, duration, features, isPopular, order } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Convert features array to JSON string
    const featuresString = Array.isArray(features)
      ? JSON.stringify(features.filter((f: string) => f?.trim()))
      : '[]'

    const pkg = await prisma.package.create({
      data: {
        name,
        category,
        categoryTitle: categoryTitle || category,
        price: Number(price) || 0,
        duration: duration || '',
        features: featuresString,
        isPopular: Boolean(isPopular),
        order: Number(order) || 0,
      },
    })

    return NextResponse.json({
      ...pkg,
      features: parseFeatures(pkg.features),
    })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      {
        error: 'Failed to create package',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// PUT - Update package(s)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Bulk update
    if (Array.isArray(body.packages)) {
      await prisma.$transaction(
        body.packages.map((pkg: any) =>
          prisma.package.update({
            where: { id: pkg.id },
            data: {
              name: pkg.name,
              category: pkg.category,
              categoryTitle: pkg.categoryTitle,
              price: pkg.price,
              duration: pkg.duration,
              features: serializeFeatures(pkg.features),
              isPopular: pkg.isPopular,
              order: pkg.order,
            },
          })
        )
      )

      const packages = await prisma.package.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      })

      const result = packages.map((p) => ({
        ...p,
        features: parseFeatures(p.features),
      }))

      return NextResponse.json(result)
    }

    // Single package update
    const { id, name, category, categoryTitle, price, duration, features, isPopular, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (categoryTitle !== undefined) updateData.categoryTitle = categoryTitle
    if (price !== undefined) updateData.price = Number(price)
    if (duration !== undefined) updateData.duration = duration
    if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular)
    if (order !== undefined) updateData.order = Number(order)
    if (features !== undefined) updateData.features = serializeFeatures(features)

    const pkg = await prisma.package.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...pkg,
      features: parseFeatures(pkg.features),
    })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

// DELETE - Delete package
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    await prisma.package.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}