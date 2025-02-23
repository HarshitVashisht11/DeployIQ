"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
}

type LogsViewerProps = {
  logs: LogEntry[];
  isEmbedded?: boolean;
};

export default function LogsViewer({ logs, isEmbedded = false }: LogsViewerProps) {
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((log) => log.level === filter));
    }
  }, [logs, filter]);

  const LogContent = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-300">
          {isEmbedded ? "System Logs" : "Live System Logs"}
        </h2>
        <select
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
        </select>
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-700 p-3 rounded-lg bg-gray-800 text-sm">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-400 text-center">No logs available</p>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded-md mb-2 ${
                log.level === "ERROR"
                  ? "bg-red-500/20 text-red-400"
                  : log.level === "WARNING"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-gray-700/20 text-gray-300"
              }`}
            >
              <span className="font-mono text-xs opacity-70">[{log.timestamp}]</span>
              <span className="font-bold ml-2">{log.level}</span>: {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // If embedded, just return the content
  if (isEmbedded) {
    return <LogContent />;
  }

  // For standalone page, include navbar and full layout
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
        <Navbar />
      </div>
      <main className="container mx-auto pt-16 px-4 md:px-6">
        <LogContent />
      </main>
    </div>
  );
}