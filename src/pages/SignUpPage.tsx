import { useState } from "react";
import { Link } from "react-router";
import { useSignUpMutation } from "../api/auth.api";
import { PasswordInput } from "../components/features/auth/PasswordInput";
import { Alert, Button, Card, CardContent, Input } from "../components/ui";
import { useAppForm } from "../hooks/useAppForm";
import { useI18n } from "../i18n/I18nProvider";
import { signUpEmailSchema } from "../validators/authValidators";

export function SignUpPage() {
  const { t } = useI18n();
  const signUpMutation = useSignUpMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(signUpEmailSchema, {
      defaultValues: {
        firstName: "",
        lastName: undefined,
        email: "",
        password: "",
      },
    });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signUpMutation.mutateAsync(values);
      setIsSubmitted(true);
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
            {t.auth.signUp.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.auth.signUp.subtitle}
          </p>
        </div>

        {isSubmitted ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--primitive-space-4)",
            }}
          >
            <Alert variant="success">
              <strong>{t.auth.signUp.successTitle}</strong>
              <p style={{ marginBlockStart: "var(--primitive-space-1)" }}>
                {t.auth.signUp.successMessage}
              </p>
            </Alert>
            <Link
              to="/verify-email"
              className="ui-btn ui-btn--primary"
              style={{ inlineSize: "100%" }}
            >
              {t.auth.signUp.goToVerifyLink}
            </Link>
          </div>
        ) : (
          <form method="post" onSubmit={onSubmit} noValidate>
            <Input
              id="sign-up-first-name"
              type="text"
              autoComplete="given-name"
              enterKeyHint="next"
              required
              label={t.auth.firstNameLabel}
              error={getFieldError("firstName")}
              {...register("firstName")}
            />

            <Input
              id="sign-up-last-name"
              type="text"
              autoComplete="family-name"
              enterKeyHint="next"
              label={t.auth.lastNameLabel}
              error={getFieldError("lastName")}
              {...register("lastName", {
                setValueAs: (v: string) =>
                  typeof v === "string" && v.trim() === "" ? undefined : v,
              })}
            />

            <Input
              id="sign-up-email"
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
              id="sign-up-password"
              autoComplete="new-password"
              enterKeyHint="done"
              required
              label={t.auth.passwordLabel}
              hint={t.auth.passwordHint}
              error={getFieldError("password")}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={signUpMutation.isPending}
              style={{
                inlineSize: "100%",
                marginBlockStart: "var(--primitive-space-2)",
              }}
            >
              {t.auth.signUp.submit}
            </Button>
          </form>
        )}

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
          <span>{t.auth.signUp.hasAccountPrompt} </span>
          <Link to="/sign-in">{t.auth.signUp.signInLink}</Link>
        </div>
      </CardContent>
    </Card>
  );
}
