import { create } from "zustand";

type DeployStatus = "idle" | "deploying" | "success" | "failed";

type DeployState = {
  model: string;
  customModel: string;
  cloudProvider: string;
  gpuInstance: string;
  status: DeployStatus;
  logs: string[];
  setModel: (model: string) => void;
  setCustomModel: (customModel: string) => void;
  setCloudProvider: (provider: string) => void;
  setGpuInstance: (instance: string) => void;
  setStatus: (status: DeployStatus) => void;
  addLog: (log: string) => void;
  reset: () => void;
};

export const useDeployStore = create<DeployState>((set) => ({
  model: "",
  customModel: "",
  cloudProvider: "AWS",
  gpuInstance: "auto",
  status: "idle",
  logs: [],
  setModel: (model) => set({ model }),
  setCustomModel: (customModel) => set({ customModel }),
  setCloudProvider: (provider) => set({ cloudProvider: provider }),
  setGpuInstance: (instance) => set({ gpuInstance: instance }),
  setStatus: (status) => set({ status }),
  addLog: (log) =>
    set((state) => ({ logs: [...state.logs, log] })),
  reset: () =>
    set({
      model: "",
      customModel: "",
      cloudProvider: "AWS",
      gpuInstance: "auto",
      status: "idle",
      logs: [],
    }),
}));
