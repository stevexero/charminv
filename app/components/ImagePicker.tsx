'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagePickerProps {
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export default function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch(`/api/images?query=${searchTerm}`);
    const data = await res.json();
    setImages(data.map((img: { src: { medium: string } }) => img.src.medium));
    setLoading(false);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded-lg w-96'>
        <h2 className='text-xl font-bold mb-2 text-black'>Select an Image</h2>
        <input
          type='text'
          placeholder='Search for images...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border rounded mb-2 text-slate-700'
          required
        />
        <button
          onClick={fetchImages}
          className='w-full p-2 bg-black text-white rounded mb-2 cursor-pointer disabled:bg-gray-200'
          disabled={searchTerm === ''}
        >
          Search
        </button>
        {loading && <p className='text-slate-700'>Loading...</p>}
        <div className='grid grid-cols-3 gap-2'>
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt='category'
              width={100}
              height={80}
              className='w-full h-20 object-cover cursor-pointer rounded-md'
              onClick={() => onSelect(img)}
            />
          ))}
        </div>
        <button
          onClick={onClose}
          className='w-full p-2 bg-gray-300 text-black rounded mt-2 cursor-pointer'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
