"use client";
import React, { useState } from "react";

interface UploadImageProps {
  onImageChange: (file: File) => void;
  onBannerChange: (file: File) => void;
}

export default function UploadImage({ onImageChange, onBannerChange }: UploadImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
   
        onBannerChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <div className="flex flex-row gap-6">
        {/* Ảnh sự kiện - bên trái */}
        <div className="w-1/4">
          <label className="block font-semibold mb-2">Ảnh sự kiện</label>
          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="event-image"
            />
            <label
              htmlFor="event-image"
              className="block aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-400">
                    Click để chọn ảnh
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Ảnh banner - bên phải */}
        <div className="w-3/4">
          <label className="block font-semibold mb-2">Ảnh banner</label>
          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              id="event-banner"
            />
            <label
              htmlFor="event-banner"
              className="block w-full aspect-[3/1] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              {bannerPreviewUrl ? (
                <img
                  src={bannerPreviewUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-400">
                    Click để chọn ảnh banner
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 