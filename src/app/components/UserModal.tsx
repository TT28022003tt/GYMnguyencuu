"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type UserDetail = {
  idUser: number;
  ten: string;
  ngaySinh: string | null;
  gioiTinh: number | null;
  diaChi: string | null;
  soDienThoai: string | null;
  email: string | null;
  anh: string | null;
  role: string;
  status: string;
  trainerInfo?: {
    idMaHLV: number;
    chungChi: string | null;
    bangCap: string | null;
    chuyenMon: string | null;
    luong: number | null;
  };
  studentInfo?: {
    idMaHV: number;
    ngayDangKy: string | null;
    maHLV: number | null;
  };
  accountInfo?: {
    tenDangNhap: string | null;
    vaiTro: string | null;
  };
};

interface UserModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal = ({ userId, isOpen, onClose }: UserModalProps) => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserDetail(data);
        } else {
          console.error("Lỗi khi lấy chi tiết người dùng");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, isOpen]);

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
          <h2 className="text-2xl font-semibold text-orange-400">Chi Tiết Người Dùng</h2>
          <button onClick={onClose} className="text-orange-400 hover:text-orange-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white">Đang tải...</div>
        ) : !userDetail ? (
          <div className="text-center text-white">Không tìm thấy người dùng</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={userDetail.anh || "/images/default-avatar.png"}
                alt={userDetail.ten}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{userDetail.ten}</h3>
                <p className="text-sm text-gray-300">Email: {userDetail.email || "N/A"}</p>
                <p className="text-sm text-gray-300">Số điện thoại: {userDetail.soDienThoai || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Ngày sinh:</span>{" "}
                  {userDetail.ngaySinh
                    ? new Date(userDetail.ngaySinh).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Giới tính:</span>{" "}
                  {userDetail.gioiTinh === 1 ? "Nam" : userDetail.gioiTinh === 0 ? "Nữ" : "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Địa chỉ:</span> {userDetail.diaChi || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Vai trò:</span> {userDetail.role}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Trạng thái:</span> {userDetail.status}
                </p>
                {userDetail.accountInfo && (
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Tên đăng nhập:</span>{" "}
                    {userDetail.accountInfo.tenDangNhap || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {userDetail.trainerInfo && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Thông tin huấn luyện viên:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Mã HLV:</span> {userDetail.trainerInfo.idMaHLV}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Chứng chỉ:</span>{" "}
                    {userDetail.trainerInfo.chungChi || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Bằng cấp:</span>{" "}
                    {userDetail.trainerInfo.bangCap || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Chuyên môn:</span>{" "}
                    {userDetail.trainerInfo.chuyenMon || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Lương:</span>{" "}
                    {userDetail.trainerInfo.luong?.toLocaleString("vi-VN") || "N/A"} VND
                  </p>
                </div>
              </div>
            )}

            {userDetail.studentInfo && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-2">Thông tin học viên:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Mã HV:</span> {userDetail.studentInfo.idMaHV}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Ngày đăng ký:</span>{" "}
                    {userDetail.studentInfo.ngayDangKy
                      ? new Date(userDetail.studentInfo.ngayDangKy).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Mã HLV:</span>{" "}
                    {userDetail.studentInfo.maHLV || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserModal;