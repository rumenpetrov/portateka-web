import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type {
  FieldValues,
  Path,
  Resolver,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";
import { isApiClientError } from "@/api/client";
import { translateFieldMachineCode, useI18n } from "@/i18n/I18nProvider";

/**
 * Custom Zod v4 resolver for react-hook-form that maps the first issue per field
 * directly to its machine error code (matching portateka-api's `formatIssues` behavior).
 */
function createZodMachineResolver<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !errors[field]) {
        errors[field] = {
          type: "validation",
          message: issue.message,
        };
      }
    }

    return {
      values: {},
      errors: errors as never,
    };
  };
}

export interface UseAppFormReturn<TFieldValues extends FieldValues>
  extends UseFormReturn<TFieldValues> {
  /**
   * Returns the localized human-readable error message for `field` in the active locale.
   */
  getFieldError: (field: Path<TFieldValues>) => string | undefined;
  /**
   * Maps server-side `ApiClientError.params` machine codes onto the corresponding form fields.
   */
  applyServerErrors: (error: unknown) => void;
}

export function useAppForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, "resolver">,
): UseAppFormReturn<TFieldValues> {
  const { t } = useI18n();

  const form = useForm<TFieldValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    ...options,
    resolver: createZodMachineResolver(schema),
  });

  const getFieldError = useCallback(
    (field: Path<TFieldValues>): string | undefined => {
      const fieldError = form.formState.errors[field];
      const machineCode =
        typeof fieldError?.message === "string"
          ? fieldError.message
          : undefined;

      if (!machineCode) {
        return undefined;
      }

      return translateFieldMachineCode(String(field), machineCode, t);
    },
    [form.formState.errors, t],
  );

  const applyServerErrors = useCallback(
    (error: unknown) => {
      if (!isApiClientError(error) || !error.hasFieldValidationParams()) {
        return;
      }

      if (!error.params) {
        return;
      }

      for (const [field, machineCode] of Object.entries(error.params)) {
        form.setError(field as Path<TFieldValues>, {
          type: "server",
          message: machineCode,
        });
      }
    },
    [form],
  );

  return {
    ...form,
    getFieldError,
    applyServerErrors,
  };
}
