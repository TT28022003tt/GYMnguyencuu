'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faComments } from '@fortawesome/free-solid-svg-icons'; // Thêm icon chat
import { useMyContext } from '@/contexts/useContext';
import { useMetrics } from '@/contexts/MetricsContext'; // Thêm context
import FormModal from '@/app/components/FormModal';
import BasicMetricsForm from '@/app/components/forms/BasicMetricsForm';
import AdvancedMetricsForm from '@/app/components/forms/AdvancedMetricsForm';

interface BasicMetrics {
  idBasicMetrics: number;
  idMaHV: number;
  Height: number | null;
  Weight: number | null;
  BMI: number | null;
  Chest: number | null;
  Waist: number | null;
  hips: number | null;
  Arm: number | null;
  Thigh: number | null;
  Calf: number | null;
  Mota: string | null;
  Ten: string;
}

interface AdvancedMetrics {
  idAdvancedMetrics: number;
  idMaHV: number;
  BodyFatPercent: number | null;
  MuscleMass: number | null;
  VisceralFat: number | null;
  BasalMetabolicRate: number | null;
  BoneMass: number | null;
  WaterPercent: number | null;
  Mota: string | null;
  Ten: string;
}

export default function BodyUser() {
  const { user } = useMyContext();
  const { setSelectedMetrics, setIsChatOpen } = useMetrics(); // Thêm useMetrics
  const [basicMetrics, setBasicMetrics] = useState<BasicMetrics[]>([]);
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'basic' | 'advanced'>('basic');

  const fetchMetrics = async () => {
    try {
      const [basicResponse, advancedResponse] = await Promise.all([
        fetch('/api/basicmetrics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }),
        fetch('/api/advancedmetrics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }),
      ]);

      if (!basicResponse.ok) {
        const errorData = await basicResponse.json();
        throw new Error(`Lỗi basicmetrics: ${errorData.error || 'Không thể lấy dữ liệu'}`);
      }
      if (!advancedResponse.ok) {
        const errorData = await advancedResponse.json();
        throw new Error(`Lỗi advancedmetrics: ${errorData.error || 'Không thể lấy dữ liệu'}`);
      }

      const basicData: BasicMetrics[] = await basicResponse.json();
      const advancedData: AdvancedMetrics[] = await advancedResponse.json();
      setBasicMetrics(basicData);
      setAdvancedMetrics(advancedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Hàm xử lý khi nhấn nút Tư vấn
  const handleConsult = (type: 'basic' | 'advanced', data: BasicMetrics | AdvancedMetrics) => {
    setSelectedMetrics({ type, data });
    setIsChatOpen(true); // Mở chatbox
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-t-4 border-primary-blue rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 bg-red-100 p-4 rounded-lg shadow-lg"
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-purple"
      >
        CHỈ SỐ CƠ THỂ
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 mb-10"
      >
        <div className="flex gap-3 bg-white p-2 rounded-full shadow-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeMode === 'basic'
                ? 'bg-primary-blue text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => setActiveMode('basic')}
          >
            Chỉ Số Cơ Bản
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeMode === 'advanced'
                ? 'bg-primary-purple text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => setActiveMode('advanced')}
          >
            Chỉ Số Nâng Cao
          </motion.button>
        </div>

        <FormModal
          table={activeMode === 'basic' ? 'basicmetrics' : 'advancedmetrics'}
          type="create"
          onSuccess={fetchMetrics}
          customButton={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold shadow-xl transition-all duration-300 ${
                activeMode === 'basic' ? 'bg-primary-blue' : 'bg-primary-purple'
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
              <span>Thêm Chỉ Số</span>
            </motion.button>
          }
        />
      </motion.div>

      <div className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {(activeMode === 'basic' && basicMetrics.length === 0) ||
          (activeMode === 'advanced' && advancedMetrics.length === 0) ? (
            <motion.div
              key="no-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto"
              >
                <Image
                  src="/images/gym-placeholder.png"
                  alt="Gym Placeholder"
                  width={250}
                  height={250}
                  className="mx-auto mb-6"
                />
                <p className="text-gray-600 text-lg font-medium mb-6">
                  Chưa có chỉ số cơ thể! Hãy bắt đầu theo dõi chỉ số!
                </p>
                <FormModal
                  table={activeMode === 'basic' ? 'basicmetrics' : 'advancedmetrics'}
                  type="create"
                  onSuccess={fetchMetrics}
                  customButton={
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full text-white font-semibold ${
                        activeMode === 'basic' ? 'bg-primary-blue' : 'bg-primary-purple'
                      }`}
                    >
                      Thêm Chỉ Số Ngay
                    </motion.button>
                  }
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeMode === 'basic' ? (
                <>
                  <h2 className="text-2xl font-semibold mb-8 text-gray-800">Chỉ Số Cơ Bản</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {basicMetrics.map((metric) => (
                      <motion.div
                        key={metric.idBasicMetrics}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 relative"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Chỉ Số của {metric.Ten}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <p>
                            <strong>Chiều cao:</strong>{' '}
                            {metric.Height ? `${metric.Height} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Cân nặng:</strong>{' '}
                            {metric.Weight ? `${metric.Weight} kg` : 'N/A'}
                          </p>
                          <p>
                            <strong>BMI:</strong> {metric.BMI ? metric.BMI.toFixed(2) : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng ngực:</strong>{' '}
                            {metric.Chest ? `${metric.Chest} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng eo:</strong>{' '}
                            {metric.Waist ? `${metric.Waist} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng mông:</strong>{' '}
                            {metric.hips ? `${metric.hips} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng bắp tay:</strong>{' '}
                            {metric.Arm ? `${metric.Arm} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng đùi:</strong>{' '}
                            {metric.Thigh ? `${metric.Thigh} cm` : 'N/A'}
                          </p>
                          <p>
                            <strong>Vòng bắp chân:</strong>{' '}
                            {metric.Calf ? `${metric.Calf} cm` : 'N/A'}
                          </p>
                          <p className="sm:col-span-2">
                            <strong>Mô tả:</strong> {metric.Mota || 'Không có mô tả'}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary-blue text-white rounded-full font-semibold flex items-center gap-2"
                            onClick={() => handleConsult('basic', metric)}
                          >
                            <FontAwesomeIcon icon={faComments} className="w-4 h-4" />
                            Tư vấn
                          </motion.button>
                          <FormModal
                            table="basicmetrics"
                            type="update"
                            data={{
                              idBasicMetrics: metric.idBasicMetrics,
                              idMaHV: metric.idMaHV,
                              Height: metric.Height || 0,
                              Weight: metric.Weight || 0,
                              Chest: metric.Chest || 0,
                              Waist: metric.Waist || 0,
                              hips: metric.hips || 0,
                              Arm: metric.Arm || 0,
                              Thigh: metric.Thigh || 0,
                              Calf: metric.Calf || 0,
                              Mota: metric.Mota || '',
                              Ten: metric.Ten,
                            }}
                            onSuccess={fetchMetrics}
                          />
                          <FormModal
                            table="basicmetrics"
                            type="delete"
                            id={metric.idBasicMetrics}
                            onSuccess={fetchMetrics}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-8 text-gray-800">Chỉ Số Nâng Cao</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {advancedMetrics.map((metric) => (
                      <motion.div
                        key={metric.idAdvancedMetrics}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 relative"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Chỉ Số của {metric.Ten}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <p>
                            <strong>% Mỡ cơ thể:</strong>{' '}
                            {metric.BodyFatPercent ? `${metric.BodyFatPercent}%` : 'N/A'}
                          </p>
                          <p>
                            <strong>Khối cơ:</strong>{' '}
                            {metric.MuscleMass ? `${metric.MuscleMass} kg` : 'N/A'}
                          </p>
                          <p>
                            <strong>Mỡ nội tạng:</strong>{' '}
                            {metric.VisceralFat ? metric.VisceralFat : 'N/A'}
                          </p>
                          <p>
                            <strong>Tỷ lệ trao đổi chất:</strong>{' '}
                            {metric.BasalMetabolicRate ? `${metric.BasalMetabolicRate} kcal` : 'N/A'}
                          </p>
                          <p>
                            <strong>Khối lượng xương:</strong>{' '}
                            {metric.BoneMass ? `${metric.BoneMass} kg` : 'N/A'}
                          </p>
                          <p>
                            <strong>% Nước cơ thể:</strong>{' '}
                            {metric.WaterPercent ? `${metric.WaterPercent}%` : 'N/A'}
                          </p>
                          <p className="sm:col-span-2">
                            <strong>Mô tả:</strong> {metric.Mota || 'Không có mô tả'}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary-purple text-white rounded-full font-semibold flex items-center gap-2"
                            onClick={() => handleConsult('advanced', metric)}
                          >
                            <FontAwesomeIcon icon={faComments} className="w-4 h-4" />
                            Tư vấn
                          </motion.button>
                          <FormModal
                            table="advancedmetrics"
                            type="update"
                            data={{
                              idAdvancedMetrics: metric.idAdvancedMetrics,
                              idMaHV: metric.idMaHV,
                              BodyFatPercent: metric.BodyFatPercent || 0,
                              MuscleMass: metric.MuscleMass || 0,
                              VisceralFat: metric.VisceralFat || 0,
                              BasalMetabolicRate: metric.BasalMetabolicRate || 0,
                              BoneMass: metric.BoneMass || 0,
                              WaterPercent: metric.WaterPercent || 0,
                              Mota: metric.Mota || '',
                              Ten: metric.Ten,
                            }}
                            onSuccess={fetchMetrics}
                          />
                          <FormModal
                            table="advancedmetrics"
                            type="delete"
                            id={metric.idAdvancedMetrics}
                            onSuccess={fetchMetrics}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}