import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { getFirebaseInstallationId } from '@/lib/firebase';
import { notificationApi } from '@/features/notifications/api/notificationApi';

let isRegisteringFirebase = false;

export function useAuth() {

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
      } catch (err: unknown) {

        if ((err as { status?: number })?.status === 401) {
          return { user: null, csrf: null };
        }
        throw err;
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setUser(data?.user ?? null);
      setCsrf(data?.csrf ?? null);
      setInitializing(false);

      if (data?.user && data?.csrf) {
        const regId = localStorage.getItem("saga_firebase_registration_id");
        if (!regId && !isRegisteringFirebase) {
          isRegisteringFirebase = true;
          getFirebaseInstallationId().then(async (fid) => {
            if (fid) {
              try {
                const res = await notificationApi.registerFirebaseInstallation(fid);
                if (res && res.id) {
                  localStorage.setItem("saga_firebase_registration_id", res.id);
                }
              } catch (err) {
                console.warn("Firebase installation registration warning:", err);

                if ((err as { status?: number })?.status === 409) {
                  localStorage.setItem("saga_firebase_registration_id", fid);
                }
              } finally {
                isRegisteringFirebase = false;
              }
            } else {
              isRegisteringFirebase = false;
            }
          });
        }
      }
    }
  }, [data, isLoading, isFetching, setUser, setCsrf, setInitializing]);

  const logout = async () => {


    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://saga-backend-production-3951.up.railway.app";

    try {
      const regId = localStorage.getItem("saga_firebase_registration_id");
      const fid = await getFirebaseInstallationId();
      const targetId = regId || fid;
      if (targetId) {
        await notificationApi.revokeFirebaseInstallation(targetId).catch(() => { });
        localStorage.removeItem("saga_firebase_registration_id");
      }

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

