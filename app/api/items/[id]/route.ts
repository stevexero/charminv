import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { in_day, out_day } = await req.json();

    if (in_day === undefined && out_day === undefined) {
      return NextResponse.json(
        { error: 'Missing in_day or out_day' },
        { status: 400 }
      );
    }

    const existingItem = await db
      .select({
        in_day: items.in_day,
        out_day: items.out_day,
        in_week: items.in_week,
        out_week: items.out_week,
      })
      .from(items)
      .where(eq(items.id, id))
      .execute();

    if (!existingItem.length) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const {
      in_day: currentInDay,
      out_day: currentOutDay,
      in_week,
      out_week,
    } = existingItem[0];

    const inDifference = in_day - currentInDay;
    const outDifference = out_day - currentOutDay;

    const newInWeek = in_week + Math.max(inDifference, 0);
    const newOutWeek = out_week + Math.max(outDifference, 0);

    await db
      .update(items)
      .set({
        in_day,
        out_day,
        in_week: newInWeek,
        out_week: newOutWeek,
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
