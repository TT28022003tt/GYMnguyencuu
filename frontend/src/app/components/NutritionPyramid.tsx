"use client"
import { useState } from "react";

const NutritionPyramid = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div 
        className="w-full max-w-4xl rounded-lg p-6 flex items-center justify-center relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hình ảnh */}
        <div
          className={`flex flex-col justify-center items-center transition-transform duration-500 ${
            isHovered ? "translate-x-[-45%] h-[350px]" : "translate-x-0 h-[400px]"
          }`}
        >
          <img
            src="/images/thapdinhduong.png"
            alt="Nutrition Pyramid"
            className="w-full h-full object-contain"
          />
          <p>THÁP DINH DƯỠNG</p>
        </div>

        <div
          className={`absolute right-0 w-1/2 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="layer p-3 mb-1 rounded w-full text-center  shadow">
            <p>Cung cấp năng lượng, nhưng cần tiêu thụ một cách hạn chế.</p>
          </div>
          <div className="layer p-3 mb-1 rounded w-full text-center  shadow">
            <p>Cung cấp protein cần thiết cho sự phát triển và sửa chữa tế bào.</p>
          </div>
          <div className="layer p-3 mb-1 rounded w-full text-center shadow">
            <p>Cung cấp vitamin, khoáng chất, chất xơ và chất chống oxy hóa.</p>
          </div>
          <div className="layer p-3 rounded w-full text-center shadow">
            <p>Cung cấp năng lượng chính cho cơ thể thông qua carbohydrate.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPyramid;