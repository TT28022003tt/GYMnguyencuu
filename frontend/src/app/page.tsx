'use client';
import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Popular from "./components/Popular";
import Offers from "./components/Offer";
import Calculator from "./components/Calculator";
import Footer from "./components/Footer";
import Contact from "./components/Contact";


export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero/>
      <Popular/>
      <Offers/>
    <Calculator/>
    <Contact/>
    <Footer/>
    </div>

  );
}
