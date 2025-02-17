import Navbar from '@/app/components/Navbar'
import UserProfileManagement from '@/app/components/UserProfileManagement'
import React from 'react'

const page = () => {
    // const user = { firstName: "Lalit", lastName: "Max", currentPassword: "123", newPassword: "234234" }
    return (
        <>
            <div className="bg-[#F4F9FF] flex flex-col min-h-screen gap-14  pt-5">
                <Navbar />
                <UserProfileManagement  />
            </div>

        </>
    )
}

export default page