"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import axios from "axios";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        try {
            const response = await axios.post("http://localhost:5000/api/v1/user/login", {
                email,
                password,
            });
            console.log("Login successful:", response.data);

            // Redirect to the original page or default to dashboard
            router.push(redirectTo);

        } catch (error) {
            setError("Failed to login. Please check your credentials and try again.");
            console.error("Login error:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
            <p className="text-gray-600 text-center mb-4">Please enter your details</p>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-between text-sm text-gray-600">
                    <label>
                        <input type="checkbox" className="mr-2" /> Remember for 30 days
                    </label>
                    <Link href="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
                    Sign in
                </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
