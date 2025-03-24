"use client";
import React from "react";
import Link from "next/link";

export default function LeftNavbar() {
  return (
    <div className="bg-gray-900 h-full text-white p-4">
      <div className="flex flex-col space-y-4">
        <Link href="/eventManager" className="hover:text-gray-300">
          Quản lý sự kiện
        </Link>
        <Link href="/event/createEvent" className="hover:text-gray-300">
          Tạo sự kiện
        </Link>
        <Link href='/event/manageEvent' className="hover:text-gray-300">
          Danh sách sự kiện
        </Link>
        <Link href="/event/eventRequest" className="hover:text-gray-300">
          Duyệt Sự Kiện
        </Link>
        <Link href="/event/bannerRequest" className="hover:text-gray-300">
          Duyệt Banner
        </Link>
      </div>
    </div>
  );
} 