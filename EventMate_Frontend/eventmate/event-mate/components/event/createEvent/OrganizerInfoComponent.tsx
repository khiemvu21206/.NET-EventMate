"use client";
import React, { useState } from "react";

interface OrganizerInfoProps {
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onLogoChange: (file: File) => void;
}

export default function OrganizerInfoComponent({ onNameChange, onDescriptionChange, onLogoChange }: OrganizerInfoProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange(newName);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onDescriptionChange(newDescription);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLogoChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <div className="flex gap-6">
        {/* Logo bên trái */}
        <div className="w-1/4">
          <label className="block font-semibold mb-2">Logo tổ chức</label>
          <div className="aspect-square w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="organizer-logo"
            />
            <label
              htmlFor="organizer-logo"
              className="block w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  className="w-full h-full object-contain rounded-lg p-2"
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
                    Click để chọn logo
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Thông tin bên phải */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <label className="block font-semibold mb-2">*Tên tổ chức</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Nhập tên tổ chức"
              className="w-full text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">*Mô tả tổ chức</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Nhập mô tả về tổ chức"
              rows={7}
              className="w-full text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 