import { useChangePasswordMutation } from "@/api/auth.api";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Button } from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { changePasswordSchema } from "@/validators/authValidators";

export function ChangePasswordForm() {
  const { t } = useI18n();
  const { notifySuccess } = useNotifications();
  const changePasswordMutation = useChangePasswordMutation();

  const { register, handleSubmit, reset, getFieldError, applyServerErrors } =
    useAppForm(changePasswordSchema, {
      defaultValues: {
        currentPassword: "",
        newPassword: "",
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      reset();
      notifySuccess(t.profile.changePassword.updatedNotification);
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <form method="post" onSubmit={onSubmit} noValidate>
      <fieldset
        className="ui-fieldset"
        disabled={changePasswordMutation.isPending}
      >
        <PasswordInput
          id="profile-current-password"
          autoComplete="current-password"
          enterKeyHint="next"
          required
          label={t.profile.changePassword.currentPasswordLabel}
          error={getFieldError("currentPassword")}
          {...register("currentPassword")}
        />

        <PasswordInput
          id="profile-new-password"
          autoComplete="new-password"
          enterKeyHint="done"
          required
          label={t.profile.changePassword.newPasswordLabel}
          hint={t.auth.passwordHint}
          error={getFieldError("newPassword")}
          {...register("newPassword")}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={changePasswordMutation.isPending}
          style={{
            inlineSize: "100%",
            marginBlockStart: "var(--primitive-space-2)",
          }}
        >
          {t.profile.changePassword.submit}
        </Button>
      </fieldset>
    </form>
  );
}
