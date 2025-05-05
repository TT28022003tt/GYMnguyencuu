import React from 'react';

interface ItemProps {
  id: number;
  name: string;
  image: string;
  newPrice: number;
  oldPrice: number;
}

const Item: React.FC<ItemProps> = ({ id, name, image, newPrice, oldPrice }) => {
  if (!image || !name || newPrice == null || oldPrice == null) {
    return null;
  }

  return (
    <div className="w-full max-w-[350px] flex flex-col items-center text-center transform transition-transform duration-500 hover:scale-105">
      <img
        src={image}
        alt={name}
        className="w-full h-[300px] object-cover rounded-lg"
      />
      <p className="my-2 text-base font-medium text-gray-800">{name}</p>
      <div className="flex gap-2 items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">
          ${newPrice.toFixed(2)}
        </div>
        <div className="text-lg font-medium text-gray-400 line-through">
          ${oldPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default Item;