"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Simple Counter</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
        >
          -
        </button>
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}
