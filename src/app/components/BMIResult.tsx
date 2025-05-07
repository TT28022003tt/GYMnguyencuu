import React from 'react';

interface BMIResultProps {
  bmi: number;
  category: string;
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
  onBack: () => void;
}

const BMIResult: React.FC<BMIResultProps> = ({
  bmi,
  category,
  name,
  age,
  height,
  weight,
  gender,
  onBack,
}) => {
  const getAdvice = (category: string) => {
    switch (category) {
      case 'Thiếu cân':
        return 'Bạn đang thiếu cân. Hãy chú ý bổ sung dinh dưỡng hợp lý và duy trì chế độ nghỉ ngơi.';
      case 'Bình thường':
        return 'Bạn có cân nặng bình thường. Hãy tiếp tục duy trì lối sống lành mạnh!';
      case 'Thừa cân':
        return 'Bạn đang thừa cân. Cần cân nhắc điều chỉnh chế độ ăn và tập luyện thường xuyên.';
      case 'Béo phì':
        return 'Bạn đang béo phì. Hãy tìm sự tư vấn từ chuyên gia để có kế hoạch giảm cân khoa học.';
      default:
        return '';
    }
  };

  return (
    <div className="w-[90%] max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl px-8 py-10 mt-16 border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-6 uppercase tracking-widest">
        KẾT QUẢ BMI
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black text-[17px] mb-6">
        <div><strong>Tên:</strong> {name}</div>
        <div><strong>Tuổi:</strong> {age}</div>
        <div><strong>Chiều cao:</strong> {height} cm</div>
        <div><strong>Cân nặng:</strong> {weight} kg</div>
        <div><strong>Giới tính:</strong> {gender === 'Male' ? 'Nam' : 'Nữ'}</div>
        <div><strong>BMI:</strong> {bmi.toFixed(2)}</div>
        <div><strong>Phân loại:</strong> {category}</div>
      </div>

      <div className="bg-orange-100 p-4 rounded-lg text-center text-sm text-orange-800 font-medium mb-6 shadow-inner">
        {getAdvice(category)}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default BMIResult;