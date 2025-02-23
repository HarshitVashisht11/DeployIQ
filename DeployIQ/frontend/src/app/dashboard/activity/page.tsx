"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity as ActivityIcon, Server, AlertCircle } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "deploy" | "request" | "error";
  modelName: string;
  timestamp: string;
  details: string;
}

export default function Activity() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch activity events
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch("/api/activity");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "deploy":
        return <Server className="w-4 h-4 text-blue-400" />;
      case "request":
        return <ActivityIcon className="w-4 h-4 text-green-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg border border-gray-700"
          >
            <div className="mt-1">
              {getEventIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {activity.modelName}
              </p>
              <p className="text-sm text-gray-400">
                {activity.details}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}