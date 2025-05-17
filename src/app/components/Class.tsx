"use client";

import { useState, useEffect } from "react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useMyContext } from "@/contexts/context";

interface Class {
  idMaLH: number;
  Ten: string | null;
  TheLoai: string | null;
  Phong: string | null;
  ThoiGianBatDau: string | null;
  ThoiGianKetThuc: string | null;
  Phi: number | null;
  SoLuong: number;
  SoLuongMax: number | null;
  TrangThai: string | null;
  huanluyenvien: { user: { Ten: string | null } } | null;
  lichlophoc: { Thu: number | null; GioBatDau: string | null }[];
}

const Class = () => {
  const { user } = useMyContext();
  const userId = user?.id ?? null;
  const [classes, setClasses] = useState<Class[]>([]);
  const [registeredClasses, setRegisteredClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const classRes = await fetch("/api/class");
        const classData = await classRes.json();
        setClasses(classData);

        const registeredRes = await fetch(`/api/class?userId=${userId}`);
        const registeredData = await registeredRes.json();
        setRegisteredClasses(registeredData);
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Handle class registration
  const handleRegister = async (classId: number) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đăng ký!");
      return;
    }

    try {
      const res = await fetch("/api/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idLopHoc: classId, idHocVien: userId }),
      });

      if (res.ok) {
        const { updatedClasses, updatedRegisteredClasses } = await res.json();
        setClasses(updatedClasses);
        setRegisteredClasses(updatedRegisteredClasses);
        toast.success("Đăng ký lớp học thành công!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  // Handle class cancellation
  const handleCancel = async (classId: number) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để hủy đăng ký!");
      return;
    }

    if (window.confirm("Bạn có chắc muốn hủy đăng ký lớp học này?")) {
      try {
        const res = await fetch(`/api/class/${classId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idHocVien: userId }),
        });

        if (res.ok) {
          const { updatedClasses, updatedRegisteredClasses } = await res.json();
          setClasses(updatedClasses);
          setRegisteredClasses(updatedRegisteredClasses);
          toast.success("Hủy đăng ký thành công!");
        } else {
          const error = await res.json();
          toast.error(error.error || "Hủy đăng ký thất bại");
        }
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi");
      }
    }
  };

  // Convert Thu to Vietnamese day
  const getDayName = (thu: number | null) => {
    if (!thu) return "";
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[thu - 1] || "";
  };

  if (loading) {
    return (
      <div className="text-center p-4 text-white bg-gray-900 min-h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {/* Available Classes */}
      <h1 className="text-4xl font-extrabold text-orange-400 mb-10 tracking-tight">
        Khám Phá Lớp Học
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <AnimatePresence>
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <motion.div
                key={classItem.idMaLH}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-800 to-gray-700 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-orange-400 mb-4">{classItem.Ten || "N/A"}</h2>
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Thể Loại:</span> {classItem.TheLoai || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Phòng:</span> {classItem.Phong || "N/A"}
                  </p>
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Lịch:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {classItem.lichlophoc.map((lich, index) => (
                        <span
                          key={index}
                          className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {getDayName(lich.Thu)} {lich.GioBatDau}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Bắt Đầu:</span>{" "}
                    {classItem.ThoiGianBatDau
                      ? new Date(classItem.ThoiGianBatDau).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Kết Thúc:</span>{" "}
                    {classItem.ThoiGianKetThuc
                      ? new Date(classItem.ThoiGianKetThuc).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Phí:</span>{" "}
                    {classItem.Phi ? `${classItem.Phi.toLocaleString("vi-VN")} VND` : "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Số Lượng:</span>{" "}
                    {classItem.SoLuong}/{classItem.SoLuongMax || 0}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Huấn Luyện Viên:</span>{" "}
                    {classItem.huanluyenvien?.user?.Ten || "N/A"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRegister(classItem.idMaLH)}
                  disabled={classItem.TrangThai !== "Đang mở" || classItem.SoLuong >= classItem.SoLuongMax!}
                  className={`w-full mt-4 p-3 rounded-lg text-white font-semibold transition-all duration-200 ${classItem.TrangThai === "Đang mở" && classItem.SoLuong < classItem.SoLuongMax!
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                  {classItem.TrangThai !== "Đang mở" ? "Đã Đóng" : classItem.SoLuong >= classItem.SoLuongMax! ? "Đầy" : "Đăng Ký"}
                </motion.button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 col-span-3 text-center">Chưa có lớp học nào.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Registered Classes */}
      <h1 className="text-4xl font-extrabold text-orange-400 mb-10 tracking-tight">
        Lớp Học Đã Đăng Ký
      </h1>
      <div className="bg-gray-800 rounded-xl shadow-lg p-8">
        <AnimatePresence>
          {registeredClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {registeredClasses.map((classItem) => (
                <motion.div
                  key={classItem.idMaLH}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-700 text-white p-6 rounded-lg shadow-md relative hover:shadow-xl transition-all"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCancel(classItem.idMaLH)}
                    className="absolute top-4 right-4 text-orange-400 hover:text-orange-600 transition"
                    title="Hủy đăng ký"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                  <h3 className="text-xl font-bold text-orange-400 mb-3">{classItem.Ten || "N/A"}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Thể Loại:</span> {classItem.TheLoai || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Phòng:</span> {classItem.Phong || "N/A"}
                    </p>
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold">Lịch:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {classItem.lichlophoc.map((lich, index) => (
                          <span
                            key={index}
                            className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {getDayName(lich.Thu)} {lich.GioBatDau}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Huấn Luyện Viên:</span>{" "}
                      {classItem.huanluyenvien?.user?.Ten || "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">Bạn chưa đăng ký lớp học nào.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Class;