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
        monday_in: items.monday_in,
        monday_out: items.monday_out,
        tuesday_in: items.tuesday_in,
        tuesday_out: items.tuesday_out,
        wednesday_in: items.wednesday_in,
        wednesday_out: items.wednesday_out,
        thursday_in: items.thursday_in,
        thursday_out: items.thursday_out,
        friday_in: items.friday_in,
        friday_out: items.friday_out,
        saturday_in: items.saturday_in,
        saturday_out: items.saturday_out,
        sunday_in: items.sunday_in,
        sunday_out: items.sunday_out,
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
    const body = await req.json();
    const {
      in_day,
      out_day,
      monday_in,
      monday_out,
      tuesday_in,
      tuesday_out,
      wednesday_in,
      wednesday_out,
      thursday_in,
      thursday_out,
      friday_in,
      friday_out,
      saturday_in,
      saturday_out,
      sunday_in,
      sunday_out,
    } = body;

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

    // Create update object with only the fields that are being changed
    const updateData: {
      in_day?: number;
      out_day?: number;
      in_week: number;
      out_week: number;
      week_end: number;
      week_total_out: number;
      updated_at: Date;
      monday_in?: number;
      monday_out?: number;
      tuesday_in?: number;
      tuesday_out?: number;
      wednesday_in?: number;
      wednesday_out?: number;
      thursday_in?: number;
      thursday_out?: number;
      friday_in?: number;
      friday_out?: number;
      saturday_in?: number;
      saturday_out?: number;
      sunday_in?: number;
      sunday_out?: number;
    } = {
      in_day,
      out_day,
      in_week: newInWeek,
      out_week: newOutWeek,
      week_end: newWeekEnd,
      week_total_out: newWeekTotalOut,
      updated_at: new Date(),
    };

    // Add the specific day's update if it exists in the request
    if (monday_in !== undefined) updateData.monday_in = monday_in;
    if (monday_out !== undefined) updateData.monday_out = monday_out;
    if (tuesday_in !== undefined) updateData.tuesday_in = tuesday_in;
    if (tuesday_out !== undefined) updateData.tuesday_out = tuesday_out;
    if (wednesday_in !== undefined) updateData.wednesday_in = wednesday_in;
    if (wednesday_out !== undefined) updateData.wednesday_out = wednesday_out;
    if (thursday_in !== undefined) updateData.thursday_in = thursday_in;
    if (thursday_out !== undefined) updateData.thursday_out = thursday_out;
    if (friday_in !== undefined) updateData.friday_in = friday_in;
    if (friday_out !== undefined) updateData.friday_out = friday_out;
    if (saturday_in !== undefined) updateData.saturday_in = saturday_in;
    if (saturday_out !== undefined) updateData.saturday_out = saturday_out;
    if (sunday_in !== undefined) updateData.sunday_in = sunday_in;
    if (sunday_out !== undefined) updateData.sunday_out = sunday_out;

    const x = await db
      .update(items)
      .set(updateData)
      .where(eq(items.id, id))
      .execute();

    console.log('X:', x);

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
