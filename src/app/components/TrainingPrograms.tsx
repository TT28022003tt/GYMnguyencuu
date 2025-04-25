'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import FormModal from './FormModal';
import TableSearch from './TableSearch';
import { useMyContext } from '@/contexts/useContext';
import { useMetrics } from '@/contexts/MetricsContext';

interface ChiTietMucTieu {
  idChiTietMucTieu: number;
  ThoiGian: string;
  MoTa: string;
}

interface ChuongTrinhTap {
  idChuongTrinhTap: number;
  TenCTT: string;
  MucTieu: string;
  ThoiGian: string;
  MaHV: number;
  chitietmuctieu: ChiTietMucTieu[];
}

export default function TrainingPrograms() {
  const { user } = useMyContext();
  const { setIsChatOpen } = useMetrics();
  const [trainingPlans, setTrainingPlans] = useState<ChuongTrinhTap[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<ChuongTrinhTap[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch('/api/TraniningPlans', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu chương trình tập');
      }

      const data: ChuongTrinhTap[] = await response.json();
      setTrainingPlans(data);
      setFilteredPlans(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingPlans();
  }, []);

  // Lắng nghe sự kiện làm mới từ ChatWidget
  useEffect(() => {
    const handleRefresh = () => {
      fetchTrainingPlans();
    };
    window.addEventListener('refreshTrainingPrograms', handleRefresh);
    return () => {
      window.removeEventListener('refreshTrainingPrograms', handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPlans(trainingPlans);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = trainingPlans.filter((plan) => {
        const matchesPlan =
          plan.TenCTT.toLowerCase().includes(lowerQuery) ||
          plan.MucTieu.toLowerCase().includes(lowerQuery) ||
          plan.ThoiGian.toLowerCase().includes(lowerQuery);

        const matchesDetails = plan.chitietmuctieu.some(
          (detail) =>
            detail.ThoiGian.toLowerCase().includes(lowerQuery) ||
            detail.MoTa.toLowerCase().includes(lowerQuery)
        );

        return matchesPlan || matchesDetails;
      });
      setFilteredPlans(filtered);
    }
  }, [searchQuery, trainingPlans]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateFromAI = () => {
    setIsChatOpen(true);
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
    <div className="p-6 flex flex-col justify-start items-center min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-purple"
      >
        CHƯƠNG TRÌNH TẬP
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 w-full max-w-6xl"
      >
        {/* <TableSearch onSearch={handleSearch} /> */}
        <div className="flex items-center gap-4 self-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
          >
            <FontAwesomeIcon icon={faFilter} className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-full font-semibold"
            onClick={handleCreateFromAI}
          >
            <FontAwesomeIcon icon={faComments} className="w-5 h-5" />
            Tạo từ AI
          </motion.button>
          <FormModal
            table="training"
            type="create"
            customButton={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-gray-600" />
              </motion.button>
            }
          />
        </div>
      </motion.div>

      <div className="w-full max-w-6xl">
        <ul className="steps steps-vertical lg:steps-horizontal mb-8">
          <li className="step step-primary">Chưa Được</li>
          <li className="step step-primary">Cũng Cũng</li>
          <li className="step">Ngon</li>
          <li className="step">Xiu MLEMMLEM</li>
        </ul>
        <AnimatePresence mode="wait">
          {filteredPlans.length === 0 ? (
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
                  Chưa có chương trình tập! Hãy bắt đầu tạo chương trình!
                </p>
                <FormModal
                  table="training"
                  type="create"
                  onSuccess={fetchTrainingPlans}
                  customButton={
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-full text-white font-semibold bg-primary-blue hover:bg-blue-700"
                    >
                      Thêm Chương Trình Ngay
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
              className="grid grid-cols-1 gap-6"
            >
              {filteredPlans.map((plan, index) => (
                <motion.div
                  key={plan.idChuongTrinhTap}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent bg-gradient-to-r from-primary-blue/10 to-primary-purple/10 relative"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {index + 1}. {plan.TenCTT}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p>
                      <strong>Mục tiêu:</strong> {plan.MucTieu || 'Chưa có mục tiêu'}
                    </p>
                    <p>
                      <strong>Thời gian:</strong> {plan.ThoiGian || 'Chưa xác định'}
                    </p>
                    <div className="sm:col-span-2">
                      <strong>Chi tiết mục tiêu:</strong>
                      <ul className="list-disc pl-5 mt-2">
                        {Array.isArray(plan.chitietmuctieu) && plan.chitietmuctieu.length > 0 ? (
                          plan.chitietmuctieu.map((detail) => (
                            <li key={detail.idChiTietMucTieu} className="mb-1">
                              <strong>{detail.ThoiGian}:</strong> {detail.MoTa}
                            </li>
                          ))
                        ) : (
                          <li>Chưa có chi tiết mục tiêu</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <FormModal
                      table="training"
                      type="update"
                      data={{
                        idChuongTrinhTap: plan.idChuongTrinhTap,
                        TenCTT: plan.TenCTT || '',
                        MucTieu: plan.MucTieu || '',
                        ThoiGian: plan.ThoiGian || '',
                        MaHV: plan.MaHV || 1,
                        chiTietMucTieu: plan.chitietmuctieu?.map((d) => ({
                          idChiTietMucTieu: d.idChiTietMucTieu,
                          ThoiGian: d.ThoiGian || '',
                          MoTa: d.MoTa || '',
                        })) || [],
                      }}
                    />
                    <FormModal
                      table="training"
                      type="delete"
                      id={plan.idChuongTrinhTap}
                      onSuccess={fetchTrainingPlans}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}