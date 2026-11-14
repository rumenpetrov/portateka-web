import type { z } from "zod";
import type { createPropertySchema } from "@/validators/propertyValidators";

export type PropertyFormValues = z.output<typeof createPropertySchema>;

export interface PropertyFormProps {
  initialValues?: {
    name: string;
    description: string | null;
    notes: string | null;
  };
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (
    values: PropertyFormValues,
    applyServerErrors: (err: unknown) => void,
  ) => Promise<void>;
  onCancel?: () => void;
}
