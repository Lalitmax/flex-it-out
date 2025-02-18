"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const router = useRouter()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated]);


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/user/getLeaderboard", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          setError("Failed to fetch leaderboard data");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">⚠️ {error}</p>
      </div>
    );
  }

  // Order winners in podium order: 2nd, 1st, 3rd
  const podiumOrder = [
    leaderboard[1], // Second place
    leaderboard[0], // First place
    leaderboard[2], // Third place
  ];

  return (
    <div className="p-6 bg-gray-900   text-white rounded-3xl">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1">🏆 Exercise Leaderboard</h1>
        <p className="text-gray-400">Top Performers of the Week</p>
      </div>

      {/* Podium Section */}
      <div className="relative flex items-end justify-center gap-8 mb-5 flex-wrap md:flex-nowrap">
        {podiumOrder.map((user, index) => {
          const position = [1, 0, 2][index];
          const podiumHeight = position === 0 ? "h-72 sm:h-56" : position === 1 ? "h-64 sm:h-48" : "h-56 sm:h-40";
          const medalColor = position === 0 ? "bg-yellow-500" : position === 1 ? "bg-gray-400" : "bg-yellow-700";
          
          return (
            <div key={index} className="flex flex-col items-center mb-8 sm:mb-4">
              {/* Medal Indicator */}
              <div className={`w-12 h-12 ${medalColor} rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-lg`}>
                #{position + 1}
              </div>

              {/* User Card */}
              <div className="flex flex-col items-center mb-1">
                <div className="w-20 h-20 rounded-full bg-gray-800 shadow-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xl font-semibold">{user.name}</span>
                <span className="text-blue-400">Total: {user.totalExercises}</span>
              </div>

              {/* Podium Platform */}
              <div className={`w-48 ${podiumHeight} bg-gray-800 rounded-t-2xl rounded-b-lg shadow-2xl p-6`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Push-ups:</span>
                    <span className="font-bold">{user.pushUps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Curls:</span>
                    <span className="font-bold">{user.curls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Squats:</span>
                    <span className="font-bold">{user.squats}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivating Message */}
      <div className="text-center bg-gray-800 p-3 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <p className="text-xl font-semibold mb-2">🎉 Keep Pushing Your Limits! 🎉</p>
        <p className="text-gray-400">Every rep counts - climb your way to the top!</p>
      </div>
    </div>
  );
}
