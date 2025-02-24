"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import 'react-toastify/dist/ReactToastify.css';
import GlobalProviders from '@/providers/GlobalProviders';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          {children}
        </GlobalProviders>

      </body>
    </html >


  );
}
