"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Nutrition {
  idThucDon: number;
  TenThucDon: string;
  SoCalo: number | null;
  NgayBatDau: string;
  customerName: string;
  trainerName: string;
  chiTietThucDon: { idchitietthucdon: number; Ngay: string; buaAn: { idBuaAn: number; TenBua: string; MoTa: string }[] }[];
}

interface NutritionModalProps {
  nutritionId: number;
  isOpen: boolean;
  onClose: () => void;
}

const NutritionModal = ({ nutritionId, isOpen, onClose }: NutritionModalProps) => {
  const [nutrition, setNutrition] = useState<Nutrition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchNutritionDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/healthconsultation/${nutritionId}`);
        if (res.ok) {
          const data = await res.json();
          setNutrition({
            idThucDon: data.idThucDon,
            TenThucDon: data.TenThucDon,
            SoCalo: data.SoCalo,
            NgayBatDau: new Date(data.NgayBatDau).toLocaleDateString("vi-VN"),
            customerName: data.hocvien?.user?.Ten || "N/A",
            trainerName: data.hocvien?.huanluyenvien?.user?.Ten || "N/A",
            chiTietThucDon: data.chitietthucdon?.map((day: any) => ({
              idchitietthucdon: day.idchitietthucdon,
              Ngay: new Date(day.Ngay).toLocaleDateString("vi-VN"),
              buaAn: day.buaan || [],
            })) || [],
          });
        } else {
          console.error("Lỗi khi lấy chi tiết thực đơn");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionDetail();
  }, [nutritionId, isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-orange-400">Chi Tiết Thực Đơn</h2>
          <button onClick={onClose} className="text-orange-400 hover:text-orange-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : !nutrition ? (
          <div className="text-center text-white">Không tìm thấy thực đơn</div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">{nutrition.TenThucDon}</h3>
              <p className="text-sm text-gray-300">Học viên: {nutrition.customerName}</p>
              <p className="text-sm text-gray-300">Huấn luyện viên: {nutrition.trainerName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Số calo:</span> {nutrition.SoCalo || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Ngày bắt đầu:</span> {nutrition.NgayBatDau}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Chi tiết thực đơn:</p>
              {nutrition.chiTietThucDon.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="py-2 px-4 text-left">Ngày</th>
                        <th className="py-2 px-4 text-left">Bữa ăn</th>
                        <th className="py-2 px-4 text-left">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutrition.chiTietThucDon.map((day) =>
                        day.buaAn.map((meal, idx) => (
                          <tr key={`${day.idchitietthucdon}-${idx}`} className="border-b border-gray-700">
                            <td className="py-2 px-4">{idx === 0 ? day.Ngay : ""}</td>
                            <td className="py-2 px-4">{meal.TenBua}</td>
                            <td className="py-2 px-4">{meal.MoTa}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-300">Chưa có chi tiết thực đơn</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NutritionModal;