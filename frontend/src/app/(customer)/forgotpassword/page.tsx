"use client";

import { useState } from "react";
import './LoginSignup.css';

// Định nghĩa kiểu dữ liệu cho form quên mật khẩu
interface ForgotPasswordFormData {
  email: string;
}

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface ForgotPasswordResponse {
  message: string;
}

// Định nghĩa kiểu dữ liệu cho lỗi
interface ApiError {
  error: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!email.trim()) {
      setStatus({ type: "error", message: "Email is required" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address" });
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data: ForgotPasswordResponse | ApiError = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Gửi yêu cầu thất bại");
      }

      setStatus({ type: "success", message: `Reset link sent to ${email}` });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="forgot-pass-container">
      <div className="forgot-pass-card">
        <h2>Forgot Password?</h2>
        <p className="subtitle">Enter your email to receive a reset link</p>

        {status.type && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-pass-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        <a href="/login" className="back-to-login">
          ← Back to Login
        </a>
      </div>
    </div>
  );
}