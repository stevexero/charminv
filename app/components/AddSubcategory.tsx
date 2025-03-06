'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeNameForDb } from '@/utils/validateInput';

interface AddSubcategoryFormProps {
  categoryId: string;
}

export default function AddSubcategoryForm({
  categoryId,
}: AddSubcategoryFormProps) {
  const router = useRouter();

  const [subcategoryName, setSubcategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategoryName) return alert('Subcategory name is required');

    const formattedName = sanitizeNameForDb(subcategoryName);

    setLoading(true);
    const res = await fetch('/api/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formattedName,
        category_id: categoryId,
      }),
    });

    if (res.ok) {
      setSubcategoryName('');
      router.refresh();
    } else {
      alert('Failed to add subcategory');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4'>
      <input
        type='text'
        placeholder='Beer, Wine, Dry Goods, etc.'
        value={subcategoryName}
        onChange={(e) => setSubcategoryName(e.target.value)}
        className='p-2 border border-slate-500 rounded w-full text-slate-500 placeholder:text-slate-500 shadow-inner shadow-slate-500'
        required
      />
      <button
        type='submit'
        className='p-4 mt-4 bg-slate-500 text-white rounded w-full cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl shadow-slate-600 hover:shadow-slate-900'
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Subcategory'}
      </button>
    </form>
  );
}
