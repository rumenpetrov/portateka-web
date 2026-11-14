import type { PaginationParams } from "./client";

/**
 * Single Source of Truth for all TanStack Query cache keys.
 *
 * Hierarchy convention:
 * - `<domain>.all`     -> Root prefix for invalidating the entire domain
 * - `<domain>.lists()` -> Prefix for collection queries
 * - `<domain>.list(params)` -> Specific paginated/filtered collection query
 * - `<domain>.details()` -> Prefix for all single-entity detail queries
 * - `<domain>.detail(id)` -> Specific entity query key
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  properties: {
    all: ["properties"] as const,
    lists: () => [...queryKeys.properties.all, "list"] as const,
    list: (params: PaginationParams = {}) =>
      [...queryKeys.properties.lists(), params] as const,
    details: () => [...queryKeys.properties.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.properties.details(), id] as const,
  },
} as const;
