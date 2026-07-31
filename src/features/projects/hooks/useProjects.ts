import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../api/projectApi";
import { CreateTeamProjectRequest } from "../types";

export const useCreateTeamProject = (teamId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeamProjectRequest) => projectApi.createTeamProject(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-projects", teamId] });
    },
  });
};
