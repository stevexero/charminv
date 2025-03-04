'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return alert('Category name is required');

    setLoading(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName,
      }),
    });

    if (res.ok) {
      setCategoryName('');
      router.refresh(); // Refresh UI after adding category
    } else {
      alert('Failed to add category');
    }

    setLoading(false);
  };

  return (
    <div className='w-56 h-56 flex flex-col items-center bg-white text-black rounded-2xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out'>
      <div className='w-full p-2 border-b border-b-black'>
        <p className='text-center font-bold'>Add New Category</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center p-4 gap-2'
      >
        <input
          type='text'
          placeholder='Category name'
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className='p-2 border rounded w-full'
          required
        />
        <button
          type='submit'
          className='p-2 bg-black text-white rounded-full mt-2 w-full'
          disabled={loading}
        >
          {loading ? 'Adding...' : <FaPlus size='1.5rem' />}
        </button>
      </form>
    </div>
  );
}
