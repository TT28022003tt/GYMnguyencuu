"use client";
import React, { useState, useEffect } from "react";
import FormSetting from "@/app/components/FormSetting";
import Image from "next/image";
import { useMyContext } from "@/contexts/useContext";

interface UserData {
  idUser: number;
  Ten: string;
  NgaySinh?: string;
  GioiTinh?: number;
  DiaChi?: string;
  SoDienThoai: string;
  Email: string;
  Anh?: string;
}

const Profile: React.FC = () => {
  const { user } = useMyContext();
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/acc", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Không thể lấy dữ liệu người dùng");
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const openSetting = () => {
    setIsSettingOpen(true);
  };

  const closeSetting = () => {
    setIsSettingOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">Hồ Sơ Người Dùng</h1>
        {loading ? (
          <p className="text-gray-600 text-center">Đang tải...</p>
        ) : userData ? (
          <div className="flex flex-col items-center space-y-4">
            <Image
              src={userData.Anh || "/default-avatar.png"}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover mb-4"
            />
            <p className="text-lg font-semibold text-gray-800">Tên: {userData.Ten}</p>
            <p className="text-gray-600">Email: {userData.Email}</p>
            <p className="text-gray-600">Số điện thoại: {userData.SoDienThoai}</p>
            <p className="text-gray-600">
              Giới tính: {userData.GioiTinh === 1 ? "Nam" : userData.GioiTinh === 0 ? "Nữ" : "Chưa xác định"}
            </p>
            <p className="text-gray-600">Ngày sinh: {userData.NgaySinh || "Chưa cập nhật"}</p>
            <p className="text-gray-600">Địa chỉ: {userData.DiaChi || "Chưa cập nhật"}</p>
            <button
              onClick={openSetting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
            >
              Chỉnh Sửa Hồ Sơ
            </button>
          </div>
        ) : (
          <p className="text-red-600 text-center">Không thể tải dữ liệu người dùng</p>
        )}
      </div>

      {isSettingOpen && <FormSetting onClose={closeSetting} userData={userData||undefined} />}
    </div>
  );
};

export default Profile;