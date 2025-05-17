"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type ClassDetail = {
  id: number;
  className: string;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  location: string;
  trainerName: string;
  trainerEmail: string;
  photo: string;
  currentStudents: number;
  maxStudents: number;
  fee: string;
  type: string;
  status: string;
  description: string;
  schedules: { day: number; startTime: string }[];
  students: {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    photo: string;
    registrationDate: string;
  }[];
};

interface ClassDetailModalProps {
  classId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ClassDetailModal = ({ classId, isOpen, onClose }: ClassDetailModalProps) => {
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchClassDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/class/${classId}`);
        if (res.ok) {
          const data = await res.json();
          setClassDetail(data);
        } else {
          console.error("Lỗi khi lấy chi tiết lớp học");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [classId, isOpen]);

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
          <h2 className="text-2xl font-semibold text-orange-400">Chi Tiết Lớp Học</h2>
          <button onClick={onClose} className="text-orange-400 hover:text-orange-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : !classDetail ? (
          <div className="text-center text-white">Không tìm thấy lớp học</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={classDetail.photo}
                alt={classDetail.trainerName}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{classDetail.className}</h3>
                <p className="text-sm text-gray-300">Huấn luyện viên: {classDetail.trainerName}</p>
                <p className="text-sm text-gray-300">Email: {classDetail.trainerEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Thể loại:</span> {classDetail.type}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Phòng:</span> {classDetail.location}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Thời lượng:</span> {classDetail.sessionDuration}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Phí:</span> {classDetail.fee}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Bắt đầu:</span>{" "}
                  {new Date(classDetail.startTime).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Kết thúc:</span>{" "}
                  {new Date(classDetail.endTime).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Số học viên:</span>{" "}
                  {classDetail.currentStudents}/{classDetail.maxStudents}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Trạng thái:</span> {classDetail.status}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Mô tả:</p>
              <p className="text-sm text-gray-300">{classDetail.description}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Lịch học:</p>
              <div className="flex flex-wrap gap-2">
                {classDetail.schedules.map((lich, index) => (
                  <span
                    key={index}
                    className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {getDayName(lich.day)} {lich.startTime}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">Danh sách học viên:</p>
              {classDetail.students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="py-2 px-4 text-left">Ảnh</th>
                        <th className="py-2 px-4 text-left">Mã HV</th>
                        <th className="py-2 px-4 text-left">Tên</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">SĐT</th>
                        <th className="py-2 px-4 text-left">Ngày Sinh</th>
                        <th className="py-2 px-4 text-left">Giới Tính</th>
                        <th className="py-2 px-4 text-left">Ngày ĐK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classDetail.students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-700">
                          <td className="py-2 px-4">
                            <Image
                              src={student.photo}
                              alt={student.name}
                              width={30}
                              height={30}
                              className="rounded-full object-cover"
                            />
                          </td>
                          <td className="py-2 px-4">{student.id}</td>
                          <td className="py-2 px-4">{student.name}</td>
                          <td className="py-2 px-4">{student.email}</td>
                          <td className="py-2 px-4">{student.phone}</td>
                          <td className="py-2 px-4">
                            {new Date(student.birthDate).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-2 px-4">{student.gender}</td>
                          <td className="py-2 px-4">
                            {new Date(student.registrationDate).toLocaleDateString("vi-VN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-300">Chưa có học viên đăng ký</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ClassDetailModal;