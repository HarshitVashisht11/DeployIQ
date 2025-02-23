"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-64 bg-gray-800 p-6 shadow-lg z-50 border-r border-gray-700"
          >
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4">
              <X className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">DeployIQ</h2>
            <nav className="space-y-4">
              <NavLink href="/" onClick={() => setSidebarOpen(false)}>Home</NavLink>
              <NavLink href="/deploy" onClick={() => setSidebarOpen(false)}>Deploy</NavLink>
              <NavLink href="/logs" onClick={() => setSidebarOpen(false)}>Logs</NavLink>
              <NavLink href="/settings" onClick={() => setSidebarOpen(false)}>Settings</NavLink>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`bg-gray-900 text-white p-4 shadow-lg border-b border-gray-700 ${sidebarOpen ? "hidden" : "block"}`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Sidebar Toggle Button */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-8 h-8 text-blue-400" />
          </button>
          
          {/* Logo - Hidden when Sidebar is Open */}
          {!sidebarOpen && (
            <Link href="/" className="text-3xl font-extrabold tracking-wide text-blue-400 hover:text-blue-300 transition duration-300">
              DeployIQ
            </Link>
          )}
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/deploy">Deploy</NavLink>
            <NavLink href="/monitor">Monitor</NavLink>
            
          </div>
        </div>
      </nav>
    </>
  );
}

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    href={href}
    className="block px-6 py-3 text-lg font-semibold text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition duration-300 ease-in-out shadow-sm"
    onClick={onClick}
  >
    {children}
  </Link>
);
