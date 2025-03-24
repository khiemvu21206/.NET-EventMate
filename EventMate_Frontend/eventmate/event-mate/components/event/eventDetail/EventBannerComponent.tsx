"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/EventBannerComponent.module.css";
import { EventRepository, SimpleEvent } from "@/repositories/EventRepository";

interface EventBannerProps {
  eventId: string;
}

export default function EventBannerComponent({ eventId }: EventBannerProps) {
  const [event, setEvent] = useState<SimpleEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiResponse = await EventRepository.getEventById(eventId);
        setEvent(apiResponse.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Đã xảy ra lỗi khi tải banner sự kiện!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    return () => controller.abort();
  }, [eventId]);

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex space-x-4">
              <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        ) : event?.banner ? (
          <div className="relative h-full">
            <img 
              src={(typeof event.banner === "string" ? `${event.banner}?t=${Date.now()}` : "/images/default-avatar.jpg")} 
              alt="Event Banner"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Không có banner</span>
          </div>
        )}
      </div>
    </div>
  );
}
