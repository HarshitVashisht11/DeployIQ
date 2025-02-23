"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Server, Cloud } from "lucide-react";
import { deployModel, getDeploymentOptions, DeployResponse } from "../services/deployService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function DeployForm() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [deploymentDetails, setDeploymentDetails] = useState<{
    apiKey?: string;
    apiUrl?: string;
  }>({});

  useEffect(() => {
    // Check authentication immediately
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const options = await getDeploymentOptions();
        setModelOptions(options.models);
        setRegions(options.regions);
        if (options.regions.length > 0) {
          setSelectedRegion(options.regions[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch options:", err);
        setError(err.message || "Failed to fetch deployment options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [isAuthenticated, router]);

  const getModelDisplayName = (modelId: string) => {
    if (modelId.includes("claude")) return "Claude - Advanced AI Assistant";
    if (modelId.includes("llama")) return "Meta Llama - Open Source LLM";
    return modelId;
  };

  const handleDeploy = async () => {
    if (!selectedModel) {
      setError("Please select a model to deploy.");
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setError("");
    setDeploymentDetails({});

    try {
      const response = await deployModel({ 
        model: selectedModel,
      });
      
      if (response.success && response.data) {
        setSuccess(true);
        setDeploymentDetails({
          apiKey: response.data.apiKey,
          apiUrl: response.data.apiUrl
        });
      } else {
        throw new Error(response.message || "Deployment failed");
      }
    } catch (err: any) {
      console.error("Deploy error:", err);
      setError(err.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  // If still loading initial options, show loading state
  if (loading && !modelOptions.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-700"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Deploy a Model
          </h1>
          <p className="text-gray-400 mt-2">Configure and deploy your AI model in minutes</p>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-gray-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            Select Model
          </label>
          <select
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-colors hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">-- Choose a Model --</option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {getModelDisplayName(model)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-300 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-green-400" />
            Region
          </label>
          <select
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-colors hover:border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeploy}
          disabled={loading}
          className={`w-full py-4 mt-6 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
            loading 
              ? "bg-gray-600" 
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          } text-white shadow-lg`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : (
            "Deploy Model"
          )}
        </motion.button>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-2 text-green-400 mt-4 p-3 bg-green-400/10 rounded-lg"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" /> 
              Deployment Successful!
            </div>
            {deploymentDetails.apiKey && (
              <div className="text-sm bg-gray-800 p-2 rounded w-full">
                <div className="mb-1">
                  <span className="font-semibold">API Key:</span>{" "}
                  <code className="bg-gray-900 px-2 py-1 rounded">{deploymentDetails.apiKey}</code>
                </div>
                <div>
                  <span className="font-semibold">API URL:</span>{" "}
                  <code className="bg-gray-900 px-2 py-1 rounded">{deploymentDetails.apiUrl}</code>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-red-400 mt-4 p-3 bg-red-400/10 rounded-lg"
          >
            <XCircle className="w-5 h-5 mr-2" /> 
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}