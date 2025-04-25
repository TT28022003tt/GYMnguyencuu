'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import image_gym2 from '../components/Assets/image_gym2.png';
import dynamic from 'next/dynamic';
const Link = dynamic(() => import('react-scroll').then((mod) => mod.Link), { ssr: false });
import './Offer.css';

const Offers = () => {
  return (
    <motion.div
      className='offers'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.div
        className='offers-left'
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1>TÍNH CHỈ SỐ BMI</h1>
        <h1>Ưu đãi dành cho bạn</h1>
        <p>
        Đo chỉ số BMI tại CITIGYM để đánh giá mức độ béo, gầy hoặc cân nặng lý tưởng của bạn.<br />
        Chúng tôi hỗ trợ thành viên đo chỉ số BMI trước và trong quá trình tập luyện để theo dõi kết quả tập luyện. <br />
        BMI (Chỉ số Khối Cơ thể) là công cụ được các bác sĩ và chuyên gia sức khỏe sử dụng để xác định xem một <br />
        người có bị béo phì, thừa cân hoặc quá gầy hay không. Hãy để lại thông tin để chúng tôi có thể giúp bạn phân tích tình trạng sức khỏe và đưa ra lời khuyên phù hợp với thể trạng của bạn.
        </p>
        {}
        <Link to="calculator" smooth={true} duration={500}>
          <button>KIỂM TRA</button>
        </Link>
      </motion.div>
      <motion.div
        className='offers-right'
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Image src={image_gym2} alt='BMI Calculation' />
      </motion.div>
    </motion.div>
  );
};

export default Offers;