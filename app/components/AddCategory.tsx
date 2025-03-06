'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { sanitizeNameForDb } from '@/utils/validateInput';

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return alert('Category name is required');

    setLoading(true);

    const formattedCategoryName = sanitizeNameForDb(categoryName);

    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: formattedCategoryName,
      }),
    });

    if (res.ok) {
      setCategoryName('');
      router.refresh();
    } else {
      alert('Failed to add category');
    }

    setLoading(false);
  };

  return (
    <div className='w-full flex flex-col items-center bg-white text-black shadow-xl'>
      <div className='w-full p-2 border-b border-b-slate-500'>
        <p className='text-center font-bold text-slate-500'>Add New Category</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className='w-full h-full flex flex-col items-center justify-between p-8'
      >
        <input
          type='text'
          placeholder='Beverages, Bulk Food, etc.'
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className='p-2 border border-slate-500 rounded w-full shadow-inner shadow-slate-500'
          required
        />
        <button
          type='submit'
          className='p-4 bg-slate-500 text-white rounded-md mt-4 w-full flex justify-center items-center cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl shadow-slate-600 hover:shadow-slate-900'
          disabled={loading}
        >
          {loading ? (
            'Adding...'
          ) : (
            <>
              Add Category&nbsp;&nbsp;
              <FaPlus />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
