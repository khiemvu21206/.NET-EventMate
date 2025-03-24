"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/EventDetailComponent.module.css";
import { EventRepository, Event } from "@/repositories/EventRepository";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu sự kiện
interface EventDetailProps {
  eventId: string;
  advertisementImage: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const EventDetailComponent = ({ eventId, advertisementImage }: EventDetailProps) => {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiResponse = await EventRepository.getEventById(eventId);
        setEvent(apiResponse.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Đã xảy ra lỗi khi tải thông tin sự kiện!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();

    return () => controller.abort();
  }, [eventId]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex space-x-4">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-lg">{error}</span>
        </div>
      ) : event ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột bên trái - Chiếm 2 cột trên desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Giới thiệu sự kiện */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Giới thiệu</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">{event.name}</h3>
                <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
                {/* Ảnh sự kiện */}
                <div className="mt-6 overflow-hidden rounded-xl">
                  {event.img ? (
                    <img 
                      src={event.img} 
                      alt={event.name} 
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-50 text-gray-400">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Không có ảnh</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tổ chức sự kiện */}
            {event.organizerLogo && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông tin tổ chức</h2>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                    <img 
                      src={event.organizerLogo} 
                      alt={event.organizerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{event.organizerName}</h4>
                    <p className="text-gray-600 leading-relaxed">{event.organizerDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cột bên phải */}
          <div className="space-y-8">
            {/* Thông tin sự kiện */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{event.name}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Địa điểm</p>
                    <p className="text-gray-900">{event.place}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                    <p className="text-gray-900">{new Date(event.timeStart).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                    <p className="text-gray-900">{new Date(event.timeEnd).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {/* Thêm nút Create Group */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button 
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group"
                    onClick={() => router.push(`/event/createGroup/${event.eventId}`)}>
                    <svg 
                      className="w-5 h-5 transform group-hover:scale-110 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="font-medium">Tạo nhóm mới</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Banner quảng cáo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img 
                src={advertisementImage} 
                alt="quảng cáo"
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-lg">Không tìm thấy sự kiện.</span>
        </div>
      )}
    </div>
  );
};

export default EventDetailComponent;
