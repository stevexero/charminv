'use client';

import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

interface SubcategoryItemProps {
  id: string;
  name: string;
  inDay: number;
  outDay: number;
  inWeek: number;
  outWeek: number;
  weekStart: number;
  weekEnd: number;
  totalOutWeek: number;
}

export default function SubcategoryItem({
  id,
  name,
  inDay,
  outDay,
  inWeek,
  outWeek,
  weekStart,
  weekEnd,
  totalOutWeek,
}: SubcategoryItemProps) {
  const [inCountDaily, setInCountDaily] = useState(inDay);
  const [outCountDaily, setOutCountDaily] = useState(outDay);
  const [inCountWeekly, setInCountWeekly] = useState(inWeek);
  const [outCountWeekly, setOutCountWeekly] = useState(outWeek);
  const [startCountWeekly, setStartCountWeekly] = useState(weekStart);
  const [endCountWeekly, setEndCountWeekly] = useState(weekEnd);
  const [totalOutWeekly, setTotalOutWeekly] = useState(totalOutWeek);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState<'in' | 'out' | null>(null);
  const [editValue, setEditValue] = useState<number | ''>('');

  const openModal = (type: 'in' | 'out') => {
    setEditType(type);
    setEditValue(type === 'in' ? inCountDaily : outCountDaily);
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
      const patchResponse = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [editType === 'in' ? 'in_day' : 'out_day']: editValue,
        }),
      });

      const patchData = await patchResponse.json();

      if (!patchResponse.ok) {
        console.error('Error updating item:', patchData.error);
        return;
      }

      const getResponse = await fetch(`/api/items/${id}`);
      const updatedItem = await getResponse.json();

      if (!getResponse.ok) {
        console.error('Error fetching updated item:', updatedItem.error);
        return;
      }

      setInCountDaily(updatedItem.in_day);
      setOutCountDaily(updatedItem.out_day);
      setInCountWeekly(updatedItem.in_week);
      setOutCountWeekly(updatedItem.out_week);
      setStartCountWeekly(updatedItem.week_start);
      setEndCountWeekly(updatedItem.week_end);
      setTotalOutWeekly(updatedItem.week_total_out);

      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <li key={id} className='flex justify-between items-center p-2 border-b'>
      <span className='font-medium'>{name}</span>

      {/* WEEK STOCK START */}
      <div>
        <p>Week Stock Start: {startCountWeekly}</p>
      </div>

      {/* WEEKLY */}
      <div>
        <p>Week:</p>

        {/* In Count Weekly */}
        <div className='flex items-center gap-1'>
          <span>{inCountWeekly} in</span>
        </div>

        {/* Out Count Weekly */}
        <div className='flex items-center gap-1'>
          <span>{outCountWeekly} out</span>
        </div>
      </div>

      {/* TOTAL SALE */}
      <div>
        <p>Week Total Out: {totalOutWeekly}</p>
      </div>

      {/* WEEK STOCK END */}
      <div>
        <p>Week Stock End: {endCountWeekly}</p>
      </div>

      {/* DAILY */}
      <div>
        <p>Day:</p>

        {/* In Count Daily */}
        <div className='flex items-center gap-1'>
          <span>{inCountDaily} in</span>
          <FaPencilAlt
            className='text-gray-500 cursor-pointer hover:text-gray-700'
            onClick={() => openModal('in')}
          />
        </div>

        {/* Out Count Daily */}
        <div className='flex items-center gap-1'>
          <span>{outCountDaily} out</span>
          <FaPencilAlt
            className='text-gray-500 cursor-pointer hover:text-gray-700'
            onClick={() => openModal('out')}
          />
        </div>
      </div>

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
