"use client";
import React from "react";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  if (!isOpen) return null;

  return (
    // Nền mờ phủ toàn màn hình
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Hộp modal */}
      <div className="bg-gray-100 w-full max-w-lg mx-4 rounded-md shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          LƯU Ý KHI ĐĂNG TẢI SỰ KIỆN
        </h2>
        <p className="mb-2">
          1. Vui lòng <b>không hiển thị thông tin liên lạc của Ban Tổ Chức</b> (ví dụ: Số điện thoại, Email, Website, Facebook, Instagram...) <b>trên banner và trong nội dung bài đăng</b>. Chỉ sử dụng duy nhất Hotline EventMate - 1900.6408.
        </p>
        <p className="mb-2">
          2. Trong trường hợp Ban tổ chức tạo mới hoặc cập nhật sự kiện không đúng theo quy định nêu trên, EventMate có quyền từ chối phê duyệt sự kiện.
        </p>
        <p className="mb-2">
          3. EventMate sẽ liên tục kiểm tra thông tin các sự kiện đang được hiển thị trên nền tảng. Nếu phát hiện có sai phạm liên quan đến hình ảnh/ nội dung bài đăng, EventMate có quyền gỡ bỏ hoặc từ chối cung cấp dịch vụ đối với các sự kiện này, dựa theo điều khoản 2.9 trong Hợp đồng dịch vụ.
        </p>

        {/* Nút OK */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
} 