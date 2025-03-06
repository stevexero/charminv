'use client';

import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border border-white rounded-lg p-2 my-2 bg-slate-100'>
      <button
        className='w-full text-left font-semibold text-slate-500 text-2xl'
        onClick={() => setIsOpen(!isOpen)}
      >
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && <div className='mt-2'>{children}</div>}
    </div>
  );
}
