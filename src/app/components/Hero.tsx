"use client";
import React from "react";
import Image from "next/image";
import hand_icon from "../components/Assets/hand_icon.png";
import arrow_icon from "../components/Assets/arrow.png";
import gym_hero from "../components/Assets/gym_hero-removebg-preview.png";

const Hero = () => {
  return (
    <div className="h-screen bg-gradient-to-r from-[#ffb350] to-[#e1ffea22] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center gap-5 pl-5 md:pl-20 lg:pl-32 animate-slideInFromLeft">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#090909]">
          GYM FOR HEALTH
        </h2>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-4xl md:text-6xl lg:text-8xl font-bold text-[#171717]">
              Gym
            </p>
            <Image src={hand_icon} alt="Hand Icon" width={50} height={50} />
          </div>
          <p className="text-4xl md:text-6xl lg:text-8xl font-bold text-[#171717] leading-none">
            Collection
          </p>
          <p className="text-4xl md:text-6xl lg:text-8xl font-bold text-[#171717] leading-none">
            For Everyone
          </p>
        </div>
        <div className="mt-6 w-[250px] md:w-[310px] h-[60px] md:h-[70px] bg-[#e73232] text-white text-lg md:text-xl font-medium rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#e63333] transition duration-300 cursor-pointer">
          <span>Latest Collection</span>
          <Image src={arrow_icon} alt="Arrow Icon" width={20} height={20} />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center animate-slideInFromRight">
        <Image
          src={gym_hero}
          alt="Gym Hero"
          width={600}
          height={600}
          className="w-full max-w-[600px] h-auto rounded-[10px]"
        />
      </div>
    </div>
  );
};

export default Hero;