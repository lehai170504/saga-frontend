import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UserFilterParams, PageResponse, UserProfileResponse } from "../api/userApi";

export const useUsers = (params: UserFilterParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => userApi.getUsers(params),
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => userApi.toggleUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Bắt buộc dừng các refetch đang chạy để không đè lên data optimistic
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });

      // Lưu lại cache cũ
      const previousUsers = queryClient.getQueriesData({ queryKey: ["admin", "users"] });

      // Cập nhật giao diện lập tức (Optimistic Update)
      queryClient.setQueriesData({ queryKey: ["admin", "users"] }, (old: PageResponse<UserProfileResponse> | undefined) => {
        if (!old || !old.content) return old;
        return {
          ...old,
          content: old.content.map((user: UserProfileResponse) =>
            user.localProfileId === id ? { ...user, accountStatus: status as UserProfileResponse["accountStatus"] } : user
          ),
        };
      });

      return { previousUsers };
    },
    onError: (err, newStatus, context) => {
      // Lỗi thì revert lại như cũ
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Dù thành công hay thất bại cũng refetch lại để đảm bảo đồng bộ
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useImportUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ role, file }: { role: "STUDENT" | "LECTURER"; file: File }) =>
      userApi.importUsers(role, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};
