import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { categories, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import AddCategory from '../components/AddCategory';
import CategoryCard from '../components/CategoryCard';

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

  return (
    <div className='p-8'>
      {/* Breadcrumbs here */}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-2'>
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
