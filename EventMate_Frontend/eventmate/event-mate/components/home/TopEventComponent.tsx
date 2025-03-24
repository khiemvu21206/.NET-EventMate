"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { RequestList } from "@/model/common";
import { Event, EventRepository1 } from "@/repositories/EventRepository";
import Image from 'next/image';
import { useRouter } from "next/navigation";
export default function TopEventComponent() {
    const router = useRouter();
    const [listEvents, setListEvents] = useState<Event[]>([]);
    const getRequestQueries = (): Required<RequestList> => {
      return {
          currentPage: 1,
          pageSize: 8,
          keySearch: "",
          sortBy: "",
          ascending: true,
          startDate: "",
          endDate: "",
          filters: {}
      };
    };
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await EventRepository1.getListEvents(getRequestQueries());
                if (res) {
                    setListEvents(res.data.data);
                    console.log(res.data.data);     
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const visibleCount = 4;
    const slideWidth = 300 + 20;
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();

    const goToNext = async () => {
        if (currentIndex < listEvents.length - visibleCount) {
            const newIndex = currentIndex + 2;
            setCurrentIndex(newIndex);
            await controls.start({
                x: -newIndex * slideWidth,
                transition: { duration: 0.3, ease: "easeInOut" },
            });
        }
    };

    const goToPrevious = async () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 2;
            setCurrentIndex(newIndex);
            await controls.start({
                x: -newIndex * slideWidth,
                transition: { duration: 0.3, ease: "easeInOut" },
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Sự kiện nổi bật</h2>
                <button className="text-gray-600 hover:text-black transition-colors"
                onClick={() => router.push("/event/eventlist")}>
                    Xem tất cả →
                </button>
            </div>

            <div className="relative overflow-hidden">
                <motion.div 
                    className="flex gap-6"
                    animate={controls}
                    initial={{ x: 0 }}
                >
                    {listEvents.map((event, index) => (
                        <div 
                            key={event.eventId} 
                            className="relative flex-none w-[300px] group"
                        >
                            {/* Ranking Badge */}
                            <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-gradient-to-br from-green-400 to-red-400 text-white rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                                {index + 1}
                            </div>

                            {/* Image Container */}
                            <div className="relative h-[200px] rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                <img
                                    src={event?.banner || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                                    alt={event.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Button Container */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <button className="w-full py-2 bg-gray-50 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                                    onClick={() => router.push(`/event/eventDetail/${event.eventId}`)}>
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="mt-4 space-y-2">
                                <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                                    {event.name}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-1">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Navigation Buttons */}
                {currentIndex > 0 && (
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {currentIndex < listEvents.length - visibleCount && (
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
