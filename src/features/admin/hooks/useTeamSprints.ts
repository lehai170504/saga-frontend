import { useQuery } from "@tanstack/react-query";
import { adminSprintApi } from "../api/adminSprintApi";

export const useTeamSprints = (teamId: string) => {
  return useQuery({
    queryKey: ["admin-team-sprints", teamId],
    queryFn: () => adminSprintApi.getTeamSprints(teamId),
    enabled: !!teamId,
  });
};
