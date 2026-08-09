import { useQuery } from "@tanstack/react-query";
import { projectApi, ProjectFilterParams } from "../api/projectApi";

export const useAdminProjects = (params: ProjectFilterParams) => {
  return useQuery({
    queryKey: ["admin", "projects", params],
    queryFn: () => projectApi.getProjects(params),
  });
};
