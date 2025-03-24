"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import GlobalProviders from "@/providers/GlobalProviders";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import ChatPopUp from "@/components/layout/grouplist/ChatPopUp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const footerHiddenPaths = ["/login", "/signUp", "/event/createEvent", "/resetPass","/group"];
  const hideFooter = footerHiddenPaths.some((path) => pathname.startsWith(path));
  const headerHiddenPaths = ["/event/createEvent"];
  const hideHeader = headerHiddenPaths.some((path) => pathname.startsWith(path));
  // Ẩn chat popup trên trang chat
  const chatHiddenPaths = ["/login", "/signUp", "/event/createEvent", "/resetPass","/group"];
  const hideChat = chatHiddenPaths.some((path) => pathname.startsWith(path));

  // Trạng thái mở/đóng chat popup
  const [showChat, setShowChat] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-auto`}
      >
        <GlobalProviders>
          {!hideHeader && <Header />}
          <main className="flex-grow pt-[72px]">{children}</main>
          {!hideFooter && <Footer />}

          {/* Popup Chat */}
          {showChat && !hideChat && (
            <div className="fixed bottom-24 right-6 z-50">
              <ChatPopUp />
            </div>
          )}

          {/* Nút mở chat */}
          {!hideChat && (
            <button
              onClick={() => setShowChat(!showChat)}
              className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl focus:outline-none transition-transform transform hover:scale-110 z-50"
            >
              <ChatBubbleBottomCenterIcon className="h-7 w-7" />
            </button>
          )}
        </GlobalProviders>
      </body>
    </html>
  );
}
