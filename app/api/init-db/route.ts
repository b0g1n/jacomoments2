import { NextResponse } from 'next/server'

// Visit this URL in browser to create database tables: https://jacomoments.vercel.app/api/init-db
export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Create tables using raw SQL
    const tables = [
      `CREATE TABLE IF NOT EXISTS "Admin" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL
      )`,

      `CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "order" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "read" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "Package" (
        "id" TEXT PRIMARY KEY,
        "category" TEXT NOT NULL,
        "categoryTitle" TEXT,
        "name" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "duration" TEXT,
        "features" TEXT NOT NULL,
        "isPopular" BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "Photo" (
        "id" TEXT PRIMARY KEY,
        "filename" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "thumbnail" TEXT,
        "title" TEXT,
        "description" TEXT,
        "category" TEXT DEFAULT 'nunta',
        "order" INTEGER DEFAULT 0,
        "featured" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "PricingContent" (
        "id" TEXT PRIMARY KEY,
        "key" TEXT UNIQUE NOT NULL,
        "value" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "Tag" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      `CREATE TABLE IF NOT EXISTS "_PhotoToTag" (
        "A" TEXT NOT NULL,
        "B" TEXT NOT NULL,
        PRIMARY KEY ("A", "B")
      )`,

      `CREATE UNIQUE INDEX IF NOT EXISTS "Admin_username_key" ON "Admin"("username")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "PricingContent_key_key" ON "PricingContent"("key")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag"("name")`,
    ]

    const results = []
    for (const sql of tables) {
      try {
        await prisma.$executeRawUnsafe(sql)
        results.push({ sql: sql.substring(0, 50) + '...', status: 'OK' })
      } catch (err: any) {
        results.push({ sql: sql.substring(0, 50) + '...', status: 'FAILED', error: err.message })
      }
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database initialization complete!',
      results,
      nextStep: 'Now visit /api/setup to add default data',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Database init failed', details: error.message },
      { status: 500 }
    )
  }
}
