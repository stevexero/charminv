import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subcategories } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const { name, category_id } = await req.json();

    if (!name || !category_id) {
      return NextResponse.json(
        { error: 'Subcategory name and category ID are required' },
        { status: 400 }
      );
    }

    await db.insert(subcategories).values({
      name: name.toLowerCase(),
      category_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(
      { message: 'Subcategory added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
