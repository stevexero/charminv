'use client';

import { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState<'in' | 'out' | null>(null);
  const [editValue, setEditValue] = useState<number | ''>('');
  const [resetTime, setResetTime] = useState('');

  useEffect(() => {
    const today = new Date();
    today.setHours(24, 0, 0, 0); // Midnight reset
    setResetTime(
      today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  const openModal = (type: 'in' | 'out') => {
    setEditType(type);
    setEditValue(type === 'in' ? inCount : outCount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditType(null);
    setEditValue('');
  };

  const handleSubmit = async () => {
    if (editValue === '' || editType === null) return;

    try {
      await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [editType === 'in' ? 'in_day' : 'out_day']: editValue,
        }),
      });

      if (editType === 'in') {
        setInCount(editValue);
      } else {
        setOutCount(editValue);
      }

      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <li key={id} className='flex justify-between items-center p-2 border-b'>
      <span className='font-medium'>{name}</span>
      <div className='flex items-center gap-4'>
        {/* In Count */}
        <div className='flex items-center gap-1'>
          <span>{inCount} in</span>
          <FaPencilAlt
            className='text-gray-500 cursor-pointer hover:text-gray-700'
            onClick={() => openModal('in')}
          />
        </div>

        {/* Out Count */}
        <div className='flex items-center gap-1'>
          <span>{outCount} out</span>
          <FaPencilAlt
            className='text-gray-500 cursor-pointer hover:text-gray-700'
            onClick={() => openModal('out')}
          />
        </div>
      </div>
      <p className='text-gray-400 text-xs'>Resets at {resetTime}</p>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-slate-700'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h2 className='text-lg font-semibold mb-4'>
              Edit {editType === 'in' ? 'In' : 'Out'} Count
            </h2>
            <input
              type='number'
              className='w-full p-2 border rounded-md'
              value={editValue}
              onChange={(e) => setEditValue(Number(e.target.value))}
              min={0}
            />
            <div className='flex justify-end mt-4 gap-2'>
              <button
                className='px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500'
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
