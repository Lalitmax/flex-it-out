"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import FitnessTracker from "@/app/components/FitnessTracker";
import Navbar from "@/app/components/Navbar";

const Page = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();  

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) {
    return null;  
  }

  return (
    <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-8 pt-5">
      <Navbar />
      <FitnessTracker />
    </div>
  );
};

export default Page;
