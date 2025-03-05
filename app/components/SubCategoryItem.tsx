'use client';

import { useState } from 'react';

interface SubcategoryItemProps {
  id: string;
  name: string;
  inDay: number;
  outDay: number;
}

export default function SubcategoryItem({
  id,
  name,
  inDay,
  outDay,
}: SubcategoryItemProps) {
  const [inCount, setInCount] = useState(inDay);
  const [outCount, setOutCount] = useState(outDay);

  const updateItem = async (type: 'in' | 'out', increment: number) => {
    const newValue = type === 'in' ? inCount + increment : outCount + increment;

    // Prevent negative values
    if (newValue < 0) return;

    if (type === 'in') {
      setInCount(newValue);
    } else {
      setOutCount(newValue);
    }

    // Send API request
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [type === 'in' ? 'in_day' : 'out_day']: newValue,
      }),
    });
  };

  return (
    <li key={id} className='flex justify-between items-center p-2 border-b'>
      <span className='font-medium'>{name}</span>
      <div className='flex items-center gap-4'>
        {/* In Counter */}
        <div className='flex items-center gap-1'>
          <button
            onClick={() => updateItem('in', 1)}
            className='text-green-600 hover:scale-110'
          >
            ▲
          </button>
          <span>{inCount} in</span>
        </div>

        {/* Out Counter */}
        <div className='flex items-center gap-1'>
          <button
            onClick={() => updateItem('out', 1)}
            className='text-green-600 hover:scale-110'
          >
            ▲
          </button>
          <span>{outCount} out</span>
        </div>
      </div>
    </li>
  );
}
