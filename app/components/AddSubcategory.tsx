'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    setLoading(true);
    const res = await fetch('/api/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: subcategoryName,
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
        placeholder='Subcategory name'
        value={subcategoryName}
        onChange={(e) => setSubcategoryName(e.target.value)}
        className='p-2 border border-white rounded w-full text-white placeholder:text-slate-300'
        required
      />
      <button
        type='submit'
        className='p-2 bg-black text-white rounded w-full'
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Subcategory'}
      </button>
    </form>
  );
}
