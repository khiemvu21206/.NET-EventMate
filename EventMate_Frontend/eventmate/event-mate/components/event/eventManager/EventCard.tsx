import React from "react";
import { useRouter } from "next/navigation";

interface Event {
  eventId: string;
  title: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  maxParticipants: number;
  currentParticipants: number;
  status: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  img: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (event.status === 1) {
      router.push(`/event/eventDetail/${event.eventId}`);
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-48 w-full">
        <img
          src={event.img || "/images/default-event.jpg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            <span className="font-medium">Thời gian:</span>{" "}
            {new Date(event.timeStart).toLocaleDateString("vi-VN")} -{" "}
            {new Date(event.timeEnd).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <span className="font-medium">Địa điểm:</span>{" "}
            {event.place}
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                event.status === 1
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {event.status === 1 ? "Đã công khai" : "Chờ xử lý"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 