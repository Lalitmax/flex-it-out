"use client";
import React, { useEffect, useState } from "react";
import Challenges from "@/app/components/Challenges";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";

const Page = ({ params }) => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const socketRoomId = nanoid(10);
  const [isReady, setIsReady] = useState(false);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Guard for server environment
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const pathName = typeof window !== "undefined" ? window.location.pathname : "";
    const digitsAtEnd = pathName.match(/\d+$/);
    const computedRoomId = digitsAtEnd
      ? digitsAtEnd[0]
      : Math.floor(Math.random() * 10000).toString();

    setRoomId(computedRoomId);
    setIsReady(true);
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="bg-gradient-to-b px-4 from-blue-50 to-white pt-5 mb-3">
      <Navbar />
      <Challenges roomId={roomId} clientId={socketRoomId} />
    </div>
  );
};

export default Page;
