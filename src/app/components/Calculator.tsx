import React, { useState } from 'react';
import Image from 'next/image';
import BMIResult from './BMIResult';
import image_gym2 from '../components/Assets/image_gym2.png';

const Calculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight || !gender || !name || !age) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = parseFloat(
      (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2)
    );
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory('Thiếu cân');
    else if (bmiValue < 24.9) setCategory('Bình thường');
    else if (bmiValue < 29.9) setCategory('Thừa cân');
    else setCategory('Béo phì');

    setShowResult(true);
  };

  const handleBack = () => {
    setHeight('');
    setWeight('');
    setGender('');
    setName('');
    setAge('');
    setBmi(null);
    setCategory('');
    setShowResult(false);
  };

  return (
    <section id="calculator" className="min-h-screen bg-gradient-to-b from-orange-300 to-white py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-black mb-10 uppercase tracking-wide">BMI Calculator</h1>

      {!showResult ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Form */}
          <form onSubmit={calculateBMI} className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Họ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Tuổi</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Chiều cao (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Cân nặng (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-orange-500 bg-transparent"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-400 bg-transparent focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105"
              >
                Tính BMI
              </button>
            </div>
          </form>

          {/* Image */}
          <div className="hidden md:block">
            <Image src={image_gym2} alt="Gym" className="w-full h-auto object-contain rounded-xl" />
          </div>
        </div>
      ) : (
        <BMIResult
          bmi={bmi!}
          category={category}
          name={name}
          age={age}
          height={height}
          weight={weight}
          gender={gender}
          onBack={handleBack}
        />
      )}
    </section>
  );
};

export default Calculator;
