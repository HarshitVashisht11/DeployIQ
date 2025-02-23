"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/deploy"; // NestJS backend

// Deploy a model with selected options
export const deployModel = async ({
  model,
  cloudProvider,
  instanceType,
  replicas,
  inferenceBackend,
  useGPU,
  customConfig,
}: {
  model: string;
  cloudProvider: "AWS" | "GCP" | "Azure" | "Bare-metal" | "Local";
  instanceType: string;
  replicas: number;
  inferenceBackend: "vLLM" | "TGI" | "HuggingFace";
  useGPU: boolean;
  customConfig?: Record<string, any>;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        cloudProvider,
        instanceType,
        replicas,
        inferenceBackend,
        useGPU,
        customConfig,
      }),
    });

    if (!response.ok) throw new Error("Failed to deploy model");
    return await response.json();
  } catch (error) {
    console.error("Error deploying model:", error);
    throw error;
  }
};

// Get real-time deployment status
export const getDeploymentStatus = async (deploymentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${deploymentId}`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch status");
    return await response.json();
  } catch (error) {
    console.error("Error fetching deployment status:", error);
    throw error;
  }
};

// Stop a running deployment
export const stopDeployment = async (deploymentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deploymentId }),
    });

    if (!response.ok) throw new Error("Failed to stop deployment");
    return await response.json();
  } catch (error) {
    console.error("Error stopping deployment:", error);
    throw error;
  }
};

// Redeploy a model (restart with updated settings)
export const redeployModel = async (deploymentId: string, newConfig: object) => {
  try {
    const response = await fetch(`${API_BASE_URL}/redeploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deploymentId, ...newConfig }),
    });

    if (!response.ok) throw new Error("Failed to redeploy model");
    return await response.json();
  } catch (error) {
    console.error("Error redeploying model:", error);
    throw error;
  }
};
