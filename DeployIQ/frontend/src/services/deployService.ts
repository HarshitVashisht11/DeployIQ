const API_URL = "http://localhost:5000/api"; 

export interface DeploymentOptions {
  models: string[];
  regions: string[];
}

export interface DeployResponse {
  success: boolean;
  data?: {
    apiKey: string;
    apiUrl: string;
    message: string;
  };
  message?: string;
}
export interface InvokeResponse {
  success: boolean;
  output?: string;
  message?: string;
}

// Helper function to get token from auth store
const getAuthToken = () => {
  // Get auth state from localStorage
  const authState = localStorage.getItem('auth-storage');
  if (!authState) return null;
  
  try {
    const { state } = JSON.parse(authState);
    return state.token;
  } catch (e) {
    return null;
  }
};

export async function deployModel({ model }: { model: string }): Promise<DeployResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        modelName: model
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Deployment failed");
    }

    const data = await response.json();
    return { 
      success: true, 
      data: {
        apiKey: data.apiKey,
        apiUrl: data.apiUrl,
        message: data.message
      } 
    };
  } catch (error: any) {
    console.error("Deploy error:", error);
    return { success: false, message: error.message };
  }
}

export async function getDeploymentOptions(): Promise<DeploymentOptions> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/deploy/options`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch deployment options");
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Options error:", error);
    throw new Error("Failed to fetch deployment options");
  }
}
export const invokeModel = async (userId: number, modelName: string, input: string) => {
  try {
    const response = await fetch(`/api/deploy/invoke/${userId}/${modelName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY_HERE", // Replace with actual API key
      },
      body: JSON.stringify({ input, maxTokens: 50, temperature: 0.7 }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error invoking model:", error);
    throw error;
  }
};
