"use client"; 
import React, { useState } from 'react';
import user_icon from '../components/Assets/person.png';
import email_icon from '../components/Assets/email.png';
import password_icon from '../components/Assets/password.png';
import './LoginSignup.css';
import Image from 'next/image';

const LoginSignup: React.FC = () => {
  const [action, setAction] = useState<string>("Sign Up");

  return (
    <div className="loginpagge">
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <Image src={user_icon} alt="User Icon" width={24} height={24} />
            <input type="text" placeholder="Name" />
          </div>
        )}
        <div className="input">
          <Image src={email_icon} alt="Email Icon" width={24} height={24} />
          <input type="email" placeholder="Email" />
        </div>
        <div className="input">
          <Image src={password_icon} alt="Password Icon" width={24} height={24} />
          <input type="password" placeholder="Password" />
        </div>
      </div>
      {action === "Sign Up" ? null : (
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
      )}
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => setAction("Login")}
        >
          Login
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginSignup;