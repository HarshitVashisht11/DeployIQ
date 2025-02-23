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
        </div>
      </div>
    </div>
  );
}
