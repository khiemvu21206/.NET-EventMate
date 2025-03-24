"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InviteDetailComponent({ params }) {
  const router = useRouter();
  const [group, setGroup] = useState(null);

  // Giả lập dữ liệu nhóm (thay thế bằng API thực tế nếu có)
  useEffect(() => {
    const groupData = {
      id: params.id,
      name: "Nhóm Rockers",
      leader: "John Doe",
      members: [
        { id: 1, name: "Alice Smith" },
        { id: 2, name: "Bob Johnson" },
        { id: 3, name: "Charlie Brown" }
      ],
      status: "Công khai",
      event: "#5678",
      description: "Nhóm dành cho những ai yêu thích rock!",
      img: "https://via.placeholder.com/300"
    };
    setGroup(groupData);
  }, [params.id]);

  if (!group) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl bg-white shadow-lg rounded-2xl border border-gray-200">
      <button 
        onClick={() => router.back()} 
        className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
      >
        ← Quay lại
      </button>
      
      <div className="flex flex-col items-center text-center">
        <img className="w-32 h-32 object-cover rounded-full border-4 border-gray-300" src={group.img} alt="Group Avatar" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">{group.name}</h1>
        <p className="text-gray-600">Leader: <span className="font-medium">{group.leader}</span></p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-gray-700">Trạng thái: <span className="font-medium">{group.status}</span></p>
        <p className="text-gray-700">Sự kiện liên quan: <span className="font-medium">{group.event}</span></p>
        <p className="text-gray-700">Mô tả: {group.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Thành viên trong nhóm</h2>
        <ul className="bg-gray-100 p-4 rounded-lg">
          {group.members.map(member => (
            <li key={member.id} className="text-gray-700 py-1">{member.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition shadow-md">
          Tham gia nhóm
        </button>
      </div>
    </div>
  );
}