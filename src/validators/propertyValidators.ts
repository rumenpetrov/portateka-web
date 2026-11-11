import { z } from "zod";

// Direct copy from portateka-api/src/validators/propertyValidators.ts
// Messages are short machine codes; the client translates them.
export const propertyIdParamSchema = z.object({
  id: z.uuid("invalid_uuid"),
});

export const createPropertySchema = z.object({
  name: z
    .string({ error: "required" })
    .trim()
    .min(1, "required")
    .max(100, "too_long"),
  description: z
    .string({ error: "invalid_type" })
    .trim()
    .max(1000, "too_long")
    .nullable()
    .optional(),
  notes: z
    .string({ error: "invalid_type" })
    .trim()
    .max(2000, "too_long")
    .nullable()
    .optional(),
});

export const updatePropertySchema = createPropertySchema.partial();
