import { ImageOffIcon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedMedia } from "@/hooks/use-protected-media";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ObservationImage({
  storageKey,
  alt,
  className,
  imgClassName,
}: {
  storageKey: string | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const { url, error, loading } = useProtectedMedia(storageKey);
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {loading ? <Skeleton className="absolute inset-0" /> : null}
      {url ? (
        <img src={url} alt={alt} className={cn("size-full object-cover", imgClassName)} draggable={false} />
      ) : null}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
          {error instanceof ApiError && error.status === 401 ? (
            <>
              <LockIcon aria-hidden />
              Unlock access to view this photo.
            </>
          ) : (
            <>
              <ImageOffIcon aria-hidden />
              Photo unavailable.
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
