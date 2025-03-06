import ClientDateTimeDisplay from '@/app/components/ClientDateTimeDisplay';
import { db } from '@/lib/db';
import { categories, subcategories, items, settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AddSubcategoryForm from '../../components/AddSubcategory';
import Accordion from '@/app/components/Accordian';
import AddItemForm from '../../components/AddItem';
import SubcategoryItem from '@/app/components/SubCategoryItem';
import { capitalizeWords } from '@/utils/validateInput';

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

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
    settingsData.length > 0 ? settingsData[0].week_start : 'sunday';

  const weekRange = getWeekRange(weekStart);

  const capitalizedCategoryName = capitalizeWords(categoryInfo.name);

  return (
    <div className='w-full p-8'>
      <div className='w-full flex flex-row items-start justify-between'>
        <h1 className='text-3xl font-bold text-white'>
          {capitalizedCategoryName}
        </h1>
        <ClientDateTimeDisplay timestamp={new Date().toISOString()} />
      </div>

      <p className='text-sm font-light text-white text-right'>
        Week of: {weekRange}
      </p>

      <div className='mt-8'>
        <h2 className='text-xl font-semibold mt-6 text-white'>Subcategories</h2>

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
                          inWeek={item.in_week}
                          outWeek={item.out_week}
                          weekStart={item.week_start}
                          weekEnd={item.week_end}
                          totalOutWeek={item.week_total_out}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className='text-slate-500'>No items found.</p>
                  )}
                  <AddItemForm
                    subcategoryId={subcategory.id}
                    subCategoryName={subcategory.name}
                  />
                </Accordion>
              );
            })}
          </ul>
        ) : (
          <p className='text-white'>No subcategories found.</p>
        )}
        <div className='w-full rounded-md bg-white mt-8 p-8 pt-4 shadow-2xl shadow-slate-900'>
          <p className='text-slate-500 font-bold'>Add a SubCategory</p>
          <AddSubcategoryForm categoryId={categoryInfo.id} />
        </div>
      </div>
    </div>
  );
}
