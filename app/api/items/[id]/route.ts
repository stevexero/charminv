import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Destructure here
) {
  try {
    const { id } = await params;
    const { in_day, out_day } = await req.json();

    // Validate request
    if (in_day === undefined && out_day === undefined) {
      return NextResponse.json(
        { error: 'Missing in_day or out_day' },
        { status: 400 }
      );
    }

    // Fetch current weekly counts
    const existingItem = await db
      .select({
        in_week: items.in_week,
        out_week: items.out_week,
      })
      .from(items)
      .where(eq(items.id, id))
      .execute();

    if (!existingItem.length) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const { in_week, out_week } = existingItem[0];

    // Update daily and weekly counts
    await db
      .update(items)
      .set({
        ...(in_day !== undefined && {
          in_day,
          in_week: in_week + in_day,
        }),
        ...(out_day !== undefined && {
          out_day,
          out_week: out_week + out_day,
        }),
      })
      .where(eq(items.id, id))
      .execute();

    return NextResponse.json(
      { message: 'Item updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
