"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
interface Profile {
  userId: string;
  fullName: string;
  email: string;
  avatar: string | File;
  avatarPreview?: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  companyName: string;
  role: string;
  description: string;
}

type ProfileErrors = Partial<Record<keyof Profile, string>>;

interface EditUserProfileProps {
  userId: string;
}

export default function EditUserProfile({ userId }: EditUserProfileProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    userId: "",
    fullName: "",
    email: "",
    avatar: "/images/default-avatar.jpg",
    dateOfBirth: "",
    address: "",
    phone: "",
    companyName: "",
    role: "",
    description: "",
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const { data: userData } = await response.json();
      setProfile({
        userId: userData.userId,
        fullName: userData.fullName || "",
        email: userData.email || "",
        avatar: userData.avatar || "/images/default-avatar.jpg",
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split("T")[0] : "",
        address: userData.address || "",
        phone: userData.phone || "",
        companyName: userData.companyName || "",
        role: userData.role || "",
        description: userData.description || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setErrors({ form: "Failed to load profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "This field cannot be empty or just spaces" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name]; 
        return newErrors;
      });
    }
  };
  


  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      if (!validImageTypes.includes(file.type)) {
        setErrors({ avatar: "Only JPG, PNG, GIF, or WEBP images are allowed" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ avatar: "Image must be less than 2MB" });
        return;
      }

      setProfile((prev) => ({ ...prev, avatar: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatarPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCancel = () => {
    router.push(`/profile/${userId}`); // Redirect to User Profile on cancel
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const newErrors: ProfileErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = "Full Name cannot be empty or just spaces";
    }
    if (!profile.address.trim()) {
      newErrors.address = "Address cannot be empty or just spaces";
    }

    if (!profile.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth cannot be empty";
    }
    if (profile.role === "28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4" ) {
      if (!profile.companyName.trim()) {
        newErrors.companyName = "Company Name cannot be empty or just spaces";
      }
      if (!profile.phone.trim()) {
        newErrors.phone = "Phone cannot be empty or just spaces";
      } else if (!/^\d{10,11}$/.test(profile.phone.trim())) {
        newErrors.phone = "Phone must be 10-11 digits";
      }
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("FullName", profile.fullName);
      formData.append("DateOfBirth", profile.dateOfBirth);
      formData.append("Address", profile.address);
      formData.append("Description", profile.description);
      formData.append("Phone", profile.phone);
      formData.append("CompanyName", profile.companyName);
   
      if (profile.avatar instanceof File) {
        formData.append("Avatar", profile.avatar);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 200) {
        await router.push(`/profile/${userId}`);
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrors({ form: error.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('/images/bg-01.jpg')" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-5xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Edit Profile</h2>

        {isLoading && <div className="text-center">Loading...</div>}
        {errors.form && <div className="text-red-500 text-center mb-4">{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-300">
                         <img 
  src={profile.avatarPreview || (typeof profile.avatar === "string" ? `${profile.avatar}?t=${Date.now()}` : "/images/default-avatar.jpg")} 
  alt="Avatar" 
  className="w-full h-full object-cover" 
/>
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()} 
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
                disabled={isLoading}
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
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
              
            <textarea
    name="description"
    value={profile.description}
    onChange={handleTextareaChange}
    placeholder="Write something about yourself..."
    className="mt-2 w-full text-left text-gray-600 focus:outline-none resize-none border border-gray-300 rounded-md p-2"
    rows={3}
  />
            </div>


            <div className="flex-1 grid grid-cols-1 gap-6">
              <motion.div whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={profile.fullName} 
                  onChange={handleInputChange} 
                  className="w-full rounded-md border px-3 py-2 text-gray-700"
                  disabled={isLoading}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </motion.div>

              <motion.div whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profile.email} 
                  disabled 
                  className="w-full rounded-md border px-3 py-2 text-gray-700 bg-gray-100" 
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={profile.address} 
                  onChange={handleInputChange} 
                  className="w-full rounded-md border px-3 py-2 text-gray-700"
                  disabled={isLoading}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </motion.div>

              {profile.role === "28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4" && (
  <>
    <motion.div whileFocus={{ scale: 1.05 }}>
      <label className="block mb-1 font-medium text-gray-700">Company Name</label>
      <input
        type="text"
        name="companyName"
        value={profile.companyName}
        onChange={handleInputChange}
        className="w-full rounded-md border px-3 py-2 text-gray-700"
        disabled={isLoading}
      />
      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
    </motion.div>

    <motion.div whileFocus={{ scale: 1.05 }}>
      <label className="block mb-1 font-medium text-gray-700">Phone</label>
      <input
        type="text"
        name="phone"
        value={profile.phone}
        onChange={handleInputChange}
        className="w-full rounded-md border px-3 py-2 text-gray-700"
        disabled={isLoading}
      />
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
    </motion.div>
  </>
)}


              <motion.div whileFocus={{ scale: 1.05 }}>
                <label className="block mb-1 font-medium text-gray-700">Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={profile.dateOfBirth} 
                  onChange={handleInputChange} 
                  max={today}
                  className="w-full rounded-md border px-3 py-2 text-gray-700"
                  disabled={isLoading}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </motion.div>

            
            </div>
          </div>

          <div className="mt-12 flex justify-center space-x-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button 
              type="button" 
              disabled={isLoading}
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-md font-semibold hover:bg-gray-500 disabled:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}