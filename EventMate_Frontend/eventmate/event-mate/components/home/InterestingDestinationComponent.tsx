"use client";
import React from "react";
import { motion } from "framer-motion";

export default function InterestingDestinationComponent() {
    const banners = [
        { id: 1, text: "Ho Chi Minh", img: 'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2Fdc%2Fc9%2F5a%2F2e39c5e4d2e6d11ecd8e5760c4c54802.png&w=1920&q=75' },
        { id: 2, text: "Hanoi", img: 'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F63%2Ffb%2F89%2Ff3dcb9221cb47e3224b1983d471aad36.png&w=1920&q=75' },
        { id: 3, text: "Da Nang", img: 'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F07%2Fa0%2F57%2Fab53a80f18e0dde3868223028a78f2c0.png&w=1920&q=75' },
        { id: 4, text: "Other", img: 'https://ticketbox.vn/_next/image?url=https%3A%2F%2Fsalt.tkbcdn.com%2Fts%2Fds%2F72%2F90%2F2d%2F44408a275fff4b235d9725ae72d268d8.png&w=1920&q=75' },
    ];

    return (
        <div className="space-y-6 py-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Điểm đến hấp dẫn</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {banners.map((banner) => (
                    <div 
                        key={banner.id} 
                        className="relative group cursor-pointer space-y-3"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10" />
                            
                            {/* Image */}
                            <img 
                                src={banner.img} 
                                alt={banner.text} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Text Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {banner.text}
                                </h3>
                                <div className="flex items-center text-white/80 text-sm">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>Khám phá ngay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
