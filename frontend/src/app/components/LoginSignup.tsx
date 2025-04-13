"use client";
import React, { useState } from 'react';
import user_icon from '../components/Assets/person.png';
import email_icon from '../components/Assets/email.png';
import password_icon from '../components/Assets/password.png';
import './LoginSignup.css';
import Image from 'next/image';

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<string>("Sign Up");
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: ''
    };

    if (action === "Sign Up" && !formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);

      if (action === 'Login') {
        alert('Login successful!');
        // Bạn có thể thêm chuyển hướng sau khi đăng nhập ở đây nếu cần
      } else {
        alert('Sign up successful!');
        setAction('Login'); // Chuyển sang giao diện đăng nhập
        setFormData({ name: '', email: '', password: '' }); // Reset form
      }
    }
  };

  const ForgotPasswordForm = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ 
      type: null, 
      message: '' 
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) {
        setStatus({ type: 'error', message: 'Email is required' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus({ type: 'error', message: 'Please enter a valid email address' });
        return;
      }

      setStatus({ type: 'success', message: `Reset link sent to ${email}` });
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
          
          <a onClick={onBackToLogin} className="back-to-login">
            ← Back to Login
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="loginpagge">
      {showForgotPassword ? (
        <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="container">
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            {action === "Login" ? null : (
              <div className="input">
                <Image src={user_icon} alt="User Icon" width={24} height={24} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}
            <div className="input">
              <Image src={email_icon} alt="Email Icon" width={24} height={24} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input">
              <Image src={password_icon} alt="Password Icon" width={24} height={24} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          </div>
          {action === "Sign Up" ? null : (
            <div className="forgot-password">
              Lost Password? <span onClick={() => setShowForgotPassword(true)}>Click Here!</span>
            </div>
          )}
          <div className="submit-container">
            <button
              type="button"
              className={action === "Login" ? "submit gray" : "submit"}
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={action === "Sign Up" ? "submit gray" : "submit"}
              onClick={() => setAction("Login")}
            >
              Login
            </button>
          </div>
          <button type="submit" className="submit main-action" style={{ marginTop: '20px' }}>
            {action === 'Login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginSignup;
