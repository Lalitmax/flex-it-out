import Leaderboard from "@/app/components/Leaderboard";
import Navbar from "@/app/components/Navbar";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
      <Navbar />
      <Leaderboard />
    </div>
  );
};

export default page;
