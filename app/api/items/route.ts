import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const { name, subcategory_id, week_start } = await req.json();

    if (!name || !subcategory_id) {
      return NextResponse.json(
        { error: 'Item name, subcategory_id are required' },
        { status: 400 }
      );
    }

    const initialWeekStart =
      typeof week_start === 'number' && week_start >= 0 ? week_start : 0; // Default to 0 if invalid

    await db.insert(items).values({
      name,
      subcategory_id,
      week_start: initialWeekStart,
      week_end: initialWeekStart,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(
      { message: 'Item added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
