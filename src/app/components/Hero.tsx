"use client"; 
import React from 'react';
import Image from 'next/image';
import hand_icon from '../components/Assets/hand_icon.png';
import arrow_icon from '../components/Assets/arrow.png';
import gym_hero from '../components/Assets/gym_hero-removebg-preview.png';
import './Hero.css';
const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>GYM FOR HEALTH</h2>
        <div>
          <div className="hero-hand-icon">
            <p>Gym</p>
            <Image src={hand_icon} alt="Hand Icon" width={50} height={50} />
          </div>
          <p>Collection</p>
          <p>For Everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <Image src={arrow_icon} alt="Arrow Icon" width={20} height={20} />
        </div>
      </div>
      <div className="hero-right">
        <Image src={gym_hero} alt="Gym Hero" width={600} height={600} />
      </div>
    </div>
  );
};

export default Hero;