"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../services/authService";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/useAuthStore"; // Zustand store

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/deploy"); // Redirect if already logged in
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ email, password });
      if (response.success && response.data.token) {
        login(response.data.user, response.data.token);
        router.push("/deploy"); // Redirect after login
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <motion.div
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-96 backdrop-blur-lg bg-opacity-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Login to DeployIQ
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
