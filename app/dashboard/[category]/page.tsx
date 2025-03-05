import ClientDateTimeDisplay from '@/app/components/ClientDateTimeDisplay';
import { db } from '@/lib/db';
import { categories, subcategories, items, settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
// import Link from 'next/link';
import AddSubcategoryForm from './add-subcategory';
import Accordion from '@/app/components/Accordian';
import AddItemForm from './add-item';
import SubcategoryItem from '@/app/components/SubCategoryItem';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

function capitalizeWords(str: string) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getWeekRange(startDay: string) {
  const weekStartOptions = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const today = new Date();
  const startIndex = weekStartOptions.indexOf(startDay.toLowerCase());
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - ((today.getDay() - startIndex + 7) % 7));

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const categoryData = await db
    .select()
    .from(categories)
    .where(eq(categories.name, category))
    .execute();

  if (!categoryData.length) {
    notFound();
  }

  const categoryInfo = categoryData[0];

  const subcategoriesData = await db
    .select()
    .from(subcategories)
    .where(eq(subcategories.category_id, categoryInfo.id))
    .execute();

  const settingsData = await db.select().from(settings).execute();
  const weekStart =
    settingsData.length > 0 ? settingsData[0].week_start : 'sunday'; // Default to Sunday

  // Calculate week range based on settings
  const weekRange = getWeekRange(weekStart);

  const capitalizedCategoryName = capitalizeWords(categoryInfo.name);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold'>{capitalizedCategoryName}</h1>

      <ClientDateTimeDisplay timestamp={new Date().toISOString()} />

      {/* Week Range Display */}
      <p className='text-lg font-medium text-gray-300 mt-2'>
        Week of: {weekRange}
      </p>

      <p className='text-gray-600 mt-2'>Manage items for {categoryInfo.name}</p>

      <div className='mt-8 max-w-1/2'>
        <h2 className='text-xl font-semibold mt-6'>Subcategories</h2>

        {subcategoriesData.length > 0 ? (
          <ul>
            {subcategoriesData.map(async (subcategory) => {
              const subcategoryItems = await db
                .select()
                .from(items)
                .where(eq(items.subcategory_id, subcategory.id))
                .execute();

              return (
                <Accordion key={subcategory.id} title={subcategory.name}>
                  {subcategoryItems.length > 0 ? (
                    <ul>
                      {subcategoryItems.map((item) => (
                        <SubcategoryItem
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          inDay={item.in_day}
                          outDay={item.out_day}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className='text-gray-500'>No items found.</p>
                  )}
                  <AddItemForm subcategoryId={subcategory.id} />
                </Accordion>
              );
            })}
          </ul>
        ) : (
          <p className='text-gray-500'>No subcategories found.</p>
        )}
        <div className='mt-4'>
          <p className='text-gray-500'>Add a SubCategory below:</p>
          <AddSubcategoryForm categoryId={categoryInfo.id} />
        </div>
      </div>
    </div>
  );
}
