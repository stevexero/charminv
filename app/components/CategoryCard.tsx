'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ImagePicker from './ImagePicker';
import { capitalizeWords } from '@/utils/validateInput';

interface CategoryProps {
  categoryId: string;
  categoryName: string;
  categoryImageUrl: string;
}

export default function CategoryCard({
  categoryId,
  categoryName,
  categoryImageUrl,
}: CategoryProps) {
  const router = useRouter();

  const defaultImage =
    'https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png';

  const [imageUrl, setImageUrl] = useState(categoryImageUrl || defaultImage);
  const [imageSelected, setImageSelected] = useState(
    categoryImageUrl && categoryImageUrl !== defaultImage
  );
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (categoryImageUrl) {
      setImageUrl(categoryImageUrl);
      setImageSelected(categoryImageUrl !== defaultImage);
    }
  }, [categoryImageUrl]);

  const handleImageSelect = async (newImageUrl: string) => {
    setImageUrl(newImageUrl);
    setShowImagePicker(false);
    setImageSelected(true);

    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: newImageUrl }),
    });

    if (res.ok) {
      setTimeout(() => {
        router.refresh();
      }, 500);
    } else {
      alert('Failed to update image');
    }
  };

  const formattedCategoryName = capitalizeWords(categoryName);

  return (
    <div className='w-full h-full shadow-xl hover:shadow-2xl shadow-slate-900 hover:shadow-black transition-all duration-200 ease-in-out'>
      {imageSelected ? (
        <Link
          href={`/dashboard/${categoryName.toLowerCase()}`}
          className='block w-full min-h-[240px] h-full text-slate-500 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out bg-no-repeat bg-cover bg-center'
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className='w-full p-2 border-b border-b-slate-500 bg-white'>
            <p className='text-center font-bold'>{formattedCategoryName}</p>
          </div>
        </Link>
      ) : (
        <div
          onClick={() => setShowImagePicker(true)}
          className='w-full h-full min-h-[240px] text-black cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out bg-no-repeat bg-cover bg-center relative'
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <p className='w-full absolute bottom-8 text-center text-slate-500 font-bold'>
            Click to search for an image
          </p>
          <div className='w-full p-2 border-b border-b-black bg-white'>
            <p className='text-center font-bold'>{categoryName}</p>
          </div>
        </div>
      )}

      {showImagePicker && (
        <ImagePicker
          onSelect={handleImageSelect}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
