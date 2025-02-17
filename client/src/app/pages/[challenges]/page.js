"use client"
import Challenges from '@/app/components/Challenges'
import Navbar from '@/app/components/Navbar'
import { useRouter } from 'next/navigation'
 import React from 'react'

const Page = ({ params }) => {
    const pathName = window.location.pathname;
    const digitsAtEnd = pathName.match(/\d+$/); // Match digits at the end of the string
    const roomId = digitsAtEnd ? digitsAtEnd[0] : Math.floor(Math.random() * 10000).toString();


    return (
        <div className="bg-gradient-to-b px-4 from-blue-50 to-white pt-5 mb-3">
            <Navbar />
            <Challenges roomId={roomId} /> {/* Pass roomId to the Challenges component */}
        </div>
    )
}

export default Page