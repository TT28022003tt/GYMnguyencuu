'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import image_gym2 from '../components/Assets/image_gym2.png';
import dynamic from 'next/dynamic';
const Link = dynamic(() => import('react-scroll').then((mod) => mod.Link), { ssr: false });

const Offers = () => {
  return (
    <motion.div
      className="w-[90%] lg:w-[80%] flex flex-col lg:flex-row items-center justify-between mx-auto my-[100px] lg:my-[150px] px-6 lg:px-16 py-10 bg-gradient-to-b from-[#ffb350] to-[#e1ffea22] rounded-2xl shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Left Section */}
      <motion.div
        className="flex-1 flex flex-col gap-5 text-center lg:text-left"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#171717]">TÍNH CHỈ SỐ BMI</h1>
        <h1 className="text-3xl md:text-4xl font-bold text-[#171717]">Ưu đãi dành cho bạn</h1>
        <p className="text-[#171717] text-sm md:text-base font-medium leading-relaxed">
          Đo chỉ số BMI tại GYM FITNESS để đánh giá mức độ béo, gầy hoặc cân nặng lý tưởng của bạn.
          <br />
          Chúng tôi hỗ trợ thành viên đo chỉ số BMI trước và trong quá trình tập luyện để theo dõi kết quả tập luyện.
          <br />
          BMI (Chỉ số Khối Cơ thể) là công cụ được các bác sĩ và chuyên gia sức khỏe sử dụng để xác định xem một
          <br />
          người có bị béo phì, thừa cân hoặc quá gầy hay không. Hãy để lại thông tin để chúng tôi có thể giúp bạn phân
          tích tình trạng sức khỏe và đưa ra lời khuyên phù hợp với thể trạng của bạn.
        </p>
        <Link to="calculator" smooth={true} duration={500}>
          <button className="w-[250px] h-[60px] bg-[#ff4141] hover:bg-[#e63939] text-white rounded-full text-lg font-medium mt-5 transition duration-300">
            KIỂM TRA
          </button>
        </Link>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="flex-1 flex justify-center items-center mt-10 lg:mt-0"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Image
          src={image_gym2}
          alt="BMI Calculation"
          className="max-w-[80%] max-h-[300px] object-contain rounded-xl hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
    </motion.div>
  );
};

export default Offers;
