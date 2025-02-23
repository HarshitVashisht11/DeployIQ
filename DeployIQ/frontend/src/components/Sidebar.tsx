"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, BarChart, Cpu, Activity, Settings, Boxes } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Analytics", icon: BarChart, path: "/dashboard/analytics" },
  { name: "Models", icon: Cpu, path: "/dashboard/models" },
  { name: "Activity", icon: Activity, path: "/dashboard/activity" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-72 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 p-6 border-r border-gray-700/50 shadow-xl relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5" />

      {/* Logo Section */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3">
          <Boxes className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
  
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 relative">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 p-3 rounded-xl cursor-pointer
                transition-all duration-200 group relative
                ${pathname === item.path
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                }
              `}
            >
              {/* Active Indicator */}
              {pathname === item.path && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-white rounded-full my-auto top-0 bottom-0"
                />
              )}

              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110
                ${pathname === item.path 
                  ? "text-white" 
                  : "text-gray-400 group-hover:text-blue-400"}`} 
              />
              
              <span className="font-medium">
                {item.name}
              </span>

              {/* Hover Gradient */}
              {pathname !== item.path && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl" />
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
    </motion.aside>
  );
}