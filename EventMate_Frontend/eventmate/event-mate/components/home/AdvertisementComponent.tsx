"use client";

import React from 'react';
import styles from "@/styles/AdvertisementComponent.module.css";
import { useRouter } from "next/navigation";

const AdvertisementComponent = () => {
  const banners = [
    { id: 1, text: "Advertisement" }
  ];

  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative px-6 py-12 sm:px-12 sm:py-16 md:py-20 lg:py-24 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Tạo sự kiện của riêng bạn
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Dễ dàng tạo và quản lý sự kiện của bạn với các công cụ chuyên nghiệp. Hãy để chúng tôi giúp bạn tổ chức sự kiện thành công.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gray-50 text-gray-900 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            onClick={() => router.push("/event/createEvent")}>
              Tạo sự kiện ngay
            </button>
            
            <button className="px-8 py-4 bg-transparent border-2 border-white/30 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default AdvertisementComponent;
