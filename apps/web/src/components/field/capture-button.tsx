import { useEffect, useId, useRef, useState } from "react";
import { CameraIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatBytes, prepareImage, type PreparedImage } from "@/lib/image";
import { cn } from "@/lib/utils";

export function CaptureButton({
  value,
  onChange,
  serverMaxBytes,
  prompt = "Take a photo",
  disabled,
}: {
  value: PreparedImage | null;
  onChange: (value: PreparedImage | null) => void;
  serverMaxBytes?: number;
  prompt?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (!value) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(value.blob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  async function choose(file: File | undefined) {
    if (!file) return;
    setPreparing(true);
    setError(undefined);
    try {
      onChange(await prepareImage(file, serverMaxBytes));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPreparing(false);
      if (input.current) input.current.value = "";
      if (gallery.current) gallery.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="sr-only"
        disabled={disabled || preparing}
        onChange={(e) => choose(e.target.files?.[0])}
      />
      <input ref={gallery} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a photo from your files" className="sr-only" disabled={disabled || preparing} onChange={(e) => choose(e.target.files?.[0])} />
      {preview && value ? (
        <figure className="flex flex-col gap-2">
          <div className="relative overflow-hidden border border-ink bg-muted">
            <img src={preview} alt="Selected photo preview" className="max-h-[60vh] w-full object-contain" />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs">
              {value.width}×{value.height} · {formatBytes(value.blob.size)} JPEG · location metadata removed
            </span>
            <span className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => gallery.current?.click()} disabled={disabled || preparing}>
                <RefreshCwIcon data-icon="inline-start" />
                Replace
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)} disabled={disabled}>
                <XIcon data-icon="inline-start" />
                Remove
              </Button>
            </span>
          </figcaption>
        </figure>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={disabled || preparing}
          className={cn(
            "flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-ink/40 bg-surface p-6 text-center transition-colors hover:border-ink hover:bg-paper focus-within:border-ink",
            (disabled || preparing) && "pointer-events-none opacity-60",
          )}
        >
          <span className="grid size-16 place-items-center rounded-full bg-ink text-paper">
            {preparing ? <Spinner className="size-6" /> : <CameraIcon aria-hidden className="size-7" />}
          </span>
          <span className="font-heading text-xl font-semibold uppercase tracking-wide">
            {preparing ? "Preparing photo…" : prompt}
          </span>
          <span className="text-sm text-muted-foreground">Camera or gallery · JPEG, PNG or WebP · resized to 1600 px</span>
        </button>
      )}
      {!value ? <Button type="button" variant="outline" onClick={() => gallery.current?.click()} disabled={disabled || preparing}>Choose an existing photo</Button> : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
