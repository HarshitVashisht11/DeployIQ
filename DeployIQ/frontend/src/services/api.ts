// src/services/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * A helper function to make API requests using the native fetch API.
 * Automatically sets the Content-Type to application/json and prefixes requests with the API URL.
 * @param endpoint - API endpoint (e.g., "/auth/login")
 * @param options - Additional fetch options
 * @returns The parsed JSON response.
 * @throws An error if the response is not ok.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

export default apiFetch;
