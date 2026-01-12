"use client"
import React from 'react'
import Analytics from '@/app/components/Analytics'
import Navbar from '@/app/components/Navbar'
import { useRouter } from "next/navigation";


const page = () => {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <>
      <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
        <Navbar />
        <Analytics />
      </div>
    </>

  )
}

export default page
