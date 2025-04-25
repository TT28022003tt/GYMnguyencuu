
import React from 'react';
import './Popular.css';
import data_product from '../components/Assets/data'; 
import Item from './Item';


const Popular = () => {
  return (
    <div className='popular'>
      <h1>SOME BASIC TYPES OF GYM TRAINING</h1>
      <hr />
      <div className='popular-item'>
        {data_product.map((item) => (
          <Item
            key={item.id} 
            id={item.id}
            name={item.name}
            image={item.image}
            newPrice={item.newPrice}
            oldPrice={item.oldPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular; // Export default