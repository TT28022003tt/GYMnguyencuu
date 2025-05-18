"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../components/Assets/logo.png";
import cart_icon from "../components/Assets/cart_icon.png";
import ThemeToggle from "./toggleTheme";
import { usePathname, useRouter } from "next/navigation";
import { useMyContext } from "@/contexts/useContext";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import FeedbackForm from "./forms/FeedbackForm";

const Navbar = () => {
  const {user, setUser } = useMyContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("mylight");
  const [showFeedback, setShowFeedback] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const newTheme = document.documentElement.getAttribute("data-theme") || "mylight";
    setTheme(newTheme);

    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute("data-theme") || "mylight";
      setTheme(updatedTheme);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    router.push("/logout");
    setUser({ ten: "", admin: "", anh: "" });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Training Plans", href: "/trainingplans" },
    { name: "Health Consultation", href: "/healthconsultation" },
    { name: "Schedule", href: "/schedule" },
    { name: "Class", href: "/class" },
    { name: "Checkout", href: "/checkout" },
  ];

  return (
    <nav className="w-full shadow-md px-6 py-3">
      <div className=" mx-auto flex justify-center items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={50} height={50} />
          <p className="text-xl font-bold">GYM FITNESS</p>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg font-medium mx-7">
          {navLinks.map((item) => (
            <li key={item.name} className="hover:text-red-500 transition">
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user.ten ? (
            <>
              <button
                onClick={handleLogout}
                className="w-[100px] h-[40px] border rounded-full font-medium hover:bg-gray-100"
              >
                Logout
              </button>
              <Link href="/Profile" className="flex items-center space-x-2">
                <Image
                  src={user.anh || "/images/default-avatar.png"}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="text-lg font-medium">{user.ten}</span>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <button className="w-[100px] h-[40px] border rounded-full font-medium hover:bg-gray-100">
                Login
              </button>
            </Link>
          )}

          {/* Feedback Icon */}
          <button onClick={() => setShowFeedback(true)} className="text-orange-500 hover:text-orange-600">
            <ExclamationCircleIcon className="h-8 w-8" />
          </button>

          {/* <Link href="/shoppingcart/productlist">
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
          </Link> */}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden absolute left-0 right-0 top-16 p-4 space-y-4 shadow-md z-40">
          {navLinks.map((item) => (
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

      {/* Feedback Modal */}
      {showFeedback && <FeedbackForm userId={user.id} onClose={() => setShowFeedback(false)} />}
    </nav>
  );
};

export default Navbar;