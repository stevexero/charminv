import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items, settings } from '@/lib/schema';

const daysMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Runs at midnight to reset counts
export async function GET() {
  try {
    // Get today's weekday (0 = Sunday, 1 = Monday, etc.)
    const now = new Date();
    const lasVegasTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const today = lasVegasTime.getDay();

    await db
      .update(items)
      .set({
        in_day: 0,
        out_day: 0,
      })
      .execute();

    // Fetch all user settings to check their preferred week start
    const userSettings = await db.select().from(settings).execute();

    // Check if any user's preferred week start matches today
    const shouldResetWeekly = userSettings.some((setting) => {
      const userPreferredDay = daysMap[setting.week_start.toLowerCase()]; // Convert string to number
      return userPreferredDay === today;
    });

    if (shouldResetWeekly) {
      await db
        .update(items)
        .set({
          week_start: items.week_end,
          in_week: 0,
          out_week: 0,
          week_total_out: 0,
        })
        .execute();

      return NextResponse.json(
        { message: 'Daily and weekly item counts reset to zero' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Daily reset completed. No weekly reset today.' },
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
