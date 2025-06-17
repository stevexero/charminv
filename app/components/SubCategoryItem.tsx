'use client';

import { sanitizePositiveInteger } from '@/utils/validateInput';
import { useState } from 'react';

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
  mondayIn: number;
  mondayOut: number;
  tuesdayIn: number;
  tuesdayOut: number;
  wednesdayIn: number;
  wednesdayOut: number;
  thursdayIn: number;
  thursdayOut: number;
  fridayIn: number;
  fridayOut: number;
  saturdayIn: number;
  saturdayOut: number;
  sundayIn: number;
  sundayOut: number;
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
  mondayIn,
  mondayOut,
  tuesdayIn,
  tuesdayOut,
  wednesdayIn,
  wednesdayOut,
  thursdayIn,
  thursdayOut,
  fridayIn,
  fridayOut,
  saturdayIn,
  saturdayOut,
  sundayIn,
  sundayOut,
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
  // Daily
  const [inCountMonday, setInCountMonday] = useState(mondayIn);
  const [outCountMonday, setOutCountMonday] = useState(mondayOut);
  const [inCountTuesday, setInCountTuesday] = useState(tuesdayIn);
  const [outCountTuesday, setOutCountTuesday] = useState(tuesdayOut);
  const [inCountWednesday, setInCountWednesday] = useState(wednesdayIn);
  const [outCountWednesday, setOutCountWednesday] = useState(wednesdayOut);
  const [inCountThursday, setInCountThursday] = useState(thursdayIn);
  const [outCountThursday, setOutCountThursday] = useState(thursdayOut);
  const [inCountFriday, setInCountFriday] = useState(fridayIn);
  const [outCountFriday, setOutCountFriday] = useState(fridayOut);
  const [inCountSaturday, setInCountSaturday] = useState(saturdayIn);
  const [outCountSaturday, setOutCountSaturday] = useState(saturdayOut);
  const [inCountSunday, setInCountSunday] = useState(sundayIn);
  const [outCountSunday, setOutCountSunday] = useState(sundayOut);

  const openModal = (type: 'in' | 'out') => {
    setEditType(type);
    // setEditValue(type === 'in' ? inCountDaily : outCountDaily);
    setEditValue('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditType(null);
    setEditValue('');
  };

  const handleSubmit = async () => {
    if (editValue === '' || editType === null) return;

    const newValue = Number(editValue);
    if (isNaN(newValue) || newValue <= 0) return;

    const updatedValue =
      editType === 'in' ? inCountDaily + newValue : outCountDaily + newValue;

    // Get current day of week
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = days[new Date().getDay()];
    const todayInKey = `${today}_in`;
    const todayOutKey = `${today}_out`;

    console.log('Today:', today);
    console.log('Keys:', todayInKey, todayOutKey);

    // Get current day's state value
    let currentDayValue = 0;
    if (editType === 'in') {
      switch (today) {
        case 'monday':
          currentDayValue = inCountMonday;
          break;
        case 'tuesday':
          currentDayValue = inCountTuesday;
          break;
        case 'wednesday':
          currentDayValue = inCountWednesday;
          break;
        case 'thursday':
          currentDayValue = inCountThursday;
          break;
        case 'friday':
          currentDayValue = inCountFriday;
          break;
        case 'saturday':
          currentDayValue = inCountSaturday;
          break;
        case 'sunday':
          currentDayValue = inCountSunday;
          break;
      }
    } else {
      switch (today) {
        case 'monday':
          currentDayValue = outCountMonday;
          break;
        case 'tuesday':
          currentDayValue = outCountTuesday;
          break;
        case 'wednesday':
          currentDayValue = outCountWednesday;
          break;
        case 'thursday':
          currentDayValue = outCountThursday;
          break;
        case 'friday':
          currentDayValue = outCountFriday;
          break;
        case 'saturday':
          currentDayValue = outCountSaturday;
          break;
        case 'sunday':
          currentDayValue = outCountSunday;
          break;
      }
    }

    console.log('Current day value:', currentDayValue);

    try {
      const patchResponse = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [editType === 'in' ? 'in_day' : 'out_day']: updatedValue,
          [editType === 'in' ? todayInKey : todayOutKey]: updatedValue,
        }),
      });

      const patchData = await patchResponse.json();

      if (!patchResponse.ok) {
        console.error('Error updating item:', patchData.error);
        return;
      }

      console.log('Patch data:', patchData);

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

      // Daily
      setInCountMonday(updatedItem.monday_in);
      setOutCountMonday(updatedItem.monday_out);
      setInCountTuesday(updatedItem.tuesday_in);
      setOutCountTuesday(updatedItem.tuesday_out);
      setInCountWednesday(updatedItem.wednesday_in);
      setOutCountWednesday(updatedItem.wednesday_out);
      setInCountThursday(updatedItem.thursday_in);
      setOutCountThursday(updatedItem.thursday_out);
      setInCountFriday(updatedItem.friday_in);
      setOutCountFriday(updatedItem.friday_out);
      setInCountSaturday(updatedItem.saturday_in);
      setOutCountSaturday(updatedItem.saturday_out);
      setInCountSunday(updatedItem.sunday_in);
      setOutCountSunday(updatedItem.sunday_out);

      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const formattedNameFunc = (nameToFormat: string) =>
    nameToFormat
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const formattedName = formattedNameFunc(name);

  return (
    <li
      key={id}
      className='flex justify-between items-center text-white mt-4 rounded-md bg-white'
    >
      <div className='w-full flex flex-col'>
        {/* TOP */}
        <div className='w-full flex flex-row items-center justify-between'>
          <div>
            <span className='font-bold text-4xl text-slate-600'>
              {formattedName}
            </span>
          </div>

          {/* DAILY */}
          <div className='flex flex-row items-center justify-between'>
            {/* In Count Daily */}
            <div className='flex items-center gap-1'>
              <span
                className='mr-4 text-2xl shadow-lg shadow-red-900 px-4 py-2 bg-red-600 rounded-md'
                onClick={() => openModal('in')}
              >
                In: {inCountDaily}
              </span>
            </div>

            {/* Out Count Daily */}
            <div className='flex items-center gap-1'>
              <span
                className='text-2xl shadow-lg shadow-green-900 px-4 py-2 bg-green-600 rounded-md'
                onClick={() => openModal('out')}
              >
                Out: {outCountDaily}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className='w-full flex flex-row items-center justify-between mt-4 bg-white text-blue-500 text-sm'>
          {/* DAILY */}
          <div className='flex flex-col'>
            <p className='font-bold'>Monday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountMonday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountMonday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Tuesday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountTuesday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountTuesday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Wednesday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountWednesday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountWednesday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Thursday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountThursday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountThursday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Friday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountFriday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountFriday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Saturday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountSaturday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountSaturday}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <p className='font-bold'>Sunday</p>
            <div className='grid grid-cols-1'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>In:&nbsp;</p>
                <p>{inCountSunday}</p>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <p>Out:&nbsp;</p>
                <p>{outCountSunday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full flex flex-row items-center justify-between mt-2 bg-white border-b border-b-slate-500 text-red-500 text-sm'>
          {/* WEEK STOCK START */}
          <div>
            <p>Week Start: {startCountWeekly}</p>
          </div>

          {/* WEEKLY */}
          <div className='flex flex-row items-center'>
            <p>Week&nbsp;</p>

            {/* In Count Weekly */}
            <div className='flex items-center gap-1'>
              <span>In: {inCountWeekly}</span>
            </div>

            {/* Out Count Weekly */}
            <div className='flex items-center gap-1 ml-4'>
              <span>Out: {outCountWeekly}</span>
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
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 text-white'>
          <div className='bg-white p-6 rounded-lg w-80 shadow-2xl shadow-slate-900'>
            <h2 className='text-lg font-semibold mb-4 text-slate-500'>
              Edit {editType === 'in' ? 'In' : 'Out'} Count
            </h2>
            <input
              type='number'
              className='w-full p-2 border rounded-md text-black shadow-inner shadow-slate-500'
              value={editValue === 0 ? '' : editValue}
              //   onChange={(e) => setEditValue(Number(e.target.value))}
              onChange={(e) => {
                const sanitized = sanitizePositiveInteger(e.target.value);
                setEditValue(sanitized === '' ? '' : Number(sanitized));
              }}
              onBlur={() => {
                if (editValue === '' || isNaN(editValue as number)) {
                  setEditValue(0); // Reset to 0 if input is left empty
                }
              }}
              autoFocus
              min={0}
            />
            <div className='flex justify-end mt-4 gap-2'>
              <button
                className='px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 shadow-md shadow-gray-600'
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-800 shadow-md shadow-slate-900'
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
