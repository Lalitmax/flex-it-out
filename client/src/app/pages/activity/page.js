import React from 'react'
import Analytics from '@/app/components/Analytics'
import Navbar from '@/app/components/Navbar'

const page = () => {
  return (
    <>
    <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
        <Navbar/>
        <Analytics/>
    </div>
    </>
    
  )
}

export default page