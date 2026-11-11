import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiRequest } from "./client";
import { queryKeys } from "./queryKeys";

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export const healthQueries = {
  check: () =>
    queryOptions({
      queryKey: queryKeys.health.all,
      queryFn: ({ signal }) =>
        apiRequest<HealthResponse>("/health", {
          authenticated: false,
          signal,
        }),
      staleTime: 60_000,
      retry: false,
    }),
};

export function useHealthQuery() {
  return useQuery(healthQueries.check());
}
