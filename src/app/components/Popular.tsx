import React from 'react';
import data_product from '../components/Assets/data'; 
import Item from './Item';

const Popular = () => {
  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      <h1 className="text-4xl mt-5 font-semibold ">GYM CHAIN</h1>
      <hr className="w-52 h-1 rounded-lg bg-gray-800" />
      <div className="mt-12 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl w-full">
        {data_product.map((item) => (
          <Item
            key={item.id} 
            id={item.id}
            name={item.name}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;