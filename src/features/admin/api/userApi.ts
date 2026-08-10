import axiosInstance from "@/lib/axios";

export interface UserProfileResponse {
  localProfileId: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
  fullName: string;
  email: string;
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  studentCode?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserFilterParams {
  keyword?: string;
  role?: string;
  accountStatus?: string;
  page?: number;
  size?: number;
}

export interface ImportUsersResponse {
  role: "STUDENT" | "LECTURER";
  createdCount: number;
  reusedCount: number;
}

export const userApi = {
  getUsers: (params?: UserFilterParams) => {
    return axiosInstance.get<never, PageResponse<UserProfileResponse>>("/api/admin/users", { params });
  },

  toggleUserStatus: (id: string, status: string) => {
    return axiosInstance.patch<never, UserProfileResponse>(`/api/admin/users/${id}/status`, { status });
  },

  importUsers: (role: "STUDENT" | "LECTURER", file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post<never, ImportUsersResponse>("/api/admin/users/import", formData, {
      params: { role }
    });
  }
};
