// components/UserProfile.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/button";
import Link from "next/link";
import ChangePasswordModal from "@/components/authen/ChangePasswordModal";
import { fetchUserProfile } from "@/repositories/UserRepository";

interface UserProfileProps {
  userId: string;
}

interface UserProfileData {
  fullName: string;
  email: string;
  avatar: string | File;
  phone: string;
  avatarPreview?: string;
  dateOfBirth: string;
  createdAt: string;
  address: string;
  role: string;
  companyName?: string;
  description?: string;
}

const getAvatarUrl = (avatar: string | File): string => {
  if (typeof avatar === 'string') return avatar;
  return URL.createObjectURL(avatar);
};

export default function UserProfile({ userId }: UserProfileProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId, session]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen">Profile not found</div>;

  const formattedCreatedAt = profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "N/A";
  const formattedDOB = profile.dateOfBirth
  ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  : "N/A";


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}>
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-5xl mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Profile Information</h2>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
          <img 
            src={profile.avatarPreview || getAvatarUrl(profile.avatar) || "/images/default-avatar.jpg"} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
</div>

            <div className="mt-4 text-xl font-semibold text-gray-700">{profile.fullName}</div>
            {profile.description && (
    <div className="mt-2 text-gray-600 text-center">{profile.description}</div>
  )}
  
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserProfileField label="User Email" value={profile.email} />
              <UserProfileField label="Date of Birth" value={formattedDOB} />
              <UserProfileField label="Account Created At" value={formattedCreatedAt} />
              <UserProfileField label="Address" value={profile.address} />

              {profile.role === "28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4" && (
  <>
    <UserProfileField label="Company Name" value={profile.companyName || ""} />
    <UserProfileField label="Phone" value={profile.phone || ""} />
  </>
)}

            </div>
          </div>
        </div>

         {/* Nút Edit Profile và Change Password */}
         <div className="mt-16 flex space-x-4 justify-center">
          <Link href={`/updateUserProfile/${userId}`} legacyBehavior>
            <a>
              <Button
                label="Edit Profile"
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
              />
            </a>
          </Link>

          {/* Bao bọc nút Change Password để bắt sự kiện click */}
          <div onClick={() => setShowChangePassword(true)}>
            <Button
              label="Change Password"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            />
          </div>
          <Link href={`/media`} legacyBehavior>
            <a>
              <Button
                label="Your Album"
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
              />
            </a>
          </Link>
        </div>

        {/* Modal Change Password */}
        {showChangePassword && (
          <ChangePasswordModal
            isOpen={showChangePassword}
            closeModal={() => setShowChangePassword(false)}
          />
        )}
      </div>
    </div>
  );
}

function UserProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative col-span-2 md:col-span-1">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <Input readOnly type="text" value={value || ""} className="w-full border border-gray-300 focus:border-gray-400" />
    </div>
  );
}
