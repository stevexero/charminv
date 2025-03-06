'use client';

import { useState, useEffect } from 'react';

interface Props {
  timestamp: string;
}

export default function ClientDateTimeDisplay({ timestamp }: Props) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date(timestamp);

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dayName = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: localTimeZone,
    }).format(date);

    const dateString = new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: localTimeZone,
    }).format(date);

    setFormattedDate(`${dayName} - ${dateString}`);
  }, [timestamp]);

  return (
    <div>
      <p className='text-lg font-bold text-white'>{formattedDate}</p>
    </div>
  );
}
