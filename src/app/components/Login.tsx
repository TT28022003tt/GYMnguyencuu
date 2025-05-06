"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMyContext } from '@/contexts/useContext';
import { toast } from 'react-toastify';
import user_icon from '../components/Assets/person.png';
import email_icon from '../components/Assets/email.png';
import password_icon from '../components/Assets/password.png';
import Image from 'next/image';

// Định nghĩa kiểu dữ liệu cho form
interface AuthFormData {
  TenDangNhap: string;
  MatKhau: string;
  Ten: string;
  NgaySinh?: string;
  GioiTinh: number;
  DiaChi: string;
  SoDienThoai: string;
  Email: string;
}

interface ForgotPasswordFormData {
  Email: string;
}

interface AuthResponse {
  token: string;
  message?: string;
}

interface ApiError {
  error: string;
}

const Login: React.FC = () => {
  const [action, setAction] = useState<string>("Login"); // Mặc định là Đăng nhập
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<AuthFormData>({
    TenDangNhap: '',
    MatKhau: '',
    Ten: '',
    NgaySinh: '',
    GioiTinh: 1,
    DiaChi: '',
    SoDienThoai: '',
    Email: '',
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useMyContext();
  const toastId = "auth-toast";

  // Xử lý thông báo từ searchParams
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "login_required" && !toast.isActive(toastId)) {
      toast.error("Vui lòng đăng nhập để tiếp tục.", { toastId });
    }
  }, [searchParams]);

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Partial<AuthFormData> = {};
    let valid = true;

    if (action === "Sign Up") {
      if (!formData.TenDangNhap.trim()) {
        newErrors.TenDangNhap = 'Tên đăng nhập là bắt buộc';
        valid = false;
      }
      if (!formData.Ten.trim()) {
        newErrors.Ten = 'Họ và tên là bắt buộc';
        valid = false;
      }
      if (!formData.Email.trim()) {
        newErrors.Email = 'Email là bắt buộc';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
        newErrors.Email = 'Vui lòng nhập email hợp lệ';
        valid = false;
      }
      if (!formData.SoDienThoai.trim()) {
        newErrors.SoDienThoai = 'Số điện thoại là bắt buộc';
        valid = false;
      }
    } else {
      if (!formData.TenDangNhap.trim()) {
        newErrors.TenDangNhap = 'Tên đăng nhập là bắt buộc';
        valid = false;
      }
    }

    if (!formData.MatKhau) {
      newErrors.MatKhau = 'Mật khẩu là bắt buộc';
      valid = false;
    } else if (formData.MatKhau.length < 6) {
      newErrors.MatKhau = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      const endpoint = action === 'Login' ? '/api/login' : '/api/sign-up';
      const payload = action === 'Login'
        ? { TenDangNhap: formData.TenDangNhap, MatKhau: formData.MatKhau }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: AuthResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || `${action === 'Login' ? 'Đăng nhập' : 'Đăng ký'} thất bại`);
      }

      if (action === 'Login') {
        await refreshUser();
        toast.success('Đăng nhập thành công!', { toastId });
        router.push('/admin');
      } else {
        toast.success('Đăng ký thành công!', { toastId });
        setAction('Login');
        setFormData({
          TenDangNhap: '',
          MatKhau: '',
          Ten: '',
          NgaySinh: '',
          GioiTinh: 1,
          DiaChi: '',
          SoDienThoai: '',
          Email: '',
        });
      }
    } catch (err: any) {
      setApiError(err.message);
      toast.error(err.message, { toastId });
    }
  };

  // Form quên mật khẩu
  const ForgotPasswordForm = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
    const [email, setEmail] = useState<string>('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
      type: null,
      message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus({ type: null, message: '' });

      if (!email.trim()) {
        setStatus({ type: 'error', message: 'Email là bắt buộc' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus({ type: 'error', message: 'Vui lòng nhập email hợp lệ' });
        return;
      }

      try {
        const response = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Email: email }),
        });

        const data: AuthResponse | ApiError = await response.json();

        if (!response.ok) {
          throw new Error((data as ApiError).error || 'Gửi liên kết thất bại');
        }

        setStatus({ type: 'success', message: `Liên kết đặt lại đã gửi tới ${email}` });
        toast.success(`Liên kết đặt lại đã gửi tới ${email}`, { toastId });
      } catch (err: any) {
        setStatus({ type: 'error', message: err.message });
        toast.error(err.message, { toastId });
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center items-center  p-6"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-[600px]">
          <h2 className="text-gray-900 text-2xl font-extrabold text-center mb-3">Quên Mật Khẩu?</h2>
          <p className="text-gray-600 text-center mb-6 text-sm">Nhập email để nhận liên kết đặt lại</p>

          {status.type && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg mb-6 text-center text-sm font-medium ${
                status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {status.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-all duration-300">
                <Image src={email_icon} alt="Email Icon" width={20} height={20} className="mr-3" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Gửi Liên Kết Đặt Lại
            </button>
          </form>

          <button
            onClick={onBackToLogin}
            className="block w-full text-center mt-6 text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition-all duration-300"
          >
            ← Quay lại Đăng nhập
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex justify-center items-center  p-6">
      <AnimatePresence mode="wait">
        {showForgotPassword ? (
          <ForgotPasswordForm key="forgot-password" onBackToLogin={() => setShowForgotPassword(false)} />
        ) : (
          <motion.form
            key="auth-form"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-8 w-[600px]"
          >
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-blue-600 text-2xl font-extrabold mb-2">
                {action === 'Login' ? 'Đăng Nhập' : 'Đăng Ký'}
              </h1>
              <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg mb-6 text-center text-sm font-medium bg-red-100 text-red-800"
              >
                {apiError}
              </motion.div>
            )}

            <div className={`${action === 'Sign Up' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-5'} mb-6`}>
              <div className="relative">
                <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                  <Image src={user_icon} alt="User Icon" width={20} height={20} className="mr-3" />
                  <input
                    type="text"
                    name="TenDangNhap"
                    value={formData.TenDangNhap}
                    onChange={handleInputChange}
                    placeholder="Tên đăng nhập"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                  />
                </div>
                {errors.TenDangNhap && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs mt-1 block"
                  >
                    {errors.TenDangNhap}
                  </motion.span>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                  <Image src={password_icon} alt="Password Icon" width={20} height={20} className="mr-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="MatKhau"
                    value={formData.MatKhau}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu"
                    className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                {errors.MatKhau && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-xs mt-1 block"
                  >
                    {errors.MatKhau}
                  </motion.span>
                )}
              </div>

              {action === "Sign Up" && (
                <>
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <Image src={user_icon} alt="User Icon" width={20} height={20} className="mr-3" />
                      <input
                        type="text"
                        name="Ten"
                        value={formData.Ten}
                        onChange={handleInputChange}
                        placeholder="Họ và tên"
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                      />
                    </div>
                    {errors.Ten && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-xs mt-1 block"
                      >
                        {errors.Ten}
                      </motion.span>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <input
                        type="date"
                        name="NgaySinh"
                        value={formData.NgaySinh}
                        onChange={handleInputChange}
                        placeholder="Ngày sinh"
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <select
                        name="GioiTinh"
                        value={formData.GioiTinh}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm"
                      >
                        <option value={1}>Nam</option>
                        <option value={0}>Nữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <input
                        type="text"
                        name="DiaChi"
                        value={formData.DiaChi}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ"
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <input
                        type="text"
                        name="SoDienThoai"
                        value={formData.SoDienThoai}
                        onChange={handleInputChange}
                        placeholder="Số điện thoại"
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                      />
                    </div>
                    {errors.SoDienThoai && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-xs mt-1 block"
                      >
                        {errors.SoDienThoai}
                      </motion.span>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 hover:border-blue-400 transition-all duration-300">
                      <Image src={email_icon} alt="Email Icon" width={20} height={20} className="mr-3" />
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400"
                      />
                    </div>
                    {errors.Email && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-xs mt-1 block"
                      >
                        {errors.Email}
                      </motion.span>
                    )}
                  </div>
                </>
              )}
            </div>

            {action === "Sign Up" ? null : (
              <div className="text-center mb-5 text-gray-600 text-sm">
                Quên mật khẩu?{' '}
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-all duration-300"
                >
                  Nhấn vào đây!
                </button>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  action === "Login"
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                onClick={() => setAction("Login")}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  action === "Sign Up"
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                onClick={() => setAction("Sign Up")}
              >
                Đăng Ký
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {action === 'Login' ? 'Đăng Nhập' : 'Đăng Ký'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;