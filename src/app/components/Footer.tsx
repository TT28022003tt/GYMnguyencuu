import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import instagram from '../components/Assets/instagram_icon.png';
import printester from '../components/Assets/pintester_icon.png';
import whatsapp from '../components/Assets/whatsapp_icon.png';

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-12 py-10 px-4 ">
      {/* Logo + Text */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <FontAwesomeIcon icon={faDumbbell} className="w-16 h-16 text-[#f97000] rotate-45" />
          <span className="font-bold text-2xl text-center uppercase">Biến mồ hôi thành sức mạnh, biến thói quen thành bản lĩnh</span>
          <FontAwesomeIcon icon={faDumbbell} className="w-16 h-16 text-[#f97000] rotate-45" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-wrap justify-center gap-12 text-lg font-medium">
        <li className="cursor-pointer hover:text-orange-600">Payment method</li>
        <li className="cursor-pointer hover:text-orange-600">Price policy service</li>
        <li className="cursor-pointer hover:text-orange-600">Privacy policy</li>
        <li className="cursor-pointer hover:text-orange-600">Club</li>
      </ul>

      {/* Social Icons */}
      <div className="flex gap-6">
        {[instagram, printester, whatsapp].map((icon, index) => (
          <div
            key={index}
            className="p-2 pb-1.5 bg-[#fbfbfb] border border-[#ebebeb] rounded-lg hover:shadow-lg transition"
          >
            <Image src={icon} alt={`Social ${index}`} width={32} height={32} />
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="flex flex-col items-center gap-6 w-full mt-4 text-base">
        <hr className="w-4/5 h-[3px] bg-gray-300 rounded-lg border-none" />
        <p className="text-center">&copy; Copyright Team GYM FITNESS</p>
      </div>
    </div>
  );
};

export default Footer;
