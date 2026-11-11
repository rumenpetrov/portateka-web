# ADR 0006: Centralized Query Key Factory and Declarative Mutation Invalidation

- **Status:** Accepted
- **Date:** 2026-11-11

## Context
Repeating raw string arrays (such as `["properties"]` or `["auth", "me"]`) across queries, cache updates, and mutation invalidations is error-prone and difficult to refactor as the number of endpoints grows. We need a single source of truth for all cache identifiers and related key groups.

## Decision
1. **Hierarchical Key Factory (`src/api/queryKeys.ts`):**
   Define a single `queryKeys` object where each domain exposes `.all`, `.lists()`, `.details()`, and `.detail(id)` composed from its parent prefix (`[...queryKeys.properties.all, "list"] as const`).
2. **Co-located `queryOptions` Factories (`authQueries`, `propertyQueries`, `healthQueries`):**
   Bind each `queryKey` and `queryFn` together using TanStack Query v5's `queryOptions()` helper so callers (`useQuery`, `setQueryData`, `removeQueries`) share the exact same key reference and inferred return type.
3. **Declarative Mutation Invalidation via `meta.invalidates` (`src/api/queryClient.ts`):**
   Augment TanStack Query's `Register` interface with `AppMutationMeta` (`invalidates?: readonly QueryKey[]`). Mutations declare which key groups they invalidate (e.g., `meta: { invalidates: [queryKeys.properties.all, queryKeys.auth.me()] }`), and `MutationCache.onSuccess` invalidates them centrally.

## Consequences
- **Positive:** Zero raw string-array query keys anywhere outside `src/api/queryKeys.ts`; renaming a key prefix or restructuring a domain cache hierarchy requires changing a single line; cross-domain invalidations (like `createProperty` or `deleteProperty` affecting `auth.me().preferredPropertyId`) are declarative and self-documenting.
- **Negative / Trade-offs:** Developers must register new domain keys in `src/api/queryKeys.ts` before creating queries.
