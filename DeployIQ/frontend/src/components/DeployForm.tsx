"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Server, Cloud, Cpu } from "lucide-react";
import { deployModel } from "../services/deployService";

export default function DeployForm() {
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [cloudProvider, setCloudProvider] = useState("AWS");
  const [gpuInstance, setGpuInstance] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleDeploy = async () => {
    if (!model && !customModel) {
      alert("Please select or enter a model to deploy.");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      await deployModel({ 
        model: customModel || model, 
        cloudProvider, 
        gpuInstance
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">-- Choose a Model --</option>
            <option value="Llama3">Llama 3 - Advanced NLP</option>
            <option value="Mistral">Mistral - Efficient Inference</option>
            <option value="Falcon">Falcon - High-Performance AI</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            Custom Model
          </label>
          <input
            type="text"
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-colors hover:border-purple-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
            placeholder="Enter custom model name"
            value={customModel}
            onChange={(e) => setCustomModel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-300 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-green-400" />
            Cloud Provider
          </label>
          <select
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-colors hover:border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value)}
          >
            <option value="AWS">AWS</option>
            <option value="GCP">GCP</option>
            <option value="Azure">Azure</option>
            <option value="Bare-metal">Bare-metal</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-yellow-400" />
            GPU Instance Type
          </label>
          <select
            className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white transition-colors hover:border-yellow-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none"
            value={gpuInstance}
            onChange={(e) => setGpuInstance(e.target.value)}
          >
            <option value="auto">Auto-Select</option>
            <option value="g5.2xlarge">AWS g5.2xlarge</option>
            <option value="A100">GCP A100</option>
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
            className="flex items-center justify-center text-green-400 mt-4 p-3 bg-green-400/10 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" /> 
            Deployment Successful!
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-red-400 mt-4 p-3 bg-red-400/10 rounded-lg"
          >
            <XCircle className="w-5 h-5 mr-2" /> 
            Deployment Failed
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}