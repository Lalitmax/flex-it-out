"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "react-circular-progressbar/dist/styles.css";

const Analytics = () => {
  const [data, setData] = useState({
    pushUps: 0,
    curls: 0,
    squats: 0,
    caloriesBurned: 0,
  });
  const [history, setHistory] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(100); // Default goal

  // Load daily goal from localStorage if available
  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    if (savedGoal) setDailyGoal(parseInt(savedGoal, 10));
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, historyRes] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/user/getAnalytics", {
          withCredentials: true,
        }),
        axios.get("http://localhost:5000/api/v1/user/getExerciseHistory", {
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
          date: new Date(entry.date).toLocaleDateString(), // Format date
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
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value, 10) || 0;
    setDailyGoal(newGoal);
    localStorage.setItem("dailyGoal", newGoal); // Save to localStorage
  };

  const progress = Math.min((data.caloriesBurned / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - data.caloriesBurned, 0);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg">
    {/* Centered Title */}
    <h2 className="text-3xl font-bold text-center mb-8">🏋️ Workout Analytics</h2>

    {/* Daily Goal Input - Centered */}
    <div className="flex flex-col items-center justify-center mb-8">
        <label className="text-lg font-semibold mb-2">🎯 Set Your Daily Calorie Goal:</label>
        <div className="relative bg-gray-800 p-3 rounded-lg shadow-lg flex items-center w-64">
            <input
                type="number"
                className="w-full bg-transparent text-white text-center text-xl font-bold outline-none"
                value={dailyGoal}
                onChange={handleGoalChange}
                min="1"
            />
            <span className="absolute right-4 text-gray-400">🔥</span>
        </div>
    </div>

    {/* Exercise Stats Section */}
    <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-800 rounded-lg text-center">💪 Push-ups: {data.pushUps}</div>
        <div className="p-4 bg-gray-800 rounded-lg text-center">🌀 Curls: {data.curls}</div>
        <div className="p-4 bg-gray-800 rounded-lg text-center">🏋️ Squats: {data.squats}</div>
        <div className="p-4 bg-blue-600 rounded-lg text-center font-bold">
            🔥 Calories Burned: {data.caloriesBurned?.toFixed(2)}
        </div>
    </div>

    {/* Progress Circle */}
    <div className="mt-8 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4">📊 Daily Goal Progress</h3>
        <div className="w-48 h-48">
            <CircularProgressbar
                value={progress}
                text={`${progress.toFixed(0)}%`}
                styles={buildStyles({
                    pathColor: progress >= 100 ? "#4CAF50" : "#00BFFF",
                    trailColor: "#555",
                    textColor: "#fff",
                    textSize: "18px",
                    pathTransitionDuration: 0.5,
                })}
            />
        </div>
        <p className="mt-4 text-lg font-semibold">
            {remaining > 0 
                ? `🚀 You need ${remaining.toFixed(2)} more calories to reach your goal!`
                : "🎉 Goal Completed! Great job!"}
        </p>
    </div>

    {/* Workout History Graph */}
    <div className="mt-12 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">📅 Last 10 Days Workout Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={history} barGap={5} barCategoryGap={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#ccc" tick={{ fontSize: 12 }} />
                <YAxis stroke="#ccc" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
                <Legend />
                <Bar dataKey="caloriesBurned" fill="#FFD700" name="🔥 Calories Burned" />
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
