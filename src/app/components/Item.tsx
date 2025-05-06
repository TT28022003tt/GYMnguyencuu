import Image from 'next/image';
import React from 'react';

interface ItemProps {
  id: number;
  name: string;
  image: string;
}

const Item: React.FC<ItemProps> = ({ id, name, image}) => {
  if (!image || !name ) {
    return null;
  }

  return (
    <div className="w-full max-w-[350px] flex flex-col items-center text-center transform transition-transform duration-500 hover:scale-105">
      <Image
        src={image}
        alt={name}
        className="w-full h-[300px] object-cover rounded-lg"
      />
      <p className="my-2 text-base font-medium text-gray-800">{name}</p>
    </div>
  );
};

export default Item;