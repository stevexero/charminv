import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const validDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// ✅ GET request to fetch user's current setting
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch settings
    const userSettings = await db
      .select()
      .from(settings)
      .where(eq(settings.user_id, userId))
      .execute();

    if (!userSettings.length) {
      return NextResponse.json({ week_start: null }, { status: 200 }); // Return null if no settings found
    }

    return NextResponse.json(userSettings[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ✅ PATCH request to update or insert the setting
export async function PATCH(req: Request) {
  try {
    const { userId, weekStart } = await req.json();

    // Validate input
    if (!userId || !weekStart || !validDays.includes(weekStart.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Ensure user is an admin
    const dbUser = await db
      .select({ id: users.id, role: users.role }) // Fetch user UUID and role
      .from(users)
      .where(eq(users.id, userId)) // Match against `users.id` (UUID)
      .execute();

    if (!dbUser.length || dbUser[0].role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Insert new setting if not exists or update if exists
    await db
      .insert(settings)
      .values({
        user_id: userId, // Ensure `user_id` is stored correctly
        week_start: weekStart.toLowerCase(),
      })
      .onConflictDoUpdate({
        target: settings.user_id, // Conflict resolution based on `user_id`
        set: { week_start: weekStart.toLowerCase() }, // ✅ Only update `week_start`
      });

    return NextResponse.json(
      { message: 'Settings updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
