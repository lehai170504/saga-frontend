import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/authApi";
import { toast } from "sonner";

interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success("Cập nhật thông tin thành công");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    },
  });
}
