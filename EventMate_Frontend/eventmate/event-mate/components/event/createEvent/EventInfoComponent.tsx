"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

// MenuBar: Thanh công cụ để định dạng văn bản và chèn ảnh
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Hàm chèn ảnh từ máy tính
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Hàm chèn liên kết
  const setLink = () => {
    const url = window.prompt("Nhập URL liên kết");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  // Hàm chèn bảng
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  // Hàm đặt màu chữ
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  // Hàm đặt màu nền
  const setHighlight = (color) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-gray-100 p-2 rounded-lg">
      {/* Nút tiêu đề (Heading) */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Tiêu đề 1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h6m0 0v10m0-10H3m12 0h6m-6 0v10m0-10h6"
          />
        </svg>
      </button>
      {/* Nút in đậm */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="In đậm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 4h3a3 3 0 013 3v1a3 3 0 01-3 3H9V4zm0 7h4a3 3 0 013 3v3a3 3 0 01-3 3H9v-6z"
          />
        </svg>
      </button>
      {/* Nút in nghiêng */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="In nghiêng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 4h6l-3 8H9l3-8zm0 8h6l-3 8H9l3-8z"
          />
        </svg>
      </button>
      {/* Nút gạch chân */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("underline")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Gạch chân"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 18h16M9 4v6a3 3 0 006 0V4"
          />
        </svg>
      </button>
      {/* Nút danh sách có thứ tự */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("orderedList")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Danh sách có thứ tự"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h2v2H3V4zm0 6h2v2H3v-2zm0 6h2v2H3v-2zm4 0h14M7 10h14M7 4h14"
          />
        </svg>
      </button>
      {/* Nút danh sách không thứ tự */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Danh sách không thứ tự"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h2v2H3V4zm0 6h2v2H3v-2zm0 6h2v2H3v-2zm4 0h14M7 10h14M7 4h14"
          />
        </svg>
      </button>
      {/* Nút căn trái */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Căn trái"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M3 9h8M3 13h12M3 17h8"
          />
        </svg>
      </button>
      {/* Nút căn giữa */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Căn giữa"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h18M6 9h12M3 13h18M6 17h12"
          />
        </svg>
      </button>
      {/* Nút căn phải */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Căn phải"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5h12M13 9h8M9 13h12M13 17h8"
          />
        </svg>
      </button>
      {/* Nút chèn liên kết */}
      <button
        onClick={setLink}
        className={`p-2 rounded-full transition-colors ${
          editor.isActive("link")
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        title="Chèn liên kết"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </button>
      {/* Nút chèn bảng */}
      <button
        onClick={insertTable}
        className={`p-2 rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300`}
        title="Chèn bảng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h18v18H3V3zm6 0v18M15 3v18M3 9h18M3 15h18"
          />
        </svg>
      </button>
      {/* Nút chèn ảnh */}
      <button
        onClick={addImage}
        className={`p-2 rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300`}
        title="Chèn ảnh"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      {/* Nút màu chữ */}
      <button
        onClick={() => setTextColor("#ff0000")}
        className="p-2 rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
        title="Màu chữ đỏ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>
      {/* Nút màu nền */}
      <button
        onClick={() => setHighlight("#ffff00")}
        className="p-2 rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
        title="Màu nền vàng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    </div>
  );
};

// Props của component
interface EventInfoProps {
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

// Component chính
export default function EventInfoComponent({ onNameChange, onDescriptionChange }: EventInfoProps) {
  const [name, setName] = useState("");

  // Khởi tạo trình soạn thảo Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onDescriptionChange(html);
    },
  });

  // Xử lý thay đổi tên sự kiện
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange(newName);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <style>
        {`
          .ProseMirror {
            min-height: 150px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: white;
            color: black;
          }
          .ProseMirror:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
          }
          .ProseMirror table {
            border-collapse: collapse;
            width: 100%;
          }
          .ProseMirror table td, .ProseMirror table th {
            border: 1px solid #ccc;
            padding: 5px;
          }
          .ProseMirror table th {
            background-color: #f0f0f0;
          }
        `}
      </style>

      <div className="flex flex-col space-y-4">
        {/* Phần nhập tên sự kiện */}
        <div>
          <label className="block font-semibold mb-2">*Tên sự kiện</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Nhập tên sự kiện"
            className="w-full text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Phần mô tả sự kiện với trình soạn thảo văn bản phong phú */}
        <div>
          <label className="block font-semibold mb-2">*Mô tả sự kiện</label>
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="bg-white text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}