import { useState } from "react";
import { useForgotPasswordMutation } from "@/api/auth.api";
import { Alert, Anchor, Button, Card, CardContent, Flex, Input } from "@/components/ui";
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
    <Card>
      <CardContent>
        <div style={{ marginBlockEnd: "var(--primitive-space-5)" }}>
          <h1
            style={{
              fontSize: "var(--primitive-text-xl)",
              fontWeight: "var(--primitive-weight-bold)",
              marginBlockEnd: "var(--primitive-space-1)",
            }}
          >
            {t.auth.forgotPassword.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.auth.forgotPassword.subtitle}
          </p>
        </div>

        {sent ? (
          <Flex direction="column" gap={4}>
            <Alert variant="success">
              <strong>{t.auth.forgotPassword.successTitle}</strong>
              <p style={{ marginBlockStart: "var(--primitive-space-1)" }}>
                {t.auth.forgotPassword.successMessage}
              </p>
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

        <div
          style={{
            marginBlockStart: "var(--primitive-space-6)",
            paddingBlockStart: "var(--primitive-space-4)",
            borderBlockStart: "1px solid var(--theme-border-subtle)",
            fontSize: "var(--primitive-text-sm)",
            textAlign: "center",
          }}
        >
          <Anchor to="/sign-in">{t.auth.forgotPassword.backToSignIn}</Anchor>
        </div>
      </CardContent>
    </Card>
  );
}
