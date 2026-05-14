import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })

    // Parse features from JSON strings
    const result = packages.map((p) => {
      try {
        return {
          ...p,
          features: JSON.parse(p.features || '[]'),
        }
      } catch {
        return { ...p, features: [] }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json([])
  }
}

// POST create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, category, categoryTitle, price, duration, features, isPopular, order } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    // Handle features - convert array to JSON string
    let featuresString = '[]'
    if (Array.isArray(features)) {
      featuresString = JSON.stringify(features.filter((f: string) => f && f.trim()))
    } else if (typeof features === 'string') {
      featuresString = features
    }

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

    // Return parsed features
    const result = {
      ...pkg,
      features: JSON.parse(pkg.features),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({
      error: 'Failed to create package',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT update package
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if this is a bulk update
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
              features: typeof pkg.features === 'string' ? pkg.features : JSON.stringify(pkg.features),
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
        features: JSON.parse(p.features || '[]'),
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
    if (features !== undefined) {
      updateData.features = typeof features === 'string' ? features : JSON.stringify(features)
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...pkg,
      features: JSON.parse(pkg.features || '[]'),
    })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}
