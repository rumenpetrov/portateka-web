import { useNavigate } from "react-router";
import { useSignInMutation } from "@/api/auth.api";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Anchor, Button, Fieldset, Flex, Input, Text } from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { signInEmailSchema } from "@/validators/authValidators";
import styles from "./SignInPage.module.css";

export function SignInPage() {
  const { setLocale, t } = useI18n();
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
      const output = await signInMutation.mutateAsync(values);
      if (output.user.locale) {
        setLocale(output.user.locale);
      }
      notifySuccess(t.auth.signIn.welcomeNotification);
      navigate("/properties", { replace: true });
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <AuthCard
      title={t.auth.signIn.title}
      subtitle={t.auth.signIn.subtitle}
      footer={
        <>
          <span>{t.auth.signIn.noAccountPrompt} </span>
          <Anchor to="/sign-up">{t.auth.signIn.signUpLink}</Anchor>
        </>
      }
    >
      <form method="post" onSubmit={onSubmit} noValidate>
        <Fieldset disabled={signInMutation.isPending}>
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

          <Flex
            direction="column"
            gap={3}
            className={styles.actions}
          >
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={signInMutation.isPending}
            >
              {t.auth.signIn.submit}
            </Button>

            <Text as="div" variant="subtitle">
              <Flex wrap justify="between" gap={2}>
                <Anchor to="/forgot-password">
                  {t.auth.signIn.forgotPasswordLink}
                </Anchor>
                <Anchor to="/verify-email">
                  {t.auth.signIn.needVerificationLink}
                </Anchor>
              </Flex>
            </Text>
          </Flex>
        </Fieldset>
      </form>
    </AuthCard>
  );
}
