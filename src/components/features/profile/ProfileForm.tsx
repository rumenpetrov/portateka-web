import { useEffect } from "react";
import type { UserProfile } from "@/api/auth.api";
import { useUpdateMeMutation } from "@/api/auth.api";
import type { PropertyItem } from "@/api/properties.api";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { updateMeSchema } from "@/validators/authValidators";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Button, Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui";

interface ProfileFormProps {
  user: UserProfile;
  properties: readonly PropertyItem[];
}

export function ProfileForm({ user, properties }: ProfileFormProps) {
  const { t } = useI18n();
  const { notifySuccess } = useNotifications();
  const updateMeMutation = useUpdateMeMutation();

  const { register, handleSubmit, reset, getFieldError, applyServerErrors } =
    useAppForm(updateMeSchema, {
      defaultValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        preferredPropertyId: user.preferredPropertyId,
      },
    });

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      preferredPropertyId: user.preferredPropertyId,
    });
  }, [user, reset]);

  const propertyOptions: SelectOption[] = [
    { value: "", label: t.profile.noPreferredPropertyOption },
    ...properties.map((prop) => ({
      value: prop.id,
      label: prop.name,
    })),
  ];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateMeMutation.mutateAsync(values);
      notifySuccess(t.profile.updatedNotification);
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <form method="post" onSubmit={onSubmit} noValidate>
      <fieldset className="ui-fieldset" disabled={updateMeMutation.isPending}>
        <Input
          id="profile-first-name"
          type="text"
          autoComplete="given-name"
          enterKeyHint="next"
          required
          label={t.auth.firstNameLabel}
          error={getFieldError("firstName")}
          {...register("firstName")}
        />

        <Input
          id="profile-last-name"
          type="text"
          autoComplete="family-name"
          enterKeyHint="next"
          label={t.auth.lastNameLabel}
          error={getFieldError("lastName")}
          {...register("lastName", {
            setValueAs: (v: string | null) =>
              typeof v === "string" && v.trim() === "" ? null : v,
          })}
        />

        <Select
          id="profile-preferred-property"
          label={t.profile.preferredPropertyLabel}
          hint={t.profile.preferredPropertyHint}
          options={propertyOptions}
          error={getFieldError("preferredPropertyId")}
          {...register("preferredPropertyId", {
            setValueAs: (v: string | null) =>
              typeof v === "string" && v.trim() === "" ? null : v,
          })}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={updateMeMutation.isPending}
          style={{
            marginBlockStart: "var(--primitive-space-2)",
          }}
        >
          {t.profile.saveChanges}
        </Button>
      </fieldset>
    </form>
  );
}
