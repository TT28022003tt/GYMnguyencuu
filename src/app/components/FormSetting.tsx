"use client";
import Image from "next/image";
import React, { useState } from "react";

interface UserData {
  Ten: string;
  NgaySinh?: string;
  GioiTinh?: number;
  DiaChi?: string;
  SoDienThoai: string;
  Email: string;
  Anh?: string;
}

interface FormSettingProps {
  onClose: () => void;
  userData?: UserData;
}

const FormSetting: React.FC<FormSettingProps> = ({ onClose, userData }) => {
  const [formData, setFormData] = useState({
    Ten: userData?.Ten || "",
    NgaySinh: userData?.NgaySinh || "",
    GioiTinh: userData?.GioiTinh !== undefined ? userData.GioiTinh.toString() : "",
    DiaChi: userData?.DiaChi || "",
    SoDienThoai: userData?.SoDienThoai || "",
    Email: userData?.Email || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userData?.Anh || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Ten", formData.Ten);
      formDataToSend.append("NgaySinh", formData.NgaySinh);
      formDataToSend.append("GioiTinh", formData.GioiTinh);
      formDataToSend.append("DiaChi", formData.DiaChi);
      formDataToSend.append("SoDienThoai", formData.SoDienThoai);
      formDataToSend.append("Email", formData.Email);
      if (avatarFile) {
        formDataToSend.append("Anh", avatarFile);
      }

      const response = await fetch("/api/acc", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Cập nhật thất bại");
      alert("Cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl h-[80%] flex shadow-lg overflow-hidden">
        <div className="w-1/3 border-r p-4 flex flex-col items-center">
          <Image
            src={avatarPreview || "/default-avatar.png"}
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full h-80 mb-4 w-auto object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mb-4"
          />
          <h2 className="text-lg font-semibold mb-6">{userData?.Ten || "Người dùng"}</h2>
          <div className="w-full">
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-200 text-blue-500 font-medium">
              Setting
            </button>
            <button className="block w-full text-left py-2 px-4 hover:bg-gray-200">Account</button>
          </div>
        </div>

        <div className="w-2/3 p-6">
          <h2 className="text-2xl font-semibold mb-6">Chỉnh Sửa Hồ Sơ</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
              <input
                type="text"
                name="Ten"
                value={formData.Ten}
                onChange={handleInputChange}
                placeholder="Họ và Tên"
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
              <input
                type="text"
                name="SoDienThoai"
                value={formData.SoDienThoai}
                onChange={handleInputChange}
                placeholder="Số Điện Thoại"
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày Sinh</label>
              <input
                type="date"
                name="NgaySinh"
                value={formData.NgaySinh}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giới Tính</label>
              <select
                name="GioiTinh"
                value={formData.GioiTinh}
                onChange={handleInputChange}
                className="w-full border p-3 rounded"
              >
                <option value="">Chọn giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa Chỉ</label>
              <input
                type="text"
                name="DiaChi"
                value={formData.DiaChi}
                onChange={handleInputChange}
                placeholder="Địa Chỉ"
                className="w-full border p-3 rounded"
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 hover:shadow-lg transition-all duration-300"
              >
                CẬP NHẬT
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border rounded-xl py-2 font-medium hover:bg-gray-100"
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormSetting;