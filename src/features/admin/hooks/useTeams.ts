import { useQuery } from "@tanstack/react-query";
import { teamApi, TeamFilterParams } from "../api/teamApi";

export const useAdminTeams = (params: TeamFilterParams) => {
  return useQuery({
    queryKey: ["admin", "teams", params],
    queryFn: () => teamApi.getTeams(params),
  });
};
