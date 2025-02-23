"use client";

import { useEffect, useState } from "react";
import { getSystemMetrics, getLiveLogs } from "../../services/monitorService";
import LogsViewer from "../../components/LogsViewer";
import Navbar from "../../components/Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MonitorPage() {
  const [metrics, setMetrics] = useState({ cpu: [], gpu: [], memory: [] });
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, logsData] = await Promise.all([
          getSystemMetrics(),
          getLiveLogs(),
        ]);

        setMetrics({
          cpu: metricsData.cpu || [],
          gpu: metricsData.gpu || [],
          memory: metricsData.memory || [],
        });

        setLogs(Array.isArray(logsData) ? logsData : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch monitoring data", err);
        setError("Error loading monitoring data.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="pt-16"> {/* Add padding to account for fixed navbar */}
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-white">Real-Time Monitoring</h1>
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["CPU", "GPU", "Memory"].map((type) => {
              const dataKey = type.toLowerCase();
              return (
                <div key={dataKey} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-2 text-white">{type} Usage</h2>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={metrics[dataKey] || []}>
                      <XAxis dataKey="timestamp" tick={false} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke={type === "CPU" ? "#8884d8" : type === "GPU" ? "#82ca9d" : "#ff7300"}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>

          {/* Logs Section */}
          <div>
            <LogsViewer logs={logs} isEmbedded={true} />
          </div>
        </div>
      </main>
    </div>
  );
}