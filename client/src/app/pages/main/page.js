import FitnessTracker from "@/app/components/FitnessTracker";
import Navbar from "@/app/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-8  pt-5">
        <Navbar />
        <FitnessTracker />
      </div>
    </>
  );
};

export default page;
