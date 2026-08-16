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
  logout: () => void;
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
  logout: () => set({ user: null, csrf: null, isAuthenticated: false }),
}));
