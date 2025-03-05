import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { WeekStartSettingsClient } from '@/app/components/WeekStartSettingsClient';

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const dbUser = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.clerk_id, user.id))
    .execute();

  const userRole = dbUser[0]?.role || 'user';
  const userUUID = dbUser[0]?.id;

  console.log(userUUID);

  if (userRole !== 'admin') {
    notFound();
  }

  return <WeekStartSettingsClient userId={userUUID} />;
}
