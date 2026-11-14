import { useState } from "react";
import { useSearchParams } from "react-router";
import { useResetPasswordMutation } from "@/api/auth.api";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { Alert, Anchor, Button, Flex, Input } from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { resetPasswordSchema } from "@/validators/authValidators";

export function ResetPasswordPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const resetMutation = useResetPasswordMutation();
  const [completed, setCompleted] = useState(false);

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(resetPasswordSchema, {
      defaultValues: {
        token: searchParams.get("token") ?? "",
        password: "",
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetMutation.mutateAsync(values);
      setCompleted(true);
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <AuthCard
      title={t.auth.resetPassword.title}
      subtitle={t.auth.resetPassword.subtitle}
      footer={<Anchor to="/sign-in">{t.auth.forgotPassword.backToSignIn}</Anchor>}
    >
      {completed ? (
        <Flex direction="column" gap={4}>
          <Alert variant="success">
            <Flex direction="column" gap={1}>
              <strong>{t.auth.resetPassword.successTitle}</strong>
              <p>{t.auth.resetPassword.successMessage}</p>
            </Flex>
          </Alert>
          <Button as={Anchor} to="/sign-in" variant="primary" fullWidth>
            {t.auth.resetPassword.proceedToSignIn}
          </Button>
        </Flex>
      ) : (
        <form method="post" onSubmit={onSubmit} noValidate>
          <fieldset
            className="ui-fieldset"
            disabled={resetMutation.isPending}
          >
            <Input
              id="reset-password-token"
              type="text"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="next"
              required
              label={t.auth.tokenLabel}
              hint={t.auth.tokenHint}
              error={getFieldError("token")}
              {...register("token")}
            />

            <PasswordInput
              id="reset-password-new"
              autoComplete="new-password"
              enterKeyHint="done"
              required
              label={t.auth.resetPassword.newPasswordLabel}
              hint={t.auth.passwordHint}
              error={getFieldError("password")}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={resetMutation.isPending}
            >
              {t.auth.resetPassword.submit}
            </Button>
          </fieldset>
        </form>
      )}
    </AuthCard>
  );
}
