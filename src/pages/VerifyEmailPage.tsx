import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useVerifyEmailMutation } from "../api/auth.api";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Input,
  Spinner,
} from "../components/ui";
import { useAppForm } from "../hooks/useAppForm";
import { useI18n } from "../i18n/I18nProvider";
import { verifyEmailSchema } from "../validators/authValidators";

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
            {t.auth.verifyEmail.title}
          </h1>
          <p
            style={{
              color: "var(--theme-text-secondary)",
              fontSize: "var(--primitive-text-sm)",
            }}
          >
            {t.auth.verifyEmail.subtitle}
          </p>
        </div>

        {verified ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--primitive-space-4)",
            }}
          >
            <Alert variant="success">
              <strong>{t.auth.verifyEmail.successTitle}</strong>
              <p style={{ marginBlockStart: "var(--primitive-space-1)" }}>
                {t.auth.verifyEmail.successMessage}
              </p>
            </Alert>
            <Link
              to="/sign-in"
              className="ui-btn ui-btn--primary"
              style={{ inlineSize: "100%" }}
            >
              {t.auth.verifyEmail.proceedToSignIn}
            </Link>
          </div>
        ) : (
          <form method="post" onSubmit={onSubmit} noValidate>
            <fieldset
              className="ui-fieldset"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending && initialUrlToken ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--primitive-space-2)",
                    marginBlockEnd: "var(--primitive-space-4)",
                    fontSize: "var(--primitive-text-sm)",
                  }}
                >
                  <Spinner label={t.auth.verifyEmail.verifying} />
                  <span>{t.auth.verifyEmail.verifying}</span>
                </div>
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
                isLoading={verifyMutation.isPending}
                style={{ inlineSize: "100%" }}
              >
                {t.auth.verifyEmail.submit}
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
          <Link to="/sign-in">{t.auth.forgotPassword.backToSignIn}</Link>
        </div>
      </CardContent>
    </Card>
  );
}
