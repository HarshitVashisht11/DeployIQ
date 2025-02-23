"use client";

import { motion } from "framer-motion";
import { Server, CheckCircle, XCircle } from "lucide-react";

interface ModelCardProps {
  name: string;
  description: string;
  status: "deployed" | "failed" | "pending";
  onDeploy?: () => void;
}

export default function ModelCard({ name, description, status, onDeploy }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-white w-full max-w-md"
    >
      {/* Model Name */}
      <div className="flex items-center space-x-3">
        <Server className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold">{name}</h2>
      </div>

      {/* Description */}
      <p className="text-gray-400 mt-2">{description}</p>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center space-x-2">
        {status === "deployed" ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : status === "failed" ? (
          <XCircle className="w-5 h-5 text-red-500" />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-400 rounded-full animate-pulse" />
        )}
        <span className={`text-sm ${status === "deployed" ? "text-green-400" : status === "failed" ? "text-red-400" : "text-gray-400"}`}>
          {status === "deployed" ? "Deployed" : status === "failed" ? "Failed" : "Pending"}
        </span>
      </div>

      {/* Deploy Button */}
      {onDeploy && (
        <button
          onClick={onDeploy}
          className="mt-4 w-full py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
        >
          Deploy Model
        </button>
      )}
    </motion.div>
  );
}
