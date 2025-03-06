'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizePositiveInteger } from '@/utils/validateInput';

interface AddItemFormProps {
  subcategoryId: string;
}

export default function AddItemForm({ subcategoryId }: AddItemFormProps) {
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
    <form onSubmit={handleSubmit} className='mt-4'>
      <div className='flex flex-row items-center'>
        <input
          type='text'
          placeholder='Item name'
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className='p-2 border border-slate-500 text-slate-500 rounded w-3/4 placeholder:text-slate-500'
          required
        />
        <input
          type='text'
          placeholder='Initial Quantity'
          value={initialQuantity}
          onChange={sanitizeQuantity}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='p-2 border border-slate-500 text-slate-500 rounded w-1/4 ml-4 placeholder:text-slate-500'
          required
        />
      </div>
      <button
        type='submit'
        className='p-2 bg-black text-white rounded mt-2 w-full'
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
