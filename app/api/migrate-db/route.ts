import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const photos = await prisma.photo.findMany();
    let migratedCount = 0;

    for (const photo of photos) {
      // Check if the URL is already in the new proxy format
      if (photo.url.startsWith('/api/images/')) {
        continue;
      }

      console.log(`Updating URL for photo: ${photo.filename}`);

      // The new URL points to our proxy
      const newUrl = `/api/images/${photo.filename}`;

      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          url: newUrl,
          thumbnail: newUrl, // Also update the thumbnail
        },
      });

      migratedCount++;
      console.log(`Updated URL for ${photo.filename} to ${newUrl}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database URL migration completed. Updated ${migratedCount} photo records.` 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
