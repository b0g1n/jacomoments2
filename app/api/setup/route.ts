import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// One-time setup endpoint - Now temporarily running on GET for easy setup
// Visit /api/setup after deployment to set up everything
export async function GET() {
  const prisma = new PrismaClient()

  try {
    // Create default admin user if not exists
    const adminCount = await prisma.admin.count()
    let adminCreated = false
    if (adminCount === 0) {
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: 'admin123', // In production, this should be hashed!
        },
      })
      adminCreated = true
    }

    // Check if categories exist, if not create defaults
    const categoryCount = await prisma.category.count()
    let categoriesInitialized = false
    if (categoryCount === 0) {
      await prisma.category.createMany({
        data: [
          { id: 'cat-1', name: 'sedinteFoto', order: 0 },
          { id: 'cat-2', name: 'botezuri', order: 1 },
          { id: 'cat-3', name: 'nunti', order: 2 },
          { id: 'cat-4', name: 'evenimente', order: 3 },
          { id: 'cat-5', name: 'eveniment', order: 4 },
        ],
      })
      categoriesInitialized = true
    }

    // Check if packages exist, if not create defaults
    const packageCount = await prisma.package.count()
    let packagesInitialized = false
    if (packageCount === 0) {
      await prisma.package.createMany({
        data: [
          // ȘEDINȚE FOTO
          {
            id: 'sedinteFoto-0',
            category: 'sedinteFoto',
            categoryTitle: 'ȘEDINȚE FOTO',
            name: 'MINI SESSION',
            price: 50,
            duration: '30–45 minute',
            features: JSON.stringify(['10–15 fotografii editate', 'Livrare online', 'Portrete / cuplu / familie']),
            isPopular: false,
            order: 0,
          },
          {
            id: 'sedinteFoto-1',
            category: 'sedinteFoto',
            categoryTitle: 'ȘEDINȚE FOTO',
            name: 'PREMIUM SESSION',
            price: 100,
            duration: '1–2 ore',
            features: JSON.stringify(['25–40 fotografii editate profesional', 'Locație la alegere', 'Livrare online + selecție extinsă']),
            isPopular: true,
            order: 1,
          },
          // BOTEZURI
          {
            id: 'botezuri-0',
            category: 'botezuri',
            categoryTitle: 'BOTEZURI',
            name: 'BASIC BAPTISM',
            price: 250,
            duration: 'Ceremonie',
            features: JSON.stringify(['Fotografiere ceremonie biserică', 'Fotografii cu familia și invitații', '100+ fotografii editate', 'Livrare online prin link privat']),
            isPopular: false,
            order: 0,
          },
          {
            id: 'botezuri-1',
            category: 'botezuri',
            categoryTitle: 'BOTEZURI',
            name: 'PREMIUM BAPTISM',
            price: 350,
            duration: 'Acoperire completă',
            features: JSON.stringify(['Pregătiri, biserică, restaurant', '200+ fotografii editate', 'Cadre artistice & detalii', 'Preview rapid pentru social media']),
            isPopular: true,
            order: 1,
          },
          // NUNȚI
          {
            id: 'nunti-0',
            category: 'nunti',
            categoryTitle: 'NUNȚI',
            name: 'WEDDING DAY',
            price: 500,
            duration: 'Acoperire eveniment',
            features: JSON.stringify(['Pregătiri + ceremonie + petrecere', '300+ fotografii editate profesional', 'Livrare online HD', 'Momente spontane și cadre artistice']),
            isPopular: false,
            order: 0,
          },
          {
            id: 'nunti-1',
            category: 'nunti',
            categoryTitle: 'NUNȚI',
            name: 'PREMIUM WEDDING',
            price: 700,
            duration: 'Acoperire extinsă',
            features: JSON.stringify(['Ședință foto mire & mireasă', '500+ fotografii editate', 'Preview rapid în 24–48h', 'Galerie online premium']),
            isPopular: true,
            order: 1,
          },
          // EVENIMENTE
          {
            id: 'evenimente-0',
            category: 'evenimente',
            categoryTitle: 'EVENIMENTE PRIVATE',
            name: 'EVENT BASIC',
            price: 100,
            duration: '1–2 ore',
            features: JSON.stringify(['Majorate / aniversări / petreceri private', '50+ fotografii editate']),
            isPopular: false,
            order: 0,
          },
          {
            id: 'evenimente-1',
            category: 'evenimente',
            categoryTitle: 'EVENIMENTE PRIVATE',
            name: 'EVENT PREMIUM',
            price: 200,
            duration: 'Acoperire extinsă',
            features: JSON.stringify(['Cadre atmosferice & invitați', '100+ fotografii editate', 'Livrare online']),
            isPopular: true,
            order: 1,
          },
        ],
      })
      packagesInitialized = true
    }

    // Check if pricing content exists, if not create defaults
    const pricingContentCount = await prisma.pricingContent.count()
    let pricingContentInitialized = false
    if (pricingContentCount === 0) {
      await prisma.pricingContent.createMany({
        data: [
          { id: 'pc-1', key: 'title', value: 'Investiție' },
          { id: 'pc-2', key: 'subtitle', value: 'Pachete și Prețuri' },
          { id: 'pc-3', key: 'description', value: 'Alege pachetul perfect pentru evenimentul tău.' },
          { id: 'pc-4', key: 'select', value: 'SELECTEAZĂ' },
          { id: 'pc-5', key: 'additionalInfo', value: 'Toate prețurile sunt în EUR.' },
          { id: 'pc-6', key: 'requestCustom', value: 'CERE OFERTĂ PERSONALIZATĂ' },
        ],
      })
      pricingContentInitialized = true
    }

    return NextResponse.json({
      message: 'Database setup complete!',
      details: {
        adminCreated,
        categoriesInitialized,
        packagesInitialized,
        pricingContentInitialized,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Setup failed',
        details: error.message,
        hint: 'Make sure DATABASE_URL is set correctly in Vercel environment variables',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
