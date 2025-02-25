"use client"
import Dashboard from "@/components/basic/Dashboard";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { EM_STATUS } from "@/constants/constant";
import { useEffect } from "react";

export default function Home() {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === EM_STATUS.loading) return;

    if (status === EM_STATUS.unauthenticated) {
        window.location.replace('/login');
        return;
    }
    console.log(data,status);
    if (data) {
        router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [status]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    
    <Dashboard  />
    </div>
  );
}
