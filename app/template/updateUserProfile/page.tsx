"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, ChangeEvent } from "react";

// Khai báo interface cho Profile
interface Profile {
  name: string;
  email: string;
  gender: string;
  dob: string;
  hobbies: string[];
  citizenID: string;
  description: string;
  avatar: string;
}

// Định nghĩa kiểu cho các lỗi (mỗi lỗi là một chuỗi)
type ProfileErrors = Partial<Record<keyof Profile, string>>;

export default function EditUserProfile() {
  // Khởi tạo state với kiểu Profile
  const [profile, setProfile] = useState<Profile>({
    name: "Admin",
    email: "admin@example.com",
    gender: "male",
    dob: "1990-01-01",
    hobbies: ["Soccer", "Watching Movie", "Games"],
    citizenID: "123456789",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatar: "/images/default-avatar.jpg",
  });

  // State cho lỗi validate, sử dụng kiểu ProfileErrors
  const [errors, setErrors] = useState<ProfileErrors>({});

  // Danh sách hobbies khả dụng
  const availableHobbies = [
    "Soccer",
    "Watching Movie",
    "Games",
    "Reading",
    "Traveling",
    "Cooking",
    "Music",
    "Coding",
    "Dancing",
  ];

  // Toggle cho list hobbies
  const [showHobbies, setShowHobbies] = useState(false);

  // Ref để trigger input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý thay đổi cho các trường input thông thường
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi giới tính (có animation)
  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, gender: value }));
  };

  // Xử lý checkbox cho hobbies
  const handleHobbyCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      if (!profile.hobbies.includes(value)) {
        setProfile((prev) => ({
          ...prev,
          hobbies: [...prev.hobbies, value],
        }));
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        hobbies: prev.hobbies.filter((h) => h !== value),
      }));
    }
  };


  // Xử lý upload avatar và preview ảnh
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm validate các trường thông tin
  const validateProfile = () => {
    let newErrors: ProfileErrors = {};
    if (!profile.name.trim()) {
      newErrors.name = "User Name không được để trống.";
    }
    if (!profile.dob) {
      newErrors.dob = "Date of Birth không được để trống.";
    }
    if (!profile.citizenID.trim()) {
      newErrors.citizenID = "Citizen ID không được để trống.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-5xl"
      >
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Edit Profile
        </h2>

        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Cột trái: Avatar, Upload Avatar, User Name, Description */}
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-300">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Nút Upload Avatar */}
            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1 bg-blue-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-blue-700"
              >
                Upload Avatar
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* User Name */}
            <motion.div
              className="relative w-full mt-6"
              whileFocus={{ scale: 1.05 }}
            >
              <label className="block mb-1 font-medium text-gray-700">
                User Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90 outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg focus:border-blue-500 focus:ring-blue-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </motion.div>

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
                name="description"
                value={profile.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90 outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg focus:border-blue-500 focus:ring-blue-400 placeholder:text-gray-500 placeholder:text-sm"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </motion.div>
          </div>

          {/* Cột phải: Date of Birth, Gender, Hobbies, Citizen ID */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6">
              {/* Date of Birth */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Date of Birth
                </label>
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90 outline-none transition-all duration-300 focus:ring-2 focus:shadow-lg focus:border-blue-500 focus:ring-blue-400"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                )}
              </motion.div>

              {/* Gender với animation chuyển đổi */}
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <label className="block mb-1 font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex items-center space-x-4">
                  {["male", "female", "other"].map((g) => (
                    <motion.label
                      key={g}
                      className={`flex items-center space-x-1 text-gray-700 cursor-pointer ${
                        profile.gender === g ? "font-bold" : ""
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={profile.gender === g}
                        onChange={handleGenderChange}
                        className="mr-1"
                      />
                      <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
                    </motion.label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </motion.div>

              {/* Hobbies: danh sách checkbox ẩn hiện */}
              <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">
                  Hobbies
                </label>
                <button
                  onClick={() => setShowHobbies(!showHobbies)}
                  className="w-full text-left rounded-md border border-gray-300 px-3 py-2 bg-white/90 text-gray-700 transition-all duration-300 focus:ring-2 focus:shadow-lg focus:border-blue-500 focus:ring-blue-400"
                >
                  {profile.hobbies.length > 0
                    ? `Selected (${profile.hobbies.length})`
                    : "Select Hobbies"}
                </button>
                <AnimatePresence>
                  {showHobbies && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 p-4 border border-gray-300 rounded-md bg-white/90 shadow-md"
                    >
                      {availableHobbies.map((hobby) => (
                        <div key={hobby} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`hobby-${hobby}`}
                            value={hobby}
                            checked={profile.hobbies.includes(hobby)}
                            onChange={handleHobbyCheckboxChange}
                            className="mr-2"
                          />
                          <label htmlFor={`hobby-${hobby}`} className="text-gray-700">
                            {hobby}
                          </label>
                        </div>
                      ))}
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => setShowHobbies(false)}
                          className="px-4 py-1 bg-blue-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-blue-700"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.hobbies && (
                  <p className="text-red-500 text-sm mt-1">{errors.hobbies}</p>
                )}
                {/* Hiển thị các tag sở thích đã chọn */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Citizen ID */}
              <motion.div className="relative">
                <label className="block mb-1 font-medium text-gray-700">
                  Citizen ID
                </label>
                <button
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 bg-white/90 transition-all duration-300 focus:ring-2 focus:shadow-lg focus:border-blue-500 focus:ring-blue-400"
                >
                  {profile.citizenID || "Update Citizen ID"}
                </button>
                {errors.citizenID && (
                  <p className="text-red-500 text-sm mt-1">{errors.citizenID}</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Nút Save và Cancel */}
        <div className="mt-12 flex justify-center space-x-4">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.3)",
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
            
          >
            Save Changes
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold transition-all duration-300 hover:bg-gray-500 hover:shadow-lg"
            
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
