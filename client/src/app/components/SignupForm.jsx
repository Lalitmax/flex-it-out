"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up with:", email, password);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
      <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
      <p className="text-gray-600 text-center mb-4">Sign up to get started</p>

      <form onSubmit={handleSubmit} className="space-y-4">

      <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Sign up
        </Button>
      </form>

       
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/auth/login"  className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
