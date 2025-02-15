import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import FitnessTracker from "./components/FitnessTracker"


export default function Page() {
  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-white pt-5">
      <Navbar />
      <Hero />
    </div>
  )
}
