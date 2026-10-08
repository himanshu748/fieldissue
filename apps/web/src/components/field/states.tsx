import type { ReactNode } from "react";
import { AlertTriangleIcon, PlugZapIcon, RotateCwIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ApiError } from "@/lib/api";

export function ErrorNotice({ error, onRetry, title }: { error: Error; onRetry?: () => void; title?: string }) {
  const api = error instanceof ApiError ? error : null;
  return (
    <Alert variant="destructive" role="alert">
      <AlertTriangleIcon />
      <AlertTitle>{title ?? "Something went wrong"}</AlertTitle>
      <AlertDescription>
        <p>{error.message}</p>
        {api?.requestId ? (
          <p className="font-mono text-xs">
            {api.code} · request {api.requestId}
          </p>
        ) : null}
      </AlertDescription>
      {onRetry && (!api || api.retryable || api.status === 401) ? (
        <AlertAction>
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RotateCwIcon data-icon="inline-start" />
            Retry
          </Button>
        </AlertAction>
      ) : null}
    </Alert>
  );
}

export function ProviderUnavailable({ name, detail }: { name: string; detail: ReactNode }) {
  return (
    <Alert>
      <PlugZapIcon />
      <AlertTitle>{name} unavailable</AlertTitle>
      <AlertDescription>{detail}</AlertDescription>
    </Alert>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Empty className="border border-dashed border-input bg-surface/60 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle className="font-heading text-lg">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}
