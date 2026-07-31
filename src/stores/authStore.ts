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
}

interface AuthState {
  user: AuthMeResponse | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: AuthMeResponse | null) => void;
  setInitializing: (isInit: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitializing: (isInitializing) => set({ isInitializing }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
