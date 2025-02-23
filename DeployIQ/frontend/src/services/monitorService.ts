"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Generic function to fetch data with error handling
async function fetchData(endpoint, defaultData = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    return data || defaultData; // Ensure data is not null/undefined
  } catch (error) {
    console.warn(`API not available yet: ${endpoint}`, error);
    return defaultData; // Return fallback data instead of breaking
  }
}

// Fetch system metrics (CPU, GPU, Memory usage)
export async function getSystemMetrics() {
  return fetchData("/monitor/metrics", {
    cpu: [],
    gpu: [],
    memory: [],
  });
}

// Fetch live logs (real-time monitoring)
export async function getLiveLogs() {
  return fetchData("/monitor/logs", []);
}
