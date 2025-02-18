'use client'
import dynamic from 'next/dynamic';


const Hero = dynamic(() => import('./components/Hero'), { ssr: false });
const Navbar = dynamic(() => import('./components/Navbar'), { ssr: false });


export default function Page() {
  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-white pt-5">
      <Navbar />
    
      <Hero />
    </div>
  )
}
