import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await db
      .select({
        in_day: items.in_day,
        out_day: items.out_day,
        in_week: items.in_week,
        out_week: items.out_week,
        week_start: items.week_start,
        week_end: items.week_end,
        week_total_out: items.week_total_out,
      })
      .from(items)
      .where(eq(items.id, id))
      .execute();

    if (!item.length) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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
        week_start: items.week_start,
        week_end: items.week_end,
        week_total_out: items.week_total_out,
      })
      .from(items)
      .where(eq(items.id, id))
      .execute();

    if (!existingItem.length) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const {
      in_day: currentInDay = 0,
      out_day: currentOutDay = 0,
      in_week = 0,
      out_week = 0,
      week_start = 0,
      week_total_out = 0,
    } = existingItem[0];

    const newInDay = typeof in_day === 'number' ? in_day : currentInDay;
    const newOutDay = typeof out_day === 'number' ? out_day : currentOutDay;

    const inDifference = newInDay - currentInDay;
    const outDifference = newOutDay - currentOutDay;

    const newInWeek = in_week + Math.max(inDifference, 0);
    const newOutWeek = out_week + Math.max(outDifference, 0);

    const newWeekEnd = week_start + newInWeek - newOutWeek;
    const newWeekTotalOut = week_total_out + Math.max(outDifference, 0);

    await db
      .update(items)
      .set({
        in_day,
        out_day,
        in_week: newInWeek,
        out_week: newOutWeek,
        week_end: newWeekEnd,
        week_total_out: newWeekTotalOut,
        updated_at: new Date(),
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
