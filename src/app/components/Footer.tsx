import React from 'react';
import './Footer.css';
import footer_logo from '../components/Assets/logo.png';
import instagram from '../components/Assets/instagram_icon.png';
import printester from '../components/Assets/pintester_icon.png';
import whatsapp from '../components/Assets/whatsapp_icon.png';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <div className='footer'>
<div className="w-auto p-4 flex items-center gap-4">
  <Link href="/" className="flex items-center gap-4 whitespace-nowrap">
    <FontAwesomeIcon icon={faDumbbell} className="w-16 h-16 text-[#f97000]" transform={{ rotate: 45 }} />
    <span className="font-bold text-2xl">ANH EM FREE FIRE SỐNG DAI NHƯ QUỶ</span>
  </Link>
</div>


      <ul className='footer-links'>
        <li>Payment method</li>
        <li>Price policy service</li>
        <li>Privacy policy</li>
        <li>Club</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <Image src={instagram} alt="Instagram" />
        </div>
        <div className="footer-icons-container">
          <Image src={printester} alt="Printester" />
        </div>
        <div className="footer-icons-container">
          <Image src={whatsapp} alt="WhatsApp" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright Team nam anh em sieu nhan</p>
      </div>
    </div>
  );
};

export default Footer;