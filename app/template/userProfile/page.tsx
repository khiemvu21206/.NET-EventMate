"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function UserProfile() {
  // Dữ liệu giả lập của user
  const [profile] = useState({
    name: "Admin",
    email: "admin@example.com",
    gender: "male", // male | female | other
    dob: "1990-01-01",
    groupSuccessCount: 5, // Số lần tạo group tham gia sự kiện thành công
    accountCreatedAt: "2023-01-01",
    hobbies: ["Soccer", "Watching Movie", "Games"],
    citizenID: "123456789",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}
    >
      {/* Container chính với hiệu ứng scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-5xl mx-4"
      >
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
          Profile Information
        </h2>

        {/* Khối chính: Avatar & Description (trái) + Thông tin chi tiết (phải) */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Cột trái: Avatar + Tên hiển thị + Description */}
          <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
            {/* Avatar (icon user) */}
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-16 h-16 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9A3.75 3.75 0 118.25 9a3.75 3.75 0 017.5 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 21a8.25 8.25 0 00-15 0"
                />
              </svg>
            </div>

            {/* Tên user (hiển thị, không chỉnh sửa) */}
            <div className="mt-4 text-xl font-semibold text-gray-700">
              {profile.name}
            </div>

            {/* Description */}
            <motion.div
              className="relative w-full mt-4"
              whileFocus={{ scale: 1.05 }}
            >
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.05 }}
                rows={5}
                readOnly
                value={profile.description}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                  outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                  focus:border-blue-500 focus:ring-blue-400 placeholder:text-gray-500 placeholder:text-sm"
              />
            </motion.div>
          </div>

          {/* Cột phải: Thông tin chi tiết, chia thành grid 2 cột */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 - Email */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  User Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="email"
                  readOnly
                  value={profile.email}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                    outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                    focus:border-blue-500 focus:ring-blue-400"
                />
              </motion.div>

              {/* Row 1 - Date of Birth */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Date of Birth
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="date"
                  readOnly
                  value={profile.dob}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                    outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                    focus:border-blue-500 focus:ring-blue-400"
                />
              </motion.div>

              {/* Row 2 - Account Created At */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Account created at
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="date"
                  readOnly
                  value={profile.accountCreatedAt}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                    outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                    focus:border-blue-500 focus:ring-blue-400"
                />
              </motion.div>

              {/* Row 2 - Group success count */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Group success count
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="number"
                  readOnly
                  value={profile.groupSuccessCount}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                    outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                    focus:border-blue-500 focus:ring-blue-400"
                />
              </motion.div>

              {/* Row 3 - Citizen ID */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Citizen ID
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="text"
                  readOnly
                  value={profile.citizenID}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90
                    outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg 
                    focus:border-blue-500 focus:ring-blue-400"
                />
              </motion.div>


              {/* Row 4 - Hobbies */}
              <div className="col-span-1 md:col-span-1">
                <label className="block mb-1 font-medium text-gray-700">
                  Hobbies
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 4 - Gender */}
              <motion.div className="relative">
                <label className="block mb-1 font-medium text-gray-700">Gender</label>
                <div className="flex items-center space-x-4">
                  {["male", "female", "other"].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center space-x-1 text-gray-700 ${profile.gender === g ? "font-bold" : ""
                        }`}
                    >
                      <input type="radio" disabled checked={profile.gender === g} />
                      <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Nút Edit Profile và Change Password */}
        <div className="mt-16 flex space-x-4 justify-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.3)",
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold 
                       transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
          >
            Edit Profile
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold 
                       transition-all duration-300 hover:bg-gray-500 hover:shadow-lg"
          >
            Change Password
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
