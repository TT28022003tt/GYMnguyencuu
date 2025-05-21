"use client";

import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface MembershipDetailModalProps {
  userId: number; // Thay memberId bằng userId
  isOpen: boolean;
  onClose: () => void;
}

interface Membership {
  idMaHV: number;
  memberName: string | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  registrationDate: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  trainerName: string | null;
  trainerCertificate: string | null;
  trainerDegree: string | null;
  trainerSpecialization: string | null;
  packageName: string | null;
  packageType: string | null;
  packagePrice: string | null;
  packageDuration: number | null;
  packageTotalPrice: string | null;
  packageStartDate: string | null;
  packageEndDate: string | null;
  packageStatus: string | null;
}

const MembershipDetailModal: React.FC<MembershipDetailModalProps> = ({ userId, isOpen, onClose }) => {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMembership = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/membership/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin hội viên");
        }

        const data = await response.json();
        setMembership(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-lg w-full">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !membership) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-orange-400 hover:text-orange-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <p className="text-red-500">{error || "Hội viên không tồn tại"}</p>
          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition mt-4"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-orange-400 hover:text-orange-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Chi Tiết Hội Viên</h2>

        {/* Member Info */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-orange-400 mb-2">Thông Tin Cá Nhân</h3>
          <div className="flex items-center mb-4">
            <Image
              src={membership.photo || "/images/default-avatar.png"}
              alt={membership.memberName || "N/A"}
              width={60}
              height={60}
              className="w-15 h-15 rounded-full object-cover mr-3"
            />
            <div>
              <h4 className="text-lg font-semibold">{membership.memberName || "N/A"}</h4>
              <p className="text-sm text-gray-400">Email: {membership.email || "N/A"}</p>
              <p className="text-sm text-gray-400">Số điện thoại: {membership.phone || "N/A"}</p>
              <p className="text-sm text-gray-400">
                Ngày sinh:{" "}
                {membership.birthDate
                  ? new Date(membership.birthDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-400">Giới tính: {membership.gender || "N/A"}</p>
              <p className="text-sm text-gray-400">Địa chỉ: {membership.address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Trainer Info */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-orange-400 mb-2">Thông Tin Huấn Luyện Viên</h3>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Tên:</span>{" "}
            {membership.trainerName || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Chứng chỉ:</span>{" "}
            {membership.trainerCertificate || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Bằng cấp:</span>{" "}
            {membership.trainerDegree || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Chuyên môn:</span>{" "}
            {membership.trainerSpecialization || "N/A"}
          </p>
        </div>

        {/* Package Info */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-orange-400 mb-2">Thông Tin Gói Tập</h3>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Tên gói:</span>{" "}
            {membership.packageName || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Loại gói:</span>{" "}
            {membership.packageType || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Giá gói:</span>{" "}
            {membership.packagePrice || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Thời gian (tháng):</span>{" "}
            {membership.packageDuration || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Tổng tiền:</span>{" "}
            {membership.packageTotalPrice || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Ngày bắt đầu:</span>{" "}
            {membership.packageStartDate
              ? new Date(membership.packageStartDate).toLocaleString("vi-VN")
              : "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Ngày hết hạn:</span>{" "}
            {membership.packageEndDate
              ? new Date(membership.packageEndDate).toLocaleString("vi-VN")
              : "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium text-orange-400">Trạng thái:</span>{" "}
            {membership.packageStatus || "N/A"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default MembershipDetailModal;