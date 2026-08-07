import { useQuery } from "@tanstack/react-query";
import { sprintApi } from "@/features/projects/api/sprintApi";

export const useTeamSprints = (teamId: string) => {
  return useQuery({
    queryKey: ["teamSprints", teamId],
    queryFn: () => sprintApi.getTeamSprints(teamId),
    enabled: !!teamId,
  });
};
