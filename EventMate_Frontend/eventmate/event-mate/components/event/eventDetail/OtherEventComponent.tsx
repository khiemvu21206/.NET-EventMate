"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventRepository, Event } from "@/repositories/EventRepository";

export enum EventType {
  None = 0,
  Cultural = 1,
  Concerts = 2,
  Food_Festival = 3
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface OtherEventProps {
  eventType: EventType;
  currentEventId?: string;
}

export default function OtherEventComponent({ eventType, currentEventId }: OtherEventProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const visibleCount = 4;
  const slideWidth = 300 + 20;
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const controller = new AbortController();
    const fetchSimilarEvents = async () => {
      console.log("Current eventType:", eventType);

      if (eventType === undefined || eventType === null || eventType === EventType.None) {
        console.log("EventType is invalid");
        setError("Loại sự kiện không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiResponse = await EventRepository.getSimilarEvents(eventType);
        
        let filteredEvents = currentEventId 
          ? apiResponse.data.filter((event: Event) => event.eventId !== currentEventId)
          : apiResponse.data;

        if (filteredEvents.length < 8 && currentEventId) {
          const remainingEvents = apiResponse.data
            .filter((event: Event) => event.eventId === currentEventId)
            .slice(0, 8 - filteredEvents.length);
          filteredEvents = [...filteredEvents, ...remainingEvents];
        }
          
        setEvents(filteredEvents.slice(0, 8));
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error fetching events:", err);
          setError(err.message || "Đã xảy ra lỗi khi tải các sự kiện tương tự!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarEvents();
    return () => controller.abort();
  }, [eventType, currentEventId]);

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getEventTypeText = (type: EventType): string => {
    switch (type) {
      case EventType.Cultural:
        return "Văn hóa";
      case EventType.Concerts:
        return "Hòa nhạc";
      case EventType.Food_Festival:
        return "Lễ hội ẩm thực";
      default:
        return "Không xác định";
    }
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/event/eventDetail/${eventId}`);
  };

  const goToNext = async () => {
    if (currentIndex < events.length - visibleCount) {
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

      <div className="relative overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Đang tải các sự kiện tương tự...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : events.length > 0 ? (
          <motion.div 
            className="flex gap-6"
            animate={controls}
            initial={{ x: 0 }}
          >
            {events.map((event) => (
              <div 
                key={event.eventId} 
                className="relative flex-none w-[300px] group cursor-pointer"
                onClick={() => handleEventClick(event.eventId)}
              >
                {/* Image Container */}
                <div className="relative h-[200px] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <img
                    src={event.img || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Button Container */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="w-full py-2 bg-gray-50 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm">
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
                    {formatDateTime(event.timeStart)}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-600">Không có sự kiện tương tự</div>
        )}

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

        {currentIndex < events.length - visibleCount && (
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
