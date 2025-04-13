"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../components/Assets/logo.png";
import cart_icon from "../components/Assets/cart_icon.png";
import avatar from "../components/Assets/logo.jpg";
import ThemeToggle from "./toggleTheme";
import FormSetting from "./FormSetting"; // Nhớ import đúng đường dẫn

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "mylight"
      : "mylight"
  );

  const [showSettingForm, setShowSettingForm] = useState(false); // ✅ Thêm state

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") || "mylight";
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="w-full shadow-md px-6 py-3 top-0 left-0 right-0 z-50 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" width={50} height={50} />
            <p className="text-xl font-bold">GYM FITNESS</p>
          </div>
        </Link>

        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          {[
            { name: "Home", href: "/" },
            { name: "Training Plans", href: "/trainingplans" },
            { name: "Health Consultation", href: "/healthconsultation" },
            { name: "Schedule", href: "/schedule" },
            { name: "Checkout", href: "/checkout" },
            { name: "Services", href: "/products&services" },
          ].map((item) => (
            <li key={item.name} className="hover:text-red-500 transition">
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-6">
          <ThemeToggle />
          <Link href="/login">
            <button className="w-[100px] h-[40px] border border-[#fdf8f8] rounded-full text-[20px] font-medium cursor-pointer transition duration-300 
              data-[theme=mylight]:bg-transparent data-[theme=mylight]:text-black 
              data-[theme=mydark]:bg-white data-[theme=mydark]:text-black 
              active:bg-[#161616] active:text-white">
              Login
            </button>
          </Link>

          <Link href="/shoppingcart/productlist">
            <div className="relative">
              <Image
                src={cart_icon}
                alt="Cart"
                width={30}
                height={30}
                className={theme === "mydark" ? "invert" : ""}
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                0
              </span>
            </div>
          </Link>

          {/* ✅ Avatar có onClick */}
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
            onClick={() => setShowSettingForm(true)}
          >
            <Image src={avatar} alt="User Avatar" layout="fill" objectFit="cover" />
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <ul className="md:hidden absolute left-0 right-0 top-16 bg-white dark:bg-gray-800 p-4 space-y-4 shadow-md z-40">
          {[
            { name: "Home", href: "/" },
            { name: "Training Plans", href: "/trainingplans" },
            { name: "Health Consultation", href: "/healthconsultation" },
            { name: "Schedule", href: "/schedule" },
            { name: "Checkout", href: "/checkout" },
            { name: "Services", href: "/products&services" },
          ].map((item) => (
            <li
              key={item.name}
              className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-red-500 transition"
            >
              <Link href={item.href} onClick={() => setMenuOpen(false)}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Hiển thị FormSetting nếu được bật */}
      {showSettingForm && (
        <FormSetting onClose={() => setShowSettingForm(false)} />
      )}
    </nav>
  );
};

export default Navbar;
