"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ModelCard from "./ModelCard";
import { motion } from "framer-motion";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex">
          <div className="flex-1">{children}</div>

          {/* Side Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-80 space-y-4 ml-6"
          >
            <ModelCard name="Llama 3" description="Advanced NLP model." status="deployed" />
            <ModelCard name="Mistral" description="Optimized for inference." status="pending" />
            <ModelCard name="Falcon" description="High-performance AI." status="failed" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
