import { useNavigate } from "react-router";
import { useCreatePropertyMutation } from "@/api/properties.api";
import { PropertyForm } from "@/components/features/properties/PropertyForm";
import type { PropertyFormValues } from "@/components/features/properties/PropertyForm";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { Card, CardContent, Flex } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";

export function PropertyCreatePage() {
  const { t } = useI18n();
  const { notifySuccess } = useNotifications();
  const navigate = useNavigate();
  const createMutation = useCreatePropertyMutation();

  const handleCreate = async (
    values: PropertyFormValues,
    applyServerErrors: (err: unknown) => void,
  ) => {
    try {
      await createMutation.mutateAsync(values);
      notifySuccess(t.properties.create.createdNotification);
      navigate("/properties", { replace: true });
    } catch (err) {
      applyServerErrors(err);
    }
  };

  return (
    <Flex direction="column" gap={5}>
      <div>
        <h1
          style={{
            fontSize: "var(--primitive-text-2xl)",
            fontWeight: "var(--primitive-weight-bold)",
          }}
        >
          {t.properties.create.title}
        </h1>
        <p
          style={{
            color: "var(--theme-text-secondary)",
            fontSize: "var(--primitive-text-sm)",
          }}
        >
          {t.properties.create.subtitle}
        </p>
      </div>

      <Card>
        <CardContent>
          <PropertyForm
            submitLabel={t.properties.create.submit}
            isSubmitting={createMutation.isPending}
            onSubmit={handleCreate}
            onCancel={() => navigate("/properties")}
          />
        </CardContent>
      </Card>
    </Flex>
  );
}
