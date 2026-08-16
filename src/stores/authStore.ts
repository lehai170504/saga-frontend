import { create } from 'zustand';

export type ApplicationRole = "ADMIN" | "LECTURER" | "STUDENT";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

export interface AuthMeResponse {
  cognitoSub: string;
  email: string;
  fullName: string;
  applicationRole: ApplicationRole;
  localProfileId: string;
  accountStatus: AccountStatus;
  avatarUrl?: string | null;
  avatar?: string | null;
}

export type CsrfTokenResponse = {
  token: string;
  headerName: string;
  parameterName: string;
};

interface AuthState {
  user: AuthMeResponse | null;
  csrf: CsrfTokenResponse | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  authError: string | null;
  setUser: (user: AuthMeResponse | null) => void;
  setCsrf: (csrf: CsrfTokenResponse | null) => void;
  setInitializing: (isInit: boolean) => void;
  setAuthError: (error: string | null) => void;
  logoutLocalOnlyOrClearState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  csrf: null,
  isAuthenticated: false,
  isInitializing: true,
  authError: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, authError: null }),
  setCsrf: (csrf) => set({ csrf }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  setAuthError: (authError) => set({ authError }),
  logoutLocalOnlyOrClearState: () => set({ user: null, csrf: null, isAuthenticated: false }),
}));

// Initialize SSE listener outside React tree
if (typeof window !== "undefined") {
  // Dynamic import or require to avoid circular dependency if any, 
  // but direct import is fine since sessionEvents just uses useAuthStore.getState()
  import('@/features/auth/api/sessionEvents').then(({ sessionEvents }) => {
    useAuthStore.subscribe((state, prevState) => {
      // If user becomes authenticated and ACTIVE, start SSE
      if (state.isAuthenticated && state.user) {
        // According to requirements: ACTIVE Student/Lecturer -> start singleton
        // Admin also gets heartbeat. So as long as authenticated, we can start it.
        sessionEvents.start();
      } else if (!state.isAuthenticated && prevState?.isAuthenticated) {
        // If logged out, stop SSE
        sessionEvents.stop();
      }
    });
  });
}
