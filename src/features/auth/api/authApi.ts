import axiosInstance from '@/lib/axios';
import { AuthMeResponse, CsrfTokenResponse } from '@/stores/authStore';

export const authApi = {
  getMe: async (): Promise<AuthMeResponse> => {
    return await axiosInstance.get('/api/auth/me');
  },
  getCsrf: async (): Promise<CsrfTokenResponse> => {
    return await axiosInstance.get('/api/auth/csrf');
  },
  logout: async (): Promise<void> => {
    return await axiosInstance.post('/api/auth/logout');
  },
};
