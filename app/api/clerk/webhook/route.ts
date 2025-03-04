import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
// import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (payload.type !== 'user.created') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    const { id, phone_numbers } = payload.data;
    const contactInfo = phone_numbers?.[0]?.phone_number || null;

    if (!contactInfo) {
      return NextResponse.json(
        { error: 'Missing user contact info' },
        { status: 400 }
      );
    }

    await db
      .insert(users)
      .values({
        clerk_id: id,
        contact_info: contactInfo,
        role: 'user',
        created_at: new Date(),
      })
      .onConflictDoNothing();

    return NextResponse.json({ message: 'User processed' }, { status: 201 });

    // Check if user exists
    // const existingUser = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.clerk_id, id))
    //   .execute();

    // if (existingUser.length === 0) {
    //   await db.insert(users).values({
    //     clerk_id: id,
    //     contact_info: contactInfo,
    //     role: 'user',
    //     created_at: new Date(),
    //   });

    //   return NextResponse.json({ message: 'User added' }, { status: 201 });
    // }

    // return NextResponse.json(
    //   { message: 'User already exists' },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
