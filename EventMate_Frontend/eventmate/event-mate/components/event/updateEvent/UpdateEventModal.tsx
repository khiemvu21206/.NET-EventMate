"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface UpdateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: { TimeStart: string; TimeEnd: string; banner?: File }) => void;
  event: {
    eventId: string;
    timeStart: string;
    timeEnd: string;
    img: string;
  };
}

export default function UpdateEventModal({ isOpen, onClose, onSubmit, event }: UpdateEventModalProps) {
  const [formData, setFormData] = useState({
    timeStart: "",
    timeEnd: "",
    banner: undefined as File | undefined,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        banner: undefined,
      });
      setPreviewUrl(event.img);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('formData ban đầu:', formData);
    
    // Chuyển đổi định dạng ngày giờ sang ISO string
    const formattedData = {
      TimeStart: new Date(formData.timeStart).toISOString(),
      TimeEnd: new Date(formData.timeEnd).toISOString(),
      banner: formData.banner
    };

    console.log('Dữ liệu trước khi gửi:', formattedData);
    onSubmit(formattedData);
    onClose();
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, banner: file }));
      console.log('formData sau khi cập nhật banner:', { ...formData, banner: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Cập nhật sự kiện</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian bắt đầu
            </label>
            <input
              type="datetime-local"
              value={formData.timeStart}
              onChange={(e) => setFormData(prev => ({ ...prev, timeStart: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian kết thúc
            </label>
            <input
              type="datetime-local"
              value={formData.timeEnd}
              onChange={(e) => setFormData(prev => ({ ...prev, timeEnd: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh banner
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="w-32 h-32 border rounded-lg overflow-hidden">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded border border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 