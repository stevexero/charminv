import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Fetch category details from the database
  const categoryData = await db
    .select()
    .from(categories)
    .where(eq(categories.name, category))
    .execute();

  if (!categoryData.length) {
    notFound(); // Show 404 page if category doesn't exist
  }

  const categoryInfo = categoryData[0];

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold'>{categoryInfo.name}</h1>
      <p className='text-gray-600 mt-2'>Manage items for {categoryInfo.name}</p>

      <div className='mt-8'>
        <h2 className='text-xl font-semibold'>Items in this category:</h2>
        <p className='text-gray-500 mt-2'>
          No items found. Add some items here!
        </p>
      </div>
    </div>
  );
}
