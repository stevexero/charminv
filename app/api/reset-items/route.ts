import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/schema';

// Runs at midnight to reset counts
export async function GET() {
  try {
    await db
      .update(items)
      .set({
        in_day: 0,
        out_day: 0,
      })
      .execute();

    return NextResponse.json(
      { message: 'Daily item counts reset to zero' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting daily item counts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
