"use client"

import { useState } from 'react';

interface BasicMetricsForm {
  Height: string;
  Weight: string;
  Chest: string;
  Waist: string;
  hips: string;
  Arm: string;
  Thigh: string;
  Calf: string;
  Mota: string;
}

interface AdvancedMetricsForm {
  BodyFatPercent: string;
  MuscleMass: string;
  VisceralFat: string;
  BasalMetabolicRate: string;
  BoneMass: string;
  WaterPercent: string;
  Mota: string;
}

export default function InputUser() {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [basicFormData, setBasicFormData] = useState<BasicMetricsForm>({
    Height: '',
    Weight: '',
    Chest: '',
    Waist: '',
    hips: '',
    Arm: '',
    Thigh: '',
    Calf: '',
    Mota: '',
  });
  const [advancedFormData, setAdvancedFormData] = useState<AdvancedMetricsForm>({
    BodyFatPercent: '',
    MuscleMass: '',
    VisceralFat: '',
    BasalMetabolicRate: '',
    BoneMass: '',
    WaterPercent: '',
    Mota: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleBasicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBasicFormData({ ...basicFormData, [name]: value });
  };

  const handleAdvancedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdvancedFormData({ ...advancedFormData, [name]: value });
  };

  const calculateBMI = (height: string, weight: string): number | null => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / ((h / 100) ** 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'basic') {
      // Kiểm tra dữ liệu cơ bản
      if (!basicFormData.Height || !basicFormData.Weight) {
        setError('Chiều cao và cân nặng là bắt buộc.');
        return;
      }

      try {
        const bmi = calculateBMI(basicFormData.Height, basicFormData.Weight);
        const payload = {
          idMaHV: 1, // Thay bằng idMaHV thực tế từ auth
          Height: parseFloat(basicFormData.Height) || null,
          Weight: parseFloat(basicFormData.Weight) || null,
          Chest: parseFloat(basicFormData.Chest) || null,
          Waist: parseFloat(basicFormData.Waist) || null,
          hips: parseFloat(basicFormData.hips) || null,
          Arm: parseFloat(basicFormData.Arm) || null,
          Thigh: parseFloat(basicFormData.Thigh) || null,
          Calf: parseFloat(basicFormData.Calf) || null,
          BMI: bmi ? parseFloat(bmi.toFixed(2)) : null,
          Mota: basicFormData.Mota || null,
        };

        const response = await fetch('/api/basicmetrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Không thể lưu chỉ số cơ bản');
        setSuccess('Lưu chỉ số cơ bản thành công!');
        setBasicFormData({
          Height: '',
          Weight: '',
          Chest: '',
          Waist: '',
          hips: '',
          Arm: '',
          Thigh: '',
          Calf: '',
          Mota: '',
        });
      } catch (err: any) {
        setError('Lỗi khi lưu chỉ số cơ bản: ' + err.message);
      }
    } else {
      // Kiểm tra dữ liệu nâng cao (ít nhất một trường phải có giá trị)
      const hasAdvancedData = Object.values(advancedFormData).some(
        (value) => value && value !== advancedFormData.Mota
      );
      if (!hasAdvancedData) {
        setError('Vui lòng nhập ít nhất một chỉ số nâng cao.');
        return;
      }

      try {
        const payload = {
          idMaHV: 1, // Thay bằng idMaHV thực tế từ auth
          BodyFatPercent: parseFloat(advancedFormData.BodyFatPercent) || null,
          MuscleMass: parseFloat(advancedFormData.MuscleMass) || null,
          VisceralFat: parseFloat(advancedFormData.VisceralFat) || null,
          BasalMetabolicRate: parseFloat(advancedFormData.BasalMetabolicRate) || null,
          BoneMass: parseFloat(advancedFormData.BoneMass) || null,
          WaterPercent: parseFloat(advancedFormData.WaterPercent) || null,
          Mota: advancedFormData.Mota || null,
        };

        const response = await fetch('/api/advancedmetrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Không thể lưu chỉ số nâng cao');
        setSuccess('Lưu chỉ số nâng cao thành công!');
        setAdvancedFormData({
          BodyFatPercent: '',
          MuscleMass: '',
          VisceralFat: '',
          BasalMetabolicRate: '',
          BoneMass: '',
          WaterPercent: '',
          Mota: '',
        });
      } catch (err: any) {
        setError('Lỗi khi lưu chỉ số nâng cao: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Nhập Chỉ Số Cơ Thể</h1>

        {/* Chọn chế độ */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn chế độ nhập
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'basic' | 'advanced')}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="basic">Cơ bản (Chiều cao, Cân nặng, Các vòng)</option>
            <option value="advanced">Nâng cao (Chỉ số InBody)</option>
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'basic' ? (
            <>
              {/* Các trường cơ bản */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Chiều cao (cm)</label>
                <input
                  type="number"
                  name="Height"
                  value={basicFormData.Height}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring

-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 170"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
                <input
                  type="number"
                  name="Weight"
                  value={basicFormData.Weight}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 70"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng ngực (cm)</label>
                <input
                  type="number"
                  name="Chest"
                  value={basicFormData.Chest}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 90"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng eo (cm)</label>
                <input
                  type="number"
                  name="Waist"
                  value={basicFormData.Waist}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 70"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng mông (cm)</label>
                <input
                  type="number"
                  name="hips"
                  value={basicFormData.hips}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 95"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng bắp tay (cm)</label>
                <input
                  type="number"
                  name="Arm"
                  value={basicFormData.Arm}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 30"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng đùi (cm)</label>
                <input
                  type="number"
                  name="Thigh"
                  value={basicFormData.Thigh}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 50"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Vòng bắp chân (cm)</label>
                <input
                  type="number"
                  name="Calf"
                  value={basicFormData.Calf}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 35"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mô tả (tùy chọn)</label>
                <textarea
                  name="Mota"
                  value={basicFormData.Mota}
                  onChange={handleBasicInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả thêm"
                ></textarea>
              </div>
            </>
          ) : (
            <>
              {/* Các trường nâng cao */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">% Mỡ cơ thể</label>
                <input
                  type="number"
                  name="BodyFatPercent"
                  value={advancedFormData.BodyFatPercent}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 15"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Khối cơ (kg)</label>
                <input
                  type="number"
                  name="MuscleMass"
                  value={advancedFormData.MuscleMass}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 30"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mỡ nội tạng</label>
                <input
                  type="number"
                  name="VisceralFat"
                  value={advancedFormData.VisceralFat}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 10"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tỷ lệ trao đổi chất cơ bản (kcal)
                </label>
                <input
                  type="number"
                  name="BasalMetabolicRate"
                  value={advancedFormData.BasalMetabolicRate}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 1500"
                  step="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Khối lượng xương (kg)
                </label>
                <input
                  type="number"
                  name="BoneMass"
                  value={advancedFormData.BoneMass}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 2.5"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">% Nước cơ thể</label>
                <input
                  type="number"
                  name="WaterPercent"
                  value={advancedFormData.WaterPercent}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 60"
                  step="0.1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mô tả (tùy chọn)</label>
                <textarea
                  name="Mota"
                  value={advancedFormData.Mota}
                  onChange={handleAdvancedInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả thêm"
                ></textarea>
              </div>
            </>
          )}

          {/* Thông báo */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          {/* Nút gửi */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Lưu Chỉ Số
          </button>
        </form>
      </div>
    </div>
  );
}