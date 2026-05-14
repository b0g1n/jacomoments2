import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Select 6 good photos from user's collection and mark as featured
  const featuredIds = [
    '91dd0eaf-b195-4b4a-bdfb-93fbf1da654a', // 1.jpg (nunta)
    'b36110ca-928d-431e-b565-27f7373e9635', // A&V (11).JPG (nunta)
    'cffd68bd-9237-4e61-b747-7e1fc0453547', // Alina & Daniel-1097.JPG (nunta)
    'ed013db7-a328-442e-9b6d-2ba7bb193e7c', // Botez Stefan-110.jpg (botez)
    'f90a0ebd-42ff-4310-a114-afa7c1bd90d2', // Ilaria-234.jpg (botez)
    '21e22861-767a-4437-a379-c5a2f038082a', // Teodora 18th-128.jpg (majorat)
  ]

  for (const id of featuredIds) {
    try {
      await prisma.photo.update({
        where: { id },
        data: { featured: true }
      })
      console.log('Marked as featured:', id)
    } catch (e) {
      console.error('Failed to update:', id, e)
    }
  }

  console.log('Done! 6 photos marked as featured.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
