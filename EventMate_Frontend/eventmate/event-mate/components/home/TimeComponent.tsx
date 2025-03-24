"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Event, EventRepository1 } from "@/repositories/EventRepository";
import { RequestList } from "@/model/common";
import { ensureTimezone, timeConverter } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export default function TimeComponent() {
  const router = useRouter();
  const [listEvents, setListEvents] = useState<Event[]>([]);

  const getWeekRange = (date: Date, weekStartsOn: number = 1) => {
    const currentDay = date.getDay();
    const diff = (currentDay < weekStartsOn ? 7 : 0) + currentDay - weekStartsOn;

    const startDate = new Date(date);
    startDate.setDate(date.getDate() - diff);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0]
    };
  };

  const { startDate, endDate } = getWeekRange(new Date());
  const getRequestQueries = (): Required<RequestList> => {
    return {
      currentPage: 1,
      pageSize: 8,
      keySearch: "",
      sortBy: "",
      ascending: true,
      startDate: startDate,
      endDate: endDate,
      filters: {}
    };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventRepository1.getListEvents(getRequestQueries());
        if (res) {
          setListEvents(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const [selectedTab, setSelectedTab] = useState("weekend");
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
        <div className="flex items-center gap-6">
          <h2 
            className={`text-2xl font-bold ${selectedTab === "weekend" ? 'text-gray-900' : 'text-gray-400'} cursor-pointer`}
            onClick={() => setSelectedTab("weekend")}
          >
            Cuối tuần này
          </h2>
          <h2 
            className={`text-2xl font-bold ${selectedTab === "month" ? 'text-gray-900' : 'text-gray-400'} cursor-pointer`}
            onClick={() => setSelectedTab("month")}
          >
            Tháng này
          </h2>
        </div>
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
          {listEvents.map((event) => (
            <div 
              key={event.eventId} 
              className="relative flex-none w-[300px] group"
            >
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
              <div className="mt-4 space-y-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                  {event.name}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {timeConverter(new Date(ensureTimezone(event.createdAt)), false)}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.startTime ? timeConverter(new Date(ensureTimezone(event.startTime)), true) : 'Thời gian chưa xác định'}
                </div>
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
