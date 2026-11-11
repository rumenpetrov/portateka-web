import { Link, useNavigate } from "react-router";
import { useSignInMutation } from "@/api/auth.api";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { signInEmailSchema } from "@/validators/authValidators";

export function SignInPage() {
  const { t } = useI18n();
  const { notifySuccess } = useNotifications();
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(signInEmailSchema, {
      defaultValues: {
        email: "",
        password: "",
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signInMutation.mutateAsync(values);
      notifySuccess(t.auth.signIn.welcomeNotification);
      navigate("/properties", { replace: true });
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
            {t.auth.signIn.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.auth.signIn.subtitle}
          </p>
        </div>

        <form method="post" onSubmit={onSubmit} noValidate>
          <fieldset className="ui-fieldset" disabled={signInMutation.isPending}>
            <Input
              id="sign-in-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              spellCheck={false}
              enterKeyHint="next"
              required
              label={t.auth.emailLabel}
              placeholder={t.auth.emailPlaceholder}
              error={getFieldError("email")}
              {...register("email")}
            />

            <PasswordInput
              id="sign-in-password"
              autoComplete="current-password"
              enterKeyHint="done"
              required
              label={t.auth.passwordLabel}
              error={getFieldError("password")}
              {...register("password")}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--primitive-space-3)",
                marginBlockStart: "var(--primitive-space-5)",
              }}
            >
              <Button
                type="submit"
                variant="primary"
                isLoading={signInMutation.isPending}
                style={{ inlineSize: "100%" }}
              >
                {t.auth.signIn.submit}
              </Button>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: "var(--primitive-space-2)",
                  fontSize: "var(--primitive-text-sm)",
                }}
              >
                <Link to="/forgot-password">
                  {t.auth.signIn.forgotPasswordLink}
                </Link>
                <Link to="/verify-email">
                  {t.auth.signIn.needVerificationLink}
                </Link>
              </div>
            </div>
          </fieldset>
        </form>

        <div
          style={{
            marginBlockStart: "var(--primitive-space-6)",
            paddingBlockStart: "var(--primitive-space-4)",
            borderBlockStart: "1px solid var(--theme-border-subtle)",
            fontSize: "var(--primitive-text-sm)",
            textAlign: "center",
            color: "var(--theme-text-secondary)",
          }}
        >
          <span>{t.auth.signIn.noAccountPrompt} </span>
          <Link to="/sign-up">{t.auth.signIn.signUpLink}</Link>
        </div>
      </CardContent>
    </Card>
  );
}
