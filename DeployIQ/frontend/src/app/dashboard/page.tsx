"use client";

import { useState, useEffect } from "react";
import ModelCard from "@/components/ModelCard";
import { BarChart, Cpu, Activity, RefreshCw, Play, StopCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [models, setModels] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch models, analytics, and activity
        const [modelsRes, analyticsRes, activityRes] = await Promise.all([
          fetch("/api/models").then((res) => res.json()),
          fetch("/api/analytics").then((res) => res.json()),
          fetch("/api/activity").then((res) => res.json()),
        ]);

        setModels(modelsRes);
        setAnalytics(analyticsRes);
        setActivity(activityRes);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to control models (start, stop, redeploy)
  async function handleAction(modelName: string, action: string) {
    try {
      await fetch(`/api/models/${modelName}/${action}`, { method: "POST" });
      alert(`${action} request sent for ${modelName}`);
    } catch (err) {
      alert("Failed to perform action.");
    }
  }

  if (loading) return <p className="text-center text-gray-400">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
          <BarChart className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold">Analytics</h2>
            <p className="text-sm text-gray-400">{analytics.totalRequests} total API calls</p>
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
          <Cpu className="w-6 h-6 text-green-500" />
          <div>
            <h2 className="text-lg font-semibold">Models</h2>
            <p className="text-sm text-gray-400">{models.length} models deployed</p>
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
          <Activity className="w-6 h-6 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold">Activity</h2>
            <p className="text-sm text-gray-400">{activity.length} recent logs</p>
          </div>
        </motion.div>
      </div>

      {/* Model Overview */}
      <h2 className="text-xl font-bold mb-4">Deployed Models</h2>
      <div className="grid grid-cols-3 gap-4">
        {models.map((model: any) => (
          <div key={model.name} className="bg-gray-800 p-4 rounded-lg">
            <ModelCard name={model.name} description={model.description} status={model.status} />
            <div className="flex justify-between mt-3">
              <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700" onClick={() => handleAction(model.name, "start")}>
                <Play className="w-4 h-4 inline-block mr-1" /> Start
              </button>
              <button className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700" onClick={() => handleAction(model.name, "redeploy")}>
                <RefreshCw className="w-4 h-4 inline-block mr-1" /> Redeploy
              </button>
              <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700" onClick={() => handleAction(model.name, "stop")}>
                <StopCircle className="w-4 h-4 inline-block mr-1" /> Stop
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Logs */}
      <h2 className="text-xl font-bold mt-6 mb-4">Recent Activity</h2>
      <ul className="bg-gray-800 p-4 rounded-lg space-y-2">
        {activity.slice(0, 5).map((log: any, index: number) => (
          <li key={index} className="text-sm text-gray-400">{log.timestamp} - {log.message}</li>
        ))}
      </ul>

      {/* Navigation Links */}
      <div className="mt-6 flex space-x-4">
        <Link href="/dashboard/analytics" className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">View Analytics</Link>
        <Link href="/dashboard/models" className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700">Manage Models</Link>
        <Link href="/dashboard/activity" className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700">View Activity</Link>
      </div>
    </div>
  );
}
