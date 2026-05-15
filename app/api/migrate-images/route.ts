import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}


export async function GET() {
  try {
    const photos = await prisma.photo.findMany();
    let migratedCount = 0;

    for (const photo of photos) {
      if (photo.url.includes('.public.')) {
        continue;
      }
      
      console.log(`Migrating photo: ${photo.filename}`);

      const response = await fetch(photo.url);
      if (!response.ok || !response.body) {
        console.error(`Failed to fetch original image for ${photo.filename} from ${photo.url}`);
        continue;
      }

      const buffer = await streamToBuffer(response.body);
      
      const newBlob = await put(photo.filename, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });

      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          url: newBlob.url,
          thumbnail: newBlob.url,
        },
      });

      migratedCount++;
      console.log(`Migrated ${photo.filename} to ${newBlob.url}`);
    }

    return NextResponse.json({ success: true, message: `Image migration completed. Migrated ${migratedCount} images.` });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
