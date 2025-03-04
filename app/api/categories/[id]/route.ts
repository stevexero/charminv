import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { image_url } = await req.json();
    if (!image_url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Update category image in the database
    await db
      .update(categories)
      .set({ image_url })
      .where(eq(categories.id, params.id))
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
