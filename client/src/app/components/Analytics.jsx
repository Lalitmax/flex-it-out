"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import "react-circular-progressbar/dist/styles.css"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"

const Analytics = () => {
  const [data, setData] = useState({
    pushUps: 0,
    curls: 0,
    squats: 0,
    caloriesBurned: 0,
  });
  const [history, setHistory] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(100);
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode
  const router = useRouter()
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) setDailyGoal(Number.parseInt(savedGoal, 10));
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, historyRes] = await Promise.all([
        axios.get("https://flex-it-out.onrender.com/api/v1/user/getAnalytics", {
          withCredentials: true,
        }),
        axios.get("https://flex-it-out.onrender.com/api/v1/user/getExerciseHistory", {
          withCredentials: true,
        }),
      ]);

      if (analyticsRes.data.success) {
        setData({
          pushUps: analyticsRes.data.pushUps ?? 0,
          curls: analyticsRes.data.curls ?? 0,
          squats: analyticsRes.data.squats ?? 0,
          caloriesBurned: analyticsRes.data.caloriesBurned ?? 0,
        });
      }

      if (historyRes.data.success) {
        const formattedData = historyRes.data.history.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString(),
          pushUps: entry.pushUps,
          curls: entry.curls,
          squats: entry.squats,
          caloriesBurned: entry.caloriesBurned,
        }));
        setHistory(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGoalChange = (e) => {
    const newGoal = Number.parseInt(e.target.value, 10) || 0;
    setDailyGoal(newGoal);
  };

  const handleSave = () => {
    localStorage.setItem("dailyGoal", dailyGoal);
    setIsEditing(false); // Hide the input field after saving
  };

  const progress = Math.min((data.caloriesBurned / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - data.caloriesBurned, 0);

  return (
    <div className="px-4   text-gray-900 rounded-xl ">
      <h2 className="text-2xl font-bold text-center mb-4">🏋️ Workout Analytics</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Left Side: Exercise Stats */}
        <div className="space-y-2 col-span-1">
          <div className="p-2 bg-blue-300 rounded-lg text-center">💪 Push-ups: {data.pushUps}</div>
          <div className="p-2 bg-green-300 rounded-lg text-center">🏋️ Squats: {data.squats}</div>
          <div className="p-2 bg-purple-300 rounded-lg text-center">🌀 Curls: {data.curls}</div>
          <div className="p-2 bg-red-300 rounded-lg text-center font-bold">
            🔥 Calories Burned: {data.caloriesBurned?.toFixed(2)}
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex flex-col items-center justify-center col-span-1">
          <div className="w-32 h-32 mb-2">
            <CircularProgressbar
              value={progress}
              text={`${progress.toFixed(0)}%`}
              styles={buildStyles({
                pathColor: progress >= 100 ? "#4CAF50" : "#00BFFF",
                trailColor: "#ddd",
                textColor: "#333",
                textSize: "16px",
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <p className="text-sm text-center mb-2">
            {remaining > 0 ? `🚀 Need ${remaining.toFixed(2)} more calories!` : "🎉 Goal Completed!"}
          </p>
        </div>

        {/* Right Side: Set Daily Calorie Goal */}
        <div className="col-span-1 bg-gray-900 rounded-2xl px-4 md:px-10 flex flex-col items-center justify-center">
          <label className="text-sm md:text-lg  text-center font-semibold mb-1 block text-white">🎯 Set Daily Calorie Goal:</label>
          {!isEditing ? (
            <div className="items-center gap-2 w-full flex flex-col">
              <div
                className=" w-full bg-gray-100 text-gray-900 text-center text-sm p-2 rounded-lg select-none"
          
              >
                {dailyGoal}
              </div>
              <button
                className="bg-blue-600 w-20 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full bg-gray-100 text-gray-900 text-center text-sm p-2 rounded-lg"
                value={dailyGoal}
                onChange={handleGoalChange}
                min="1"
                autoFocus
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-[#1c3261] rounded-md pt-2">
        <h3 className="text-lg text-white font-semibold text-center mb-2">📅 Last 10 Days Summary</h3>
        <ResponsiveContainer height={350}>
          <BarChart data={history} barGap={1} barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} />
            <YAxis stroke="#666" tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
            <Legend wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="caloriesBurned" fill="#FFD700" name="🔥 Calories" />
            <Bar dataKey="pushUps" fill="#FF5733" name="💪 Push-ups" />
            <Bar dataKey="curls" fill="#00BFFF" name="🌀 Curls" />
            <Bar dataKey="squats" fill="#32CD32" name="🏋️ Squats" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;