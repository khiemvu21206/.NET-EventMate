"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventCreateModel, EventRepository } from "@/repositories/EventRepository";
import LeftNavbar from "@/components/event/createEvent/LeftNavbarComponent";
import TopNavbar from "@/components/event/createEvent/TopNavbarComponent";
import UploadImage from "@/components/event/createEvent/UploadImageComponent";
import EventInfoComponent from "@/components/event/createEvent/EventInfoComponent";
import EventLocationComponent from "@/components/event/createEvent/EventLocationComponent";
import EventCategoryComponent from "@/components/event/createEvent/EventCategoryComponent";
import OrganizerInfoComponent from "@/components/event/createEvent/OrganizerInfoComponent";
import EventTimeComponent from "@/components/event/createEvent/EventTimeComponent";
import NoticeModal from "@/components/event/createEvent/NoticeModal";


interface FormData extends Omit<EventCreateModel, 'userId'> {
  img?: File;
  banner?: File;
  organizerLogo?: File;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // State cho form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    place: "",
    timeStart: "",
    timeEnd: "",
    description: "",
    type: 0,
    organizerName: "",
    organizerDescription: "",
  });

  // Khi vào trang, mở modal ngay lập tức
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsContentVisible(true);
  };

  // Xử lý thay đổi dữ liệu form
  const handleFormChange = (field: keyof FormData, value: string | number | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Xử lý tạo sự kiện
  const handleCreateEvent = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Validate dữ liệu
      if (!formData.name || !formData.place || !formData.timeStart || !formData.timeEnd) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      if (new Date(formData.timeStart) >= new Date(formData.timeEnd)) {
        setError("Thời gian bắt đầu phải trước thời gian kết thúc");
        return;
      }

      const apiResponse = await EventRepository.createEvent(formData);

      if (apiResponse.status === 201 && apiResponse.key === 'event-created') {
        if (apiResponse.data?.eventId) {
          router.push('/event/manageEvent');
        } else {
          setError("Không tìm thấy ID sự kiện");
        }
      } else {
        setError("Có lỗi xảy ra khi tạo sự kiện");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Có lỗi xảy ra khi tạo sự kiện");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Thanh navbar bên trái */}
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        <LeftNavbar />
      </div>

      {/* Phần nội dung chính */}
      <div className="flex flex-col flex-1 ml-64 bg-gray-400 min-h-screen">
        {/* Navbar trên cùng */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-gray-900 z-50">
          <TopNavbar currentTitle="Tạo sự kiện" />
        </div>

        {/* Nội dung chỉ hiển thị khi người dùng tắt modal */}
        {isContentVisible && (
          <>
            <div className="w-full mt-[100px] px-8 space-y-6">
              <UploadImage 
                onImageChange={(file: File) => handleFormChange('img', file)} 
                onBannerChange={(file: File) => handleFormChange('banner', file)} 
              />
            </div>
            <div className="w-full mt-4 px-8 space-y-6">
              <EventInfoComponent 
                onNameChange={(name: string) => handleFormChange('name', name)}
                onDescriptionChange={(description: string) => handleFormChange('description', description)}
              />
            </div>

            <div className="w-full mt-4 px-8 space-y-6">
              <EventLocationComponent 
                onPlaceChange={(place: string) => handleFormChange('place', place)}
              />
            </div>

            <div className="w-full mt-4 px-8 space-y-6">
              <EventCategoryComponent 
                onTypeChange={(type: number) => handleFormChange('type', type)}
              />
            </div>

            <div className="w-full mt-4 px-8 space-y-6">
              <OrganizerInfoComponent 
                onNameChange={(name: string) => handleFormChange('organizerName', name)}
                onDescriptionChange={(description: string) => handleFormChange('organizerDescription', description)}
                onLogoChange={(file: File) => handleFormChange('organizerLogo', file)}
              />
            </div>

            <div className="w-full mt-4 px-8 space-y-6">
              <EventTimeComponent 
                onStartTimeChange={(time: string) => handleFormChange('timeStart', time)}
                onEndTimeChange={(time: string) => handleFormChange('timeEnd', time)}
              />
            </div>

            {error && (
              <div className="w-full px-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </div>
            )}

            <div className="w-full mt-4 mb-4 px-8 flex justify-center space-x-4">
              <button 
                className="bg-gray-100 text-black px-4 py-2 rounded border border-gray-400 hover:bg-gray-300"
                onClick={() => router.back()}
              >
                Hủy
              </button>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                onClick={handleCreateEvent}
                disabled={isLoading}
              >
                {isLoading ? "Đang tạo..." : "Tạo sự kiện"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal hiển thị khi vào trang */}
      <NoticeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
} 