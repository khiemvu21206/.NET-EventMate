import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/providers/UserProvider";
import EventCard from "./EventCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

interface Event {
  id: string;
  title: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id, status, token } = useUserContext();

  const fetchEvents = async () => {
    try {
      if (status === "unauthenticated") {
        setError("Vui lòng đăng nhập để xem danh sách sự kiện");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEvents(data.data);
      } else {
        setError(data.message || "Có lỗi xảy ra khi tải danh sách sự kiện");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách sự kiện");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchEvents();
    }
  }, [id, status, token]);

  const handleCreateEvent = () => {
    router.push("/event/createEvent");
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Danh sách sự kiện</h1>
        <button
          onClick={handleCreateEvent}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tạo sự kiện mới
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Bạn chưa tạo sự kiện nào</p>
          <button
            onClick={handleCreateEvent}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Tạo sự kiện đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={`${event.id}-${index}`} event={event} />
          ))}
        </div>
      )}
    </div>
  );
} 