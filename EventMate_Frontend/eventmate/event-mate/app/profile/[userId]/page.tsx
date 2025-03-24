// pages/profile.tsx
"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/authen/userProfile/UserProfile";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  return <UserProfile userId={userId} />;
}
