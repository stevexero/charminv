import { RedirectToSignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
// import Link from 'next/link';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import AddCategory from './add-category';
import CategoryCard from '../components/CategoryCard';

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  // Fetch categories from the database
  const allCategories = await db.select().from(categories).execute();

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Charm Thai Kitchen & Coffee</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-8'>
        {allCategories.map((category) => (
          <CategoryCard
            key={category.id}
            categoryId={category.id}
            categoryName={category.name}
            categoryImageUrl={category.image_url}
          />
          //   <Link
          //     key={category.id}
          //     href={`/dashboard/${category.name.toLowerCase()}`}
          //     className='w-56 h-56 bg-white text-black rounded-2xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out bg-no-repeat bg-cover bg-center'
          //     style={{ backgroundImage: `url(${category.image_url})` }}
          //   >
          //     <div className='w-full p-2 border-b border-b-black bg-white rounded-t-2xl'>
          //       <p className='text-center font-bold'>{category.name}</p>
          //     </div>
          //   </Link>
        ))}

        <AddCategory />
      </div>
    </div>
  );
}
