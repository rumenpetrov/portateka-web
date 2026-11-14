import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useVerifyEmailMutation } from "@/api/auth.api";
import { AuthCard } from "@/components/features/auth/AuthCard";
import {
  Alert,
  Anchor,
  Button,
  Fieldset,
  Flex,
  Input,
  Spinner,
  Text,
} from "@/components/ui";
import { useAppForm } from "@/hooks/useAppForm";
import { useI18n } from "@/i18n/I18nProvider";
import { verifyEmailSchema } from "@/validators/authValidators";

export function VerifyEmailPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const initialUrlToken = searchParams.get("token") ?? "";

  const verifyMutation = useVerifyEmailMutation();
  const [verified, setVerified] = useState(false);

  const { register, handleSubmit, getFieldError, applyServerErrors } =
    useAppForm(verifyEmailSchema, {
      defaultValues: {
        token: initialUrlToken,
      },
    });

  const autoTriggeredTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !initialUrlToken ||
      autoTriggeredTokenRef.current === initialUrlToken
    ) {
      return;
    }
    autoTriggeredTokenRef.current = initialUrlToken;

    verifyMutation
      .mutateAsync({ token: initialUrlToken })
      .then(() => {
        setVerified(true);
      })
      .catch((err: unknown) => {
        applyServerErrors(err);
      });
  }, [initialUrlToken, verifyMutation, applyServerErrors]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await verifyMutation.mutateAsync(values);
      setVerified(true);
    } catch (err) {
      applyServerErrors(err);
    }
  });

  return (
    <AuthCard
      title={t.auth.verifyEmail.title}
      subtitle={t.auth.verifyEmail.subtitle}
      footer={<Anchor to="/sign-in">{t.auth.forgotPassword.backToSignIn}</Anchor>}
    >
      {verified ? (
        <Flex direction="column" gap={4}>
          <Alert variant="success">
            <Flex direction="column" gap={1}>
              <strong>{t.auth.verifyEmail.successTitle}</strong>
              <p>{t.auth.verifyEmail.successMessage}</p>
            </Flex>
          </Alert>
          <Button as={Anchor} to="/sign-in" variant="primary" fullWidth>
            {t.auth.verifyEmail.proceedToSignIn}
          </Button>
        </Flex>
      ) : (
        <form method="post" onSubmit={onSubmit} noValidate>
          <Fieldset disabled={verifyMutation.isPending}>
            {verifyMutation.isPending && initialUrlToken ? (
              <Flex align="center" gap={2}>
                <Spinner label={t.auth.verifyEmail.verifying} />
                <Text as="span" variant="subtitle">
                  {t.auth.verifyEmail.verifying}
                </Text>
              </Flex>
            ) : null}

            <Input
              id="verify-email-token"
              type="text"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="done"
              required
              label={t.auth.tokenLabel}
              hint={t.auth.tokenHint}
              error={getFieldError("token")}
              {...register("token")}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={verifyMutation.isPending}
            >
              {t.auth.verifyEmail.submit}
            </Button>
          </Fieldset>
        </form>
      )}
    </AuthCard>
  );
}
