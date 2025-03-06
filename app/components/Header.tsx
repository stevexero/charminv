import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { FaGear } from 'react-icons/fa6';
import Link from 'next/link';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function Header() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const dbUser = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerk_id, user.id))
    .execute();

  const userRole = dbUser[0]?.role || 'user';

  return (
    <header className='flex flex-row justify-between items-center p-4 gap-4 h-16'>
      <div>
        <h1 className='font-semibold text-2xl text-white'>
          Charm Thai Kitchen & Coffee
        </h1>
      </div>
      <div className='flex flex-row items-center'>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          {/* Admin Settings Link */}
          {userRole === 'admin' && (
            <div className='mr-8'>
              <Link
                href='/dashboard/settings'
                className='text-blue-600 font-semibold hover:underline'
              >
                <FaGear color='#ffffff' size='1.6rem' />
              </Link>
            </div>
          )}
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
