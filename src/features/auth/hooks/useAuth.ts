import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const data = await authApi.getMe();
        return data;
      } catch (err: any) {
        if (err?.status === 401) {
          return null; // Return null gracefully if 401, axios interceptor handles global state
        }
        throw err;
      }
    },
    staleTime: Infinity, // Don't refetch automatically to prevent redundant calls
  });

  // Sync React Query state to Zustand
  useEffect(() => {
    if (!isLoading) {
      setUser(user ?? null);
      setInitializing(false);
    }
  }, [user, isLoading, setUser, setInitializing]);

  const logout = () => {
    // Clear react query cache
    queryClient.setQueryData(['auth-me'], null);

    // Clear Zustand store
    useAuthStore.getState().logout();

    // Perform standard HTML Form POST to backend logout endpoint
    // This allows the browser to natively follow the 302 redirect to Cognito Hosted UI
    const form = document.createElement('form');
    form.method = 'POST';
    // Import API_BASE_URL locally to avoid circular dependencies if any
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
    form.action = `${API_BASE_URL}/api/auth/logout`;

    const getCookie = (name: string): string | null => {
      const prefix = `${name}=`;
      const cookie = document.cookie.split("; ").find((item) => item.startsWith(prefix));
      return cookie ? decodeURIComponent(cookie.substring(prefix.length)) : null;
    };

    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = '_csrf';
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return {
    user,
    isLoading,
    error,
    refetch,
    logout,
  };
}
