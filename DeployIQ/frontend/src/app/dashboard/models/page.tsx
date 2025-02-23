"use client";

import { useState, useEffect } from 'react';
import { Server, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface DeployedModel {
  id: string;
  modelName: string;
  apiKey: string;
  apiUrl: string;
  status: string;
  deployedAt: string;
  requestCount?: number;
}

const ModelsPage = () => {
  const [deployedModels, setDeployedModels] = useState<DeployedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDeployedModels();
  }, []);

  const fetchDeployedModels = async () => {
    try {
      const token = localStorage.getItem('auth-storage') ? 
        JSON.parse(localStorage.getItem('auth-storage')!).state.token : null;

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/deploy/models`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deployed models');
      }

      const data = await response.json();
      setDeployedModels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deployed models');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const ModelCard = ({ model }: { model: DeployedModel }) => (
    <div className="bg-gray-800 rounded-lg p-6 mb-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Server className="w-6 h-6 text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-white">{model.modelName}</h3>
            <p className="text-sm text-gray-400">
              Deployed on {new Date(model.deployedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          model.status === 'deployed' 
            ? 'bg-green-400/10 text-green-400' 
            : 'bg-yellow-400/10 text-yellow-400'
        }`}>
          {model.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-900 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">API Key</span>
            <button 
              onClick={() => copyToClipboard(model.apiKey)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <code className="text-sm text-gray-300 break-all">{model.apiKey}</code>
        </div>

        <div className="bg-gray-900 rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">API URL</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => copyToClipboard(model.apiUrl)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a 
                href={model.apiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <code className="text-sm text-gray-300 break-all">{model.apiUrl}</code>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
          <span>Requests made: {model.requestCount || 0}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center text-gray-400">Loading deployed models...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center text-red-400 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Deployed Models</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Available Credits:</span>
          <span className="text-white font-semibold">{user?.credits || 0}</span>
        </div>
      </div>

      <div className="space-y-4">
        {deployedModels.length > 0 ? (
          deployedModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))
        ) : (
          <div className="text-center text-gray-400 p-8 border border-gray-700 rounded-lg">
            No models deployed yet. Deploy your first model to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;