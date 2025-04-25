"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho form đăng ký
interface SignUpFormData {
  TenDangNhap: string;
  MatKhau: string;
  Ten: string;
  NgaySinh?: string;
  GioiTinh: number;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
}

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface SignUpResponse {
  token: string;
}

// Định nghĩa kiểu dữ liệu cho lỗi
interface ApiError {
  error: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormData>({
    TenDangNhap: "",
    MatKhau: "",
    Ten: "",
    GioiTinh: 1, // Giá trị mặc định
    DiaChi: "",
    SoDienThoai: "",
    Email: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  console.log(formData);
  
  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: SignUpResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Đăng ký thất bại");
      }

      

      // Chuyển hướng đến trang đăng nhập hoặc dashboard
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="TenDangNhap" className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="TenDangNhap"
              name="TenDangNhap"
              value={formData.TenDangNhap}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="MatKhau" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="MatKhau"
              name="MatKhau"
              value={formData.MatKhau}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="Ten" className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              id="Ten"
              name="Ten"
              value={formData.Ten}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="NgaySinh" className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="date"
              id="NgaySinh"
              name="NgaySinh"
              value={formData.NgaySinh}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="GioiTinh" className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <select
              id="GioiTinh"
              name="GioiTinh"
              value={formData.GioiTinh}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Nam</option>
              <option value={0}>Nữ</option>
            </select>
          </div>
          <div>
            <label htmlFor="DiaChi" className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              id="DiaChi"
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="SoDienThoai" className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              id="SoDienThoai"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Đăng ký
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}