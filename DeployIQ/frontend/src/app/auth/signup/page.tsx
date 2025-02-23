"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { registerUser } from "../../../services/authService";
import {motion} from "framer-motion";
export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleSignup = async (e) => {
      e.preventDefault();
      setError("");
  
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      try {
        const response = await registerUser({ email, password });
        if (response.success) {
          router.push("/auth/login");
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Signup failed. Please try again.");
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <motion.div 
          className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              Sign Up
            </motion.button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-300">
            Already have an account? {" "}
            <a href="/auth/login" className="text-blue-400 hover:underline">Login</a>
          </p>
        </motion.div>
      </div>
    );
  }
  