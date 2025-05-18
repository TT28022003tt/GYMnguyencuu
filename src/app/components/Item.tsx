import Image from 'next/image';
import React from 'react';

interface ItemProps {
  id: number;
  name: string;
  image: string;
}

const Item: React.FC<ItemProps> = ({ id, name, image }) => {
  if (!image || !name) {
    return null;
  }

  return (
    <div className="w-full max-w-[350px] flex flex-col items-center text-center rounded-xl overflow-hidden shadow-md  transform transition-transform duration-500 hover:scale-105 cursor-pointer">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-lg font-semibold ">{name}</p>
      </div>
    </div>

  );
};

export default Item;