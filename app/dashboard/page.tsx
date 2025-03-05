import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { categories, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import AddCategory from './add-category';
import CategoryCard from '../components/CategoryCard';
import Link from 'next/link';

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const allCategories = await db.select().from(categories).execute();

  const dbUser = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerk_id, user.id))
    .execute();

  const userRole = dbUser[0]?.role || 'user';

  console.log(userRole);

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Charm Thai Kitchen & Coffee</h1>

      {/* Admin Settings Link */}
      {userRole === 'admin' && (
        <div className='mt-4'>
          <Link
            href='/dashboard/settings'
            className='text-blue-600 font-semibold hover:underline'
          >
            ⚙️ Admin Settings
          </Link>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-8'>
        {allCategories.map((category) => (
          <CategoryCard
            key={category.id}
            categoryId={category.id}
            categoryName={category.name}
            categoryImageUrl={category.image_url}
          />
        ))}

        {userRole === 'admin' ? (
          <AddCategory />
        ) : allCategories.length <= 0 ? (
          <p className='text-center text-gray-500 col-span-full'>
            Admin required to add category
          </p>
        ) : null}
      </div>
    </div>
  );
}
