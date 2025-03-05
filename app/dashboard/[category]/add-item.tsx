'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddItemFormProps {
  subcategoryId: string;
}

export default function AddItemForm({ subcategoryId }: AddItemFormProps) {
  const router = useRouter();

  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return alert('Item name is required');

    setLoading(true);
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: itemName, subcategory_id: subcategoryId }),
    });

    if (res.ok) {
      setItemName('');
      router.refresh();
    } else {
      alert('Failed to add item');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='mt-4'>
      <input
        type='text'
        placeholder='Item name'
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className='p-2 border rounded w-full'
        required
      />
      <button
        type='submit'
        className='p-2 bg-blue-600 text-white rounded mt-2 w-full'
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
