import { useState } from "react";
import { useForgotPasswordMutation } from "@/api/auth.api";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { Alert, Anchor, Button, Flex, Input } from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { forgotPasswordSchema } from "@/validators/authValidators";

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const forgotMutation = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(forgotPasswordSchema, {
      defaultValues: {
        email: "",
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotMutation.mutateAsync(values);
      setSent(true);
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <AuthCard
      title={t.auth.forgotPassword.title}
      subtitle={t.auth.forgotPassword.subtitle}
      footer={<Anchor to="/sign-in">{t.auth.forgotPassword.backToSignIn}</Anchor>}
    >
      {sent ? (
        <Flex direction="column" gap={4}>
          <Alert variant="success">
            <Flex direction="column" gap={1}>
              <strong>{t.auth.forgotPassword.successTitle}</strong>
              <p>{t.auth.forgotPassword.successMessage}</p>
            </Flex>
          </Alert>
          <Button
            as={Anchor}
            to="/reset-password"
            variant="primary"
            fullWidth
          >
            {t.auth.forgotPassword.goToResetLink}
          </Button>
        </Flex>
      ) : (
        <form method="post" onSubmit={onSubmit} noValidate>
          <fieldset
            className="ui-fieldset"
            disabled={forgotMutation.isPending}
          >
            <Input
              id="forgot-password-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              enterKeyHint="done"
              required
              label={t.auth.emailLabel}
              placeholder={t.auth.emailPlaceholder}
              error={getFieldError("email")}
              {...register("email")}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={forgotMutation.isPending}
            >
              {t.auth.forgotPassword.submit}
            </Button>
          </fieldset>
        </form>
      )}
    </AuthCard>
  );
}
