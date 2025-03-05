import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // Explicitly type params with `id`
) {
  try {
    const { id } = params; // Extract id from params

    const { image_url, localUpdatedAt } = await req.json();
    const updatedAtUTC = localUpdatedAt ? new Date(localUpdatedAt) : new Date();

    if (!image_url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    await db
      .update(categories)
      .set({ image_url, updated_at: updatedAtUTC })
      .where(eq(categories.id, id))
      .execute();

    return NextResponse.json(
      { message: 'Image updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
