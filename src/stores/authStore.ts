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
  setUser: (user: AuthMeResponse | null) => void;
  setCsrf: (csrf: CsrfTokenResponse | null) => void;
  setInitializing: (isInit: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  csrf: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setCsrf: (csrf) => set({ csrf }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  logout: () => set({ user: null, csrf: null, isAuthenticated: false }),
}));
