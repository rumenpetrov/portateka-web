import { Button, EmptyState } from "@/components/ui";

export interface PublicNotFoundViewProps {
  title: string;
  description: string;
  backHomeLabel: string;
  backHomeHref: string;
}

export function PublicNotFoundView({
  title,
  description,
  backHomeLabel,
  backHomeHref,
}: PublicNotFoundViewProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        <Button as="a" href={backHomeHref} variant="primary">
          {backHomeLabel}
        </Button>
      }
    />
  );
}
