
import React from 'react';
import './Item.css';


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
    <div className='item'>
      <img src={image} alt={name} />
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          ${newPrice.toFixed(2)}
        </div>
        <div className="item-price-old">
          ${oldPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default Item; 