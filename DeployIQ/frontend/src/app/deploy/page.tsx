"use client";

import DeployForm from "../../components/DeployForm";
import Navbar from "../../components/Navbar";

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="pt-16"> {/* Add padding for navbar */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-900 text-white p-6">
          <DeployForm />
        </div>
      </div>
    </div>
  );
}