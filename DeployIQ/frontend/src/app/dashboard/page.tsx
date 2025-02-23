"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Models from "./models/page";
import Activity from "./activity/page";
import { useAuthStore } from "../../store/useAuthStore";
import { Cpu, Activity as ActivityIcon } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [deployments, setDeployments] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/deployments");
        const data = await response.json();
        setDeployments(data);
        setTotalRequests(data.reduce((sum, deployment) => sum + (deployment.requests || 0), 0));
      } catch (error) {
        console.error("Error fetching deployments:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 pt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.email}
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your deployed models and monitor their performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center">
              <Cpu className="w-8 h-8 text-blue-400" />
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Active Models</h3>
                <p className="text-2xl font-bold text-white">{deployments.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center">
              <ActivityIcon className="w-8 h-8 text-green-400" />
              <div className="ml-4">
                <h3 className="text-gray-400 text-sm">Total Requests</h3>
                <p className="text-2xl font-bold text-white">{totalRequests}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Models Section */}
          <div className="xl:col-span-2">
            <Models />
          </div>

          {/* Activity Section */}
          <div className="xl:col-span-1">
            <Activity />
          </div>
        </div>
      </div>
    </div>
  );
}