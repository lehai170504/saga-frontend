import axiosInstance from '@/lib/axios';
import { AuthMeResponse } from '@/stores/authStore';

export const authApi = {
  getMe: async (): Promise<AuthMeResponse> => {
    return await axiosInstance.get('/api/auth/me');
  },
  logout: async (): Promise<void> => {
    return await axiosInstance.post('/api/auth/logout');
  },
};
