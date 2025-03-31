"use client"

import { useState } from "react";

interface QuantitySelectorProps {
  defaultValue: number; 
  onValueChange: (value: number) => void; // Callback để gửi giá trị mới về component cha
}

const QuantitySelector:React.FC<QuantitySelectorProps> = ({defaultValue,onValueChange}) => {
  const [value, setValue] = useState(defaultValue); // Quản lý trạng thái số lượng nội bộ

  const up = () => {
    const newValue = value + 1;
    setValue(newValue);
    onValueChange(newValue); // Gửi giá trị mới về component cha
  };

  const down = () => {
    const newValue = value > 1 ? value - 1 : 1; 
    setValue(newValue);
    onValueChange(newValue); // Gửi giá trị mới về component cha
  };
  return (
	<div className="h-3 flex justify-center items-center gap-3 bg-orange-600 p-3">
      <button
        onClick={up}
		    className="text-black text-xl cursor-pointer "
      >
        +
      </button>
      <span className="text-lg font-bold">{value}</span>
      <button
        onClick={down}
        className="text-black text-xl cursor-pointer "
      >
        -
      </button>
    </div>
  );
};

export default QuantitySelector;