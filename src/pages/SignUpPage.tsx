import { useState } from "react";
import { useSignUpMutation } from "@/api/auth.api";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import {
  Alert,
  Anchor,
  Button,
  Flex,
  Input,
  Select,
} from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/types";
import { signUpEmailSchema } from "@/validators/authValidators";

export function SignUpPage() {
  const { locale, t } = useI18n();
  const signUpMutation = useSignUpMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(signUpEmailSchema, {
      defaultValues: {
        firstName: "",
        lastName: undefined,
        email: "",
        password: "",
        locale: locale || DEFAULT_LOCALE,
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
    <AuthCard
      title={t.auth.signUp.title}
      subtitle={t.auth.signUp.subtitle}
      footer={
        <>
          <span>{t.auth.signUp.hasAccountPrompt} </span>
          <Anchor to="/sign-in">{t.auth.signUp.signInLink}</Anchor>
        </>
      }
    >
      {isSubmitted ? (
        <Flex direction="column" gap={4}>
          <Alert variant="success">
            <Flex direction="column" gap={1}>
              <strong>{t.auth.signUp.successTitle}</strong>
              <p>{t.auth.signUp.successMessage}</p>
            </Flex>
          </Alert>
          <Button
            as={Anchor}
            to="/verify-email"
            variant="primary"
            fullWidth
          >
            {t.auth.signUp.goToVerifyLink}
          </Button>
        </Flex>
      ) : (
        <form method="post" onSubmit={onSubmit} noValidate>
          <fieldset
            className="ui-fieldset"
            disabled={signUpMutation.isPending}
          >
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

            <Select
              id="sign-up-locale"
              label={t.auth.languageLabel}
              hint={t.auth.languageHint}
              required
              options={SUPPORTED_LOCALES.map((supportedLocale) => ({
                value: supportedLocale,
                label: t.preferences.languages[supportedLocale],
              }))}
              error={getFieldError("locale")}
              {...register("locale")}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={signUpMutation.isPending}
              style={{
                marginBlockStart: "var(--primitive-space-2)",
              }}
            >
              {t.auth.signUp.submit}
            </Button>
          </fieldset>
        </form>
      )}
    </AuthCard>
  );
}
