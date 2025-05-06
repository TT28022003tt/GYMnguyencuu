import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { MyProvider } from "@/contexts/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatWidget from "./components/ChatWidget";
import { ChatProvider } from "../contexts/ChatContext";
import { MetricsProvider } from "@/contexts/MetricsContext";
import { Toaster } from "react-hot-toast";


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
        <MyProvider>
          <MetricsProvider>
            <div className="">
              <nav className="sticky top-0 bg-base-100 z-50">
                <Navbar />
              </nav>
              <main>
                {children}

                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </main>
              <ChatWidget />
            </div>
          </MetricsProvider>
        </MyProvider>
      </body>
    </html>
  );
}
