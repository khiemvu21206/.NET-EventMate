"use client";
import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "@/styles/CarouselComponent.module.css";

export default function CarouselComponent() {
  const banners = [
    { id: 1, text: "Banner 1", img: 'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F614%2F350%2Fts%2Fds%2F04%2Fae%2F03%2F793fcf11b7e8e3903898c5e47629b738.jpg&w=1920&q=75' },
    { id: 2, text: "Banner 2",img:'https://viet-power.vn/wp-content/uploads/2024/06/banner-su-kien-2.jpg'},
    { id: 3, text: "Banner 3",img: 'https://viet-power.vn/wp-content/uploads/2024/06/banner-su-kien-7.jpg' },
    { id: 4, text: "Banner 4",img: 'https://ticketgo.vn/uploads/images/event-gallery/event_gallery-2515dd44bc3b4e10399f00d837d217df.jpg' },
  ];

  const slides = [...banners, ...banners];
  const bannerWidth = 600;
  const gap = 30;
  const slideWidth = bannerWidth + gap;
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  const goToNext = async () => {
    let newIndex = currentIndex + 1;
    await controls.start({
      x: -newIndex * slideWidth,
      transition: { duration: 0.3, ease: "easeInOut" },
    });
    if (newIndex >= banners.length) {
      newIndex = 0;
      controls.set({ x: 0 });
    }
    setCurrentIndex(newIndex);
  };

  const goToPrevious = async () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = banners.length - 1;
      controls.set({ x: -banners.length * slideWidth });
    }
    await controls.start({
      x: -newIndex * slideWidth,
      transition: { duration: 0.3, ease: "easeInOut" },
    });
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full bg-gray-100 py-8">
      <div className="max-w-[1265px] mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl">
          <motion.div 
            className="flex"
            animate={controls}
            initial={{ x: 0 }}
            style={{ gap: `${gap}px` }}
          >
            {slides.map((banner, index) => (
              <div 
                key={index} 
                className="relative flex-none w-[600px] aspect-[16/9] overflow-hidden rounded-xl group"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                
                {/* Banner Image */}
                <img 
                  src={banner.img} 
                  alt={`Banner ${banner.id}`} 
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Banner Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-2xl font-bold mb-3">{banner.text}</h2>
                  <button className="px-4 py-2 bg-gray-50 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group"
          >
            <svg className="w-5 h-5 text-white transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group"
          >
            <svg className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={async () => {
                setCurrentIndex(index);
                await controls.start({
                  x: -index * slideWidth,
                  transition: { duration: 0.3, ease: "easeInOut" },
                });
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-gray-900 w-6' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
