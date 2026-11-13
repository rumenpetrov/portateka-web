import { useState } from "react";
import { useSearchParams } from "react-router";
import { useResetPasswordMutation } from "@/api/auth.api";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { Alert, Anchor, Button, Card, CardContent, Input } from "@/components/ui";
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
            {t.auth.resetPassword.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.auth.resetPassword.subtitle}
          </p>
        </div>

        {completed ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--primitive-space-4)",
            }}
          >
            <Alert variant="success">
              <strong>{t.auth.resetPassword.successTitle}</strong>
              <p style={{ marginBlockStart: "var(--primitive-space-1)" }}>
                {t.auth.resetPassword.successMessage}
              </p>
            </Alert>
            <Button as={Anchor} to="/sign-in" variant="primary" fullWidth>
              {t.auth.resetPassword.proceedToSignIn}
            </Button>
          </div>
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
