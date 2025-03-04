'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ImagePicker from './ImagePicker';

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

    // Send update request to the database
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: newImageUrl }),
    });

    if (res.ok) {
      // Give time for DB to update before refreshing
      setTimeout(() => {
        router.refresh();
      }, 500);
    } else {
      alert('Failed to update image');
    }
  };

  return (
    <div className='w-56 h-56'>
      {imageSelected ? (
        <Link
          href={`/dashboard/${categoryName.toLowerCase()}`}
          className='block w-full h-full bg-white text-black rounded-2xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out bg-no-repeat bg-cover bg-center'
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className='w-full p-2 border-b border-b-black bg-white rounded-t-2xl'>
            <p className='text-center font-bold'>{categoryName}</p>
          </div>
        </Link>
      ) : (
        <div
          onClick={() => setShowImagePicker(true)}
          className='w-full h-full bg-white text-black rounded-2xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out bg-no-repeat bg-cover bg-center'
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className='w-full p-2 border-b border-b-black bg-white rounded-t-2xl'>
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
