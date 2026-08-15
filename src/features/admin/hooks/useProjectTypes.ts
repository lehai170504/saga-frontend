import { useQuery } from "@tanstack/react-query";
import { projectTypeApi } from "../api/projectTypeApi";

export const useProjectTypes = () => {
  return useQuery({
    queryKey: ["admin_project_types"],
    queryFn: () => projectTypeApi.getProjectTypes(),
  });
};


