import type { Metadata } from "next";
import {Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phong Gym",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={inter.className}
      >
        <div className="">
          <nav className="sticky top-0 bg-base-100 z-50">
            <Navbar />
          </nav>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
