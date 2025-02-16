"use client";

import { useState, useEffect } from "react";

const Analytics = () => {
    const [data, setData] = useState({ pushup: 0, curl: 0, squats: 0, caloriesBurned: 0 });

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/v1/user/getAnalytics");
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-gray-900 text-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Workout Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800 rounded-lg">Push-ups: {data.pushup}</div>
                <div className="p-3 bg-gray-800 rounded-lg">Curls: {data.curl}</div>
                <div className="p-3 bg-gray-800 rounded-lg">Squats: {data.squats}</div>
                <div className="p-3 bg-blue-600 rounded-lg">Calories Burned: {data.caloriesBurned.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default Analytics;
