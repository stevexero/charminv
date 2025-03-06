'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizePositiveInteger } from '@/utils/validateInput';

interface AddItemFormProps {
  subcategoryId: string;
  subCategoryName: string;
}

export default function AddItemForm({
  subcategoryId,
  subCategoryName,
}: AddItemFormProps) {
  const router = useRouter();

  const [itemName, setItemName] = useState('');
  const [initialQuantity, setInitialQuantity] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return alert('Item name is required');

    setLoading(true);

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: itemName,
        subcategory_id: subcategoryId,
        week_start: parseInt(initialQuantity),
      }),
    });

    if (res.ok) {
      setItemName('');
      setInitialQuantity('0');
      router.refresh();
    } else {
      alert('Failed to add item');
    }

    setLoading(false);
  };

  const sanitizeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizePositiveInteger(e.target.value);
    setInitialQuantity(sanitizedValue);
  };

  const handleFocus = () => {
    if (initialQuantity === '0') {
      setInitialQuantity('');
    }
  };

  const handleBlur = () => {
    if (initialQuantity === '') {
      setInitialQuantity('0');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mt-4 p-4 pb-8 border-t border-t-slate-500'
    >
      <div className='w-full flex flex-row items-center'>
        <div className='w-3/4'>
          <p className='text-slate-500'>Add new {subCategoryName}</p>
        </div>
        <div className='w-1/4'>
          <p className='text-slate-500'>Set initial quantity</p>
        </div>
      </div>
      <div className='flex flex-row items-center'>
        <input
          type='text'
          placeholder='Item name'
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className='p-2 border border-slate-500 text-slate-500 rounded w-3/4 shadow-inner shadow-slate-500 placeholder:text-slate-500'
          required
        />
        <input
          type='text'
          placeholder='Initial Quantity'
          value={initialQuantity}
          onChange={sanitizeQuantity}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='p-2 border border-slate-500 text-slate-500 rounded w-1/4 ml-4 shadow-inner shadow-slate-500 placeholder:text-slate-500'
          required
        />
      </div>
      <button
        type='submit'
        className='p-2 mt-4 bg-slate-500 text-white rounded w-full cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-xl hover:shadow-2xl shadow-slate-600 hover:shadow-slate-900'
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
