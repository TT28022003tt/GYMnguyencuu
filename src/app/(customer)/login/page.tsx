"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/contexts/useContext";

interface SignInFormData {
  TenDangNhap: string;
  MatKhau: string;
}

interface SignInResponse {
  token: string;
  message: string;
}

interface ApiError {
  error: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<SignInFormData>({
    TenDangNhap: "",
    MatKhau: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { refreshUser } = useMyContext(); // Lấy refreshUser

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: SignInResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Đăng nhập thất bại");
      }

      // Gọi refreshUser để cập nhật user trong context
      await refreshUser();

      // Chuyển hướng đến /admin
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="TenDangNhap"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="MatKhau"
              className="block text-sm font-medium text-gray-700"
            >
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p className="mt-2 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}