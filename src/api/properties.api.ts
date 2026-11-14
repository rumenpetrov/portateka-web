import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiPaginatedRequest, apiRequest } from "./client";
import type {
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from "./client";
import { queryKeys } from "./queryKeys";

export type { PaginatedResponse, PaginationMeta, PaginationParams };

export interface PropertyItem {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyInput {
  name: string;
  description?: string | null;
  notes?: string | null;
}

export interface UpdatePropertyInput {
  name?: string;
  description?: string | null;
  notes?: string | null;
}

export const propertyQueries = {
  list: (params: PaginationParams = {}) =>
    queryOptions({
      queryKey: queryKeys.properties.list(params),
      queryFn: ({ signal }) =>
        apiPaginatedRequest<PropertyItem>("/api/properties", {
          params: {
            page: params.page,
            limit: params.limit,
          },
          authenticated: true,
          signal,
        }),
      placeholderData: keepPreviousData,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: queryKeys.properties.detail(id),
      queryFn: ({ signal }) =>
        apiRequest<PropertyItem>(`/api/properties/${id}`, {
          authenticated: true,
          signal,
        }),
    }),
};

export function usePropertiesQuery(params: PaginationParams = {}) {
  return useQuery(propertyQueries.list(params));
}

export function usePropertyQuery(id: string) {
  return useQuery({
    ...propertyQueries.detail(id),
    enabled: Boolean(id),
  });
}

export function useCreatePropertyMutation() {
  return useMutation({
    // Creating a property automatically sets users.preferredPropertyId when null on the server,
    // so we invalidate both the properties domain and auth.me() via the central key factory.
    meta: {
      invalidates: [queryKeys.properties.all, queryKeys.auth.me()],
    },
    mutationFn: (input: CreatePropertyInput) =>
      apiRequest<PropertyItem>("/api/properties", {
        method: "POST",
        body: input,
        authenticated: true,
      }),
  });
}

export function useUpdatePropertyMutation(id: string) {
  const client = useQueryClient();

  return useMutation({
    meta: {
      invalidates: [queryKeys.properties.lists(), queryKeys.properties.detail(id)],
    },
    mutationFn: (input: UpdatePropertyInput) =>
      apiRequest<PropertyItem>(`/api/properties/${id}`, {
        method: "PATCH",
        body: input,
        authenticated: true,
      }),
    onSuccess: (updatedProperty) => {
      client.setQueryData(
        propertyQueries.detail(id).queryKey,
        updatedProperty,
      );
    },
  });
}

export function useDeletePropertyMutation() {
  const client = useQueryClient();

  return useMutation({
    // Deleting the preferred property clears users.preferredPropertyId via ON DELETE SET NULL,
    // so we invalidate both properties.all and auth.me().
    meta: {
      invalidates: [queryKeys.properties.all, queryKeys.auth.me()],
    },
    mutationFn: (id: string) =>
      apiRequest<void>(`/api/properties/${id}`, {
        method: "DELETE",
        authenticated: true,
      }),
    onSuccess: (_data, deletedId) => {
      client.removeQueries({
        queryKey: queryKeys.properties.detail(deletedId),
      });
    },
  });
}
