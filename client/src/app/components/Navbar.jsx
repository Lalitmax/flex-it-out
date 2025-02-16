"use client";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { User, Trophy, Activity, Home, Share } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/lib/features/auth/authSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  // Function to verify token
  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token"); //
      if (!token) {
        dispatch(logout());
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/v1/user/verifyToken",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // console.log(response.data.success)
        dispatch(login(response.data.user)); // Update Redux state
        // console.log(response.data);
      } else {
        dispatch(logout()); // If invalid, log out
      }
    } catch (error) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    verifyUser(); // Run verification on mount
  }, []);

  return (
    <nav
      className={`px-4 py-3 md:py-5 md:px-6 lg:px-8 bg-white rounded-full shadow-sm mx-4 md:mx-6 lg:mx-8 ${
        isMenuOpen ? "rounded-b-none" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#0066FF]">
            FLEXITOUT
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
          >
            <Button >
              <Share  /> Share
            </Button>
          </Link>
          <Link
            href="/pages/activity"
            className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
          >
            <Activity className="w-5 h-5" /> Activity
          </Link>
          <Link
            href="/pages/leaderboard"
            className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" /> Leaderboard
          </Link>

          {isAuthenticated ? (
            <Link href="/pages/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="w-5 h-5" /> Profile
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-2 rounded-full ${
            isMenuOpen ? "bg-gray-100" : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-4 py-4 bg-white rounded-b-xl shadow-lg mx-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900"
            >
              Share
            </Link>
            <Link
              href="/pages/activity"
              className="text-gray-700 hover:text-gray-900"
            >
              Activity
            </Link>
            <Link
              href="/pages/leaderboard"
              className="text-gray-700 hover:text-gray-900"
            >
              Leaderboard
            </Link>
            {isAuthenticated ? (
              <Link
                href="/pages/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-5 h-5" /> Profile
                </Button>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
