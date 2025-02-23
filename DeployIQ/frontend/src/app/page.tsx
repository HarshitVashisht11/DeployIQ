"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./globals.css";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-36 h-36 bg-blue-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-500 rounded-full opacity-30 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-3xl relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-500 to-green-400 text-transparent bg-clip-text">
          Deploy LLMs Seamlessly with DeployIQ
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
          Launch Llama 3, Mistral, and Falcon models on the cloud, bare-metal, or local Docker with automated GPU scaling & monitoring.
        </p>
        
        {/* CTA Buttons */}
        <div className="mt-8 flex justify-center space-x-6">
          <motion.button
            onClick={() => router.push("/auth/login")}
            className="px-8 py-3 text-lg font-semibold bg-blue-700 hover:bg-blue-800 rounded-lg shadow-lg transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.1 }}
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => router.push("/auth/signup")}
            className="px-8 py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition-transform transform hover:scale-110"
            whileHover={{ scale: 1.1 }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { title: "One-Click Deployment", desc: "Deploy LLMs instantly on AWS, GCP, Azure, or local Docker environments." },
          { title: "Automated Scaling", desc: "Scale GPU resources dynamically for high-performance inference." },
          { title: "Real-Time Monitoring", desc: "Track usage, logs, and system health with built-in analytics." },
        ].map((feature, index) => (
          <motion.div 
            key={index} 
            className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border border-gray-700 backdrop-blur-xl bg-opacity-30 relative"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-gray-200">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-300 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
