import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const { name, image_url } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const formattedCategoryName = name.toLowerCase();

    const newCategory = await db
      .insert(categories)
      .values({
        name: formattedCategoryName,
        image_url:
          image_url ||
          'https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png',
        created_at: new Date(),
      })
      .returning();

    return NextResponse.json(
      { message: 'Category added!', category: newCategory[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
