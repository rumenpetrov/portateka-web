import { useEffect } from "react";
import type { z } from "zod";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { createPropertySchema } from "@/validators/propertyValidators";
import { Button, Flex, Input, Textarea } from "@/components/ui";

export type PropertyFormValues = z.output<typeof createPropertySchema>;

interface PropertyFormProps {
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

export function PropertyForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: PropertyFormProps) {
  const { t } = useI18n();

  const { register, handleSubmit, reset, getFieldError, applyServerErrors } =
    useAppForm(createPropertySchema, {
      defaultValues: {
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? null,
        notes: initialValues?.notes ?? null,
      },
    });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        description: initialValues.description,
        notes: initialValues.notes,
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values, applyServerErrors);
  });

  return (
    <form method="post" onSubmit={handleFormSubmit} noValidate>
      <fieldset className="ui-fieldset" disabled={isSubmitting}>
        <Input
          id="property-name"
          type="text"
          enterKeyHint="next"
          required
          label={t.properties.fields.nameLabel}
          hint={t.properties.fields.nameHint}
          error={getFieldError("name")}
          {...register("name")}
        />

        <Textarea
          id="property-description"
          label={t.properties.fields.descriptionLabel}
          hint={t.properties.fields.descriptionHint}
          error={getFieldError("description")}
          {...register("description", {
            setValueAs: (v: string | null) =>
              typeof v === "string" && v.trim() === "" ? null : v,
          })}
        />

        <Textarea
          id="property-notes"
          label={t.properties.fields.notesLabel}
          hint={t.properties.fields.notesHint}
          error={getFieldError("notes")}
          {...register("notes", {
            setValueAs: (v: string | null) =>
              typeof v === "string" && v.trim() === "" ? null : v,
          })}
        />

        <Flex
          direction="column"
          gap={2}
          style={{
            marginBlockStart: "var(--primitive-space-5)",
          }}
        >
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitLabel}
          </Button>

          {onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {t.common.cancel}
            </Button>
          ) : null}
        </Flex>
      </fieldset>
    </form>
  );
}
