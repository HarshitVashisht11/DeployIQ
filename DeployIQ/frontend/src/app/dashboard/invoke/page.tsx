"use client";

import { useState, useEffect } from "react";
import { invokeModel, getDeploymentOptions } from "@/services/deployService";

export default function InvokeModelPage() {
  const [models, setModels] = useState<{ id: string; modelName: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getDeploymentOptions();
        setModels(data.models);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleInvoke = async () => {
    if (!selectedModel || !inputText) {
      alert("Please enter input text and select a model.");
      return;
    }

    setLoading(true);
    try {
      const userId = 123; // Replace with actual user ID (fetch dynamically if needed)
      const data = await invokeModel(userId, selectedModel, inputText);
      setResponse(data.output);
    } catch (error) {
      console.error("Error invoking model:", error);
      setResponse(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Invoke Model</h1>
      <div className="space-y-4">
        <label className="block">
          <span className="text-lg font-semibold">Select Model:</span>
          <select
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">-- Select a Model --</option>
            {models.map((model) => (
              <option key={model.id} value={model.modelName}>
                {model.modelName}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-lg font-semibold">Enter Input:</span>
          <textarea
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </label>

        <button
          onClick={handleInvoke}
          disabled={loading}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300"
        >
          {loading ? "Invoking..." : "Invoke Model"}
        </button>
      </div>

      {response && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold">Response:</h2>
          <pre className="mt-2 p-2 bg-gray-700 rounded-md whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
