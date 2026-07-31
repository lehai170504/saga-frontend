import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://saga-backend-production-3951.up.railway.app";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errorName: string,
    public readonly body: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Utility function to get cookie value by name
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.substring(prefix.length)) : null;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending JSESSIONID
  headers: {
    "Accept": "application/json",
  }
});

// Request interceptor to attach CSRF token for mutations
axiosInstance.interceptors.request.use((config) => {
  const isMutation = config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase());

  if (isMutation) {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    } else {
      console.warn("Missing XSRF-TOKEN cookie. Mutation request might fail if not explicitly exempted.");
    }
  }

  return config;
});

// Response interceptor to handle errors and generic formatting
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Only return the actual data to the caller
  },
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    const body: any = error.response?.data;

    const errorName = body?.error || "Unknown Error";
    const message = body?.message || error.message || `HTTP ${status}`;

    // Handle unauthorized globally
    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new ApiError(status, message, errorName, body));
  }
);

export default axiosInstance;
