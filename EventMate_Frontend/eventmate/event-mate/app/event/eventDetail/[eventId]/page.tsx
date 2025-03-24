"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/ToggleTab.module.css";
import { Button } from "@/components/common/button";
import { useParams } from "next/navigation";
import OtherEventComponent, { EventType } from "@/components/event/eventDetail/OtherEventComponent";
import EventBannerComponent from "@/components/event/eventDetail/EventBannerComponent";
import EventDetailComponent from "@/components/event/eventDetail/EventDetailComponent";
import { useRouter } from 'next/navigation';

const ADS_IMAGES = [
  "https://channel.mediacdn.vn/2020/9/1/image001-1598942183101793874251.png",
  "https://scontent.fhan3-5.fna.fbcdn.net/v/t1.6435-9/123303820_1759993807502691_3714347555369433142_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHZ0RbQk5fHkZfhiQR8q2DWXMZIB0GlZ8RcxkgHQaVnxJsse7pnPiS4yWU3i0btiSi9kuOYi5KvXZupXR0lK-Il&_nc_ohc=0i5FYrcwdawQ7kNvgGlnKVC&_nc_oc=AdiBfrIG3v7VzFssZTGHu_rLZAIfv-AZ35x1o3QSUCMhM8I3iVUX4XSLiyt6WSdzRvxaMGox4HMLdMpu__4Agh-J&_nc_zt=23&_nc_ht=scontent.fhan3-5.fna&_nc_gid=AVo7NYo7VNzQ6EW4SOw5mmy&oh=00_AYDmdbUG-mm7iG683hbVwAzLECZZ2YCVbktjVgOtbOABiA&oe=67F112C1",
];

interface Event {
  type: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const EventDetailPage = () => {
  const params = useParams();
  const eventId = params.eventId;
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [randomAdImage, setRandomAdImage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Random một ảnh quảng cáo khi component mount
    const randomIndex = Math.floor(Math.random() * ADS_IMAGES.length);
    setRandomAdImage(ADS_IMAGES[randomIndex]);

    const fetchEventType = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event type');
        }
        const data: ApiResponse<Event> = await response.json();
        setEventType(Number(data.data.type) as EventType);
      } catch (error) {
        console.error("Error fetching event type:", error);
      }
    };

    if (eventId) {
      fetchEventType();
    }
  }, [eventId]);

  if (!eventId) return <div>Loading...</div>;

  const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <EventBannerComponent eventId={eventIdString} />
        
        <div className="mt-8 border-t border-gray-100 pt-8">
          <EventDetailComponent 
            eventId={eventIdString} 
            advertisementImage={randomAdImage}
          />
        </div>

        {eventType && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Có thể bạn cũng thích
            </h3>
            <OtherEventComponent 
              eventType={eventType}
              currentEventId={eventIdString}
            />
            <div className="mt-6 text-center">
              <Button
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                label="Xem thêm"
                onClickButton={() => router.push("/event/eventlist")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
