import { z } from "zod";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PROPERTIES_PAGE_LIMIT = 9;

const coerceEmptyStringToNaN = (val: unknown) => {
  if (typeof val === "string" && val.trim() === "") {
    return Number.NaN;
  }

  return val;
};

// Direct mirror from portateka-api/src/validators/paginationValidators.ts
export const paginationQuerySchema = z.object({
  page: z
    .preprocess(
      coerceEmptyStringToNaN,
      z.coerce
        .number({ error: "invalid_type" })
        .int("invalid_type")
        .min(1, "too_small"),
    )
    .default(1),
  limit: z
    .preprocess(
      coerceEmptyStringToNaN,
      z.coerce
        .number({ error: "invalid_type" })
        .int("invalid_type")
        .min(1, "too_small")
        .max(MAX_PAGE_SIZE, "too_big"),
    )
    .default(DEFAULT_PAGE_SIZE),
});

export function parsePageParam(rawPage: string | null): number {
  const parsed = paginationQuerySchema.shape.page.safeParse(
    rawPage ?? undefined,
  );
  if (!parsed.success) {
    return 1;
  }

  return parsed.data;
}
