import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(
      packages.map((p) => ({ ...p, features: JSON.parse(p.features) }))
    )
  } catch {
    return NextResponse.json([])
  }
}

// POST create new package
export async function POST(request: NextRequest) {
  try {
    const { id, name, category, categoryTitle, price, duration, features, isPopular, order } = await request.json()

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 })
    }

    const pkg = await prisma.package.create({
      data: {
        id: id || `pkg-${Date.now()}`,
        name,
        category,
        categoryTitle: categoryTitle || category,
        price: Number(price) || 0,
        duration: duration || '',
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        isPopular: Boolean(isPopular),
        order: Number(order) || 0,
      },
    })

    return NextResponse.json({ ...pkg, features: JSON.parse(pkg.features) })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}

// PUT update package (bulk update support)
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

      return NextResponse.json(
        packages.map((p) => ({ ...p, features: JSON.parse(p.features) }))
      )
    }

    // Single package update
    const { id, name, category, categoryTitle, price, duration, features, isPopular, order } = body

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name,
        category,
        categoryTitle,
        price: price !== undefined ? Number(price) : undefined,
        duration,
        features: features !== undefined ? (typeof features === 'string' ? features : JSON.stringify(features)) : undefined,
        isPopular,
        order,
      },
    })

    return NextResponse.json({ ...pkg, features: JSON.parse(pkg.features) })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}
