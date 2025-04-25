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
    <div className="flex justify-center items-center gap-2 mt-2 px-2 py-1">
    <button 
      onClick={down}
      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 active:scale-95 transition disabled:opacity-50"
      disabled={value <= 1}
    >
      -
    </button>
    <span className="text-lg font-bold min-w-[30px] text-center">{value}</span>
    <button 
      onClick={up}
      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 active:scale-95 transition"
    >
      +
    </button>
  </div>
  );
};

export default QuantitySelector;