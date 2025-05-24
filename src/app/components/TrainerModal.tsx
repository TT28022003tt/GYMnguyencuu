"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type TrainerDetail = {
  idMaHLV: number;
  ten: string;
  ngaySinh: string;
  gioiTinh: number;
  diaChi: string | null;
  soDienThoai: string | null;
  email: string;
  chungChi: string | null;
  bangCap: string | null;
  chuyenMon: string | null;
  luong: number | null;
  photo: string;
  classes: {
    idMaLH: number;
    ten: string;
    phong: string | null;
    theLoai: string | null;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    thoiLuong: number | null;
    soLuongMax: number | null;
    phi: number | null;
    trangThai: string | null;
    schedules: { thu: number; gioBatDau: string }[];
  }[];
  schedules: {
    maLT: number;
    ngayGioBatDau: string;
    ngayGioKetThuc: string;
    ghiChu: string | null;
    tinhTrang: string | null;
  }[];
};

interface TrainerModalProps {
  trainerId: number;
  isOpen: boolean;
  onClose: () => void;
}

const TrainerModal = ({ trainerId, isOpen, onClose }: TrainerModalProps) => {
  const [trainerDetail, setTrainerDetail] = useState<TrainerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTrainerDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/trainer/${trainerId}`);
        if (res.ok) {
          const data = await res.json();
          setTrainerDetail(data);
        } else {
          console.error("Lỗi khi lấy chi tiết huấn luyện viên");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerDetail();
  }, [trainerId, isOpen]);

  if (!isOpen) return null;

  const getDayName = (thu: number) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[thu - 1] || "N/A";
  };

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
          <h2 className="text-2xl font-semibold text-orange-400">Chi Tiết Huấn Luyện Viên</h2>
          <button onClick={onClose} className="text-orange-400 hover descended hover:text-orange-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : !trainerDetail ? (
          <div className="text-center text-white">Không tìm thấy huấn luyện viên</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={trainerDetail.photo}
                alt={trainerDetail.ten}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{trainerDetail.ten}</h3>
                <p className="text-sm text-gray-300">Email: {trainerDetail.email}</p>
                <p className="text-sm text-gray-300">Số điện thoại: {trainerDetail.soDienThoai || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Ngày sinh:</span>{" "}
                  {trainerDetail.ngaySinh
                    ? new Date(trainerDetail.ngaySinh).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Giới tính:</span>{" "}
                  {trainerDetail.gioiTinh === 1 ? "Nam" : "Nữ"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Địa chỉ:</span> {trainerDetail.diaChi || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Chứng chỉ:</span> {trainerDetail.chungChi || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Bằng cấp:</span> {trainerDetail.bangCap || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Chuyên môn:</span> {trainerDetail.chuyenMon || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Lương:</span>{" "}
                  {trainerDetail.luong?.toLocaleString("vi-VN") || "N/A"} VND
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Danh sách lớp học:</p>
              {trainerDetail.classes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="py-2 px-4 text-left">Mã Lớp</th>
                        <th className="py-2 px-4 text-left">Tên Lớp</th>
                        <th className="py-2 px-4 text-left">Phòng</th>
                        <th className="py-2 px-4 text-left">Thể Loại</th>
                        <th className="py-2 px-4 text-left">Bắt Đầu</th>
                        <th className="py-2 px-4 text-left">Kết Thúc</th>
                        <th className="py-2 px-4 text-left">Phí</th>
                        <th className="py-2 px-4 text-left">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainerDetail.classes.map((classItem) => (
                        <tr key={classItem.idMaLH} className="border-b border-gray-700">
                          <td className="py-2 px-4">{classItem.idMaLH}</td>
                          <td className="py-2 px-4">{classItem.ten}</td>
                          <td className="py-2 px-4">{classItem.phong || "N/A"}</td>
                          <td className="py-2 px-4">{classItem.theLoai || "N/A"}</td>
                          <td className="py-2 px-4">
                            {new Date(classItem.thoiGianBatDau).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-2 px-4">
                            {new Date(classItem.thoiGianKetThuc).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-2 px-4">
                            {classItem.phi?.toLocaleString("vi-VN") || "N/A"} VND
                          </td>
                          <td className="py-2 px-4">{classItem.trangThai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-300">Chưa có lớp học</p>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Lịch tập cá nhân:</p>
              {trainerDetail.schedules.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trainerDetail.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {new Date(schedule.ngayGioBatDau).toLocaleString("vi-VN")} -{" "}
                      {new Date(schedule.ngayGioKetThuc).toLocaleString("vi-VN")} (
                      {schedule.tinhTrang})
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300">Chưa có lịch tập cá nhân</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TrainerModal;