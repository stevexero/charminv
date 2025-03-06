'use client';

import { useState, useEffect, useCallback } from 'react';

const weekStartOptions = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function WeekStartSettingsClient({ userId }: { userId: string }) {
  const [weekStart, setWeekStart] = useState('Sunday');
  const [weekRange, setWeekRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNewUser, setIsNewUser] = useState(false); // ✅ Track if the setting is missing

  // ✅ Fetch the user's current setting
  useEffect(() => {
    const fetchWeekStart = async () => {
      try {
        const res = await fetch(`/api/settings?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.week_start) {
          setWeekStart(
            data.week_start.charAt(0).toUpperCase() + data.week_start.slice(1)
          ); // Capitalize first letter
          setIsNewUser(false);
        } else {
          setIsNewUser(true); // ✅ No settings found, user is new
        }
      } catch (err) {
        console.error('Error fetching week start:', err);
      }
    };

    fetchWeekStart();
  }, [userId]);

  // ✅ Memoized function to calculate week range
  const calculateWeekRange = useCallback((startDay: string) => {
    const today = new Date();
    const startIndex = weekStartOptions.indexOf(startDay);
    const startDate = new Date(today);
    startDate.setDate(
      today.getDate() - ((today.getDay() - startIndex + 7) % 7)
    );

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    setWeekRange(`${formatDate(startDate)} to ${formatDate(endDate)}`);
  }, []);

  // ✅ Format date to "Mar 4, 2025"
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  // ✅ Function to update week start in database when the submit button is clicked
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, weekStart: weekStart.toLowerCase() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.error || 'Failed to update week start');
      }

      setSuccess('Week start updated successfully!');
      setIsNewUser(false); // ✅ Mark that user now has a setting
    } catch (err) {
      console.error('Error updating week start:', err);
      setError('Failed to save week start. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update week range when `weekStart` changes (but NOT update the DB)
  useEffect(() => {
    calculateWeekRange(weekStart);
  }, [weekStart, calculateWeekRange]);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-white'>Admin Settings</h1>
      <p className='text-white mt-2'>Only admins can access this page.</p>

      <div className='mt-6'>
        <h2 className='text-xl font-semibold text-white'>Week Start Day</h2>
        <p className='text-white text-sm mb-2'>
          Select the start of your week:
        </p>

        <form onSubmit={handleSubmit}>
          <select
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className='p-2 border border-white rounded-md text-white'
            disabled={loading}
          >
            {weekStartOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <button
            type='submit'
            className='ml-4 px-4 py-2 bg-black text-white rounded-md disabled:bg-gray-400'
            disabled={loading}
          >
            {loading ? 'Saving...' : isNewUser ? 'Create' : 'Save'}
          </button>
        </form>

        {success && <p className='text-sm text-green-500 mt-2'>{success}</p>}
        {error && <p className='text-sm text-red-500 mt-2'>{error}</p>}

        <p className='mt-4 text-lg font-medium text-white'>
          Current Week: {weekRange}
        </p>
      </div>
    </div>
  );
}
