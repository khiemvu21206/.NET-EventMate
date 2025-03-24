"use client";

export default function InviteComponent() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 flex items-center justify-between border border-gray-200">
      {/* Phần hiển thị ảnh và thông tin nhóm */}
      <div className="flex items-center space-x-4">
        {/* Ảnh nhóm */}
        <img 
          className="w-16 h-16 object-cover rounded-full border-2 border-gray-300" 
          src="https://via.placeholder.com/150" 
          alt="Group Avatar" 
        />
        {/* Thông tin cơ bản */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Tên Nhóm</h2>
          <p className="text-sm text-gray-500">Leader: Tên Leader</p>
        </div>
      </div>
      
      {/* Nút thao tác */}
      <div className="flex space-x-2">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shadow-md">
          Xem chi tiết
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition shadow-md">
          Tham gia
        </button>
      </div>
    </div>
  );
}
