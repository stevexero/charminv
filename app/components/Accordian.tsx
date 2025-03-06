'use client';

import { capitalizeWords } from '@/utils/validateInput';
import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedName = capitalizeWords(title);

  return (
    <div className='rounded-md px-4 py-2 my-4 bg-white shadow-md shadow-slate-600'>
      <button
        className='w-full flex flex-row items-center justify-between text-left font-semibold text-slate-500 text-2xl cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{formattedName}</span> <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className='mt-2'>{children}</div>}
    </div>
  );
}
