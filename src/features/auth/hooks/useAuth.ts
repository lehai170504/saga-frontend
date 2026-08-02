import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setCsrf = useAuthStore((state) => state.setCsrf);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const user = await authApi.getMe();
        let csrf = null;
        if (user) {
          csrf = await authApi.getCsrf();
        }
        return { user, csrf };
      } catch (err: any) {
        if (err?.status === 401) {
          return { user: null, csrf: null }; // Return gracefully if 401
        }
        throw err;
      }
    },
    staleTime: Infinity, // Don't refetch automatically to prevent redundant calls
  });

  // Sync React Query state to Zustand
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setUser(data?.user ?? null);
      setCsrf(data?.csrf ?? null);
      setInitializing(false);
    }
  }, [data, isLoading, isFetching, setUser, setCsrf, setInitializing]);

  const logout = async () => {
    // We intentionally do not clear Zustand / React Query here.
    // The backend redirect back to /logout/callback will clear them.

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://saga-backend-production-3951.up.railway.app";

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        window.location.replace("/");
        return;
      }

      const csrf = await response.json();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${API_BASE_URL}/api/auth/logout`;
      form.style.display = "none";

      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = csrf.parameterName;
      csrfInput.value = csrf.token;

      form.appendChild(csrfInput);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Logout failed", error);
      window.location.replace("/");
    }
  };

  return {
    user: data?.user ?? null,
    csrf: data?.csrf ?? null,
    isLoading,
    isFetching,
    error,
    refetch,
    logout,
  };
}

