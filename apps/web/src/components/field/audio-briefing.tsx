import { useEffect, useRef, useState } from "react";
import { HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api, fetchMedia } from "@/lib/api";
import { ProviderUnavailable } from "./states";

export function AudioBriefing({ issueId, available }: { issueId: string; available: boolean | undefined }) {
  const generation = useRef(0);
  const [state, setState] = useState<{ url?: string; text?: string; error?: string; loading?: boolean }>({});

  useEffect(() => () => {
    if (state.url) URL.revokeObjectURL(state.url);
  }, [state.url]);

  useEffect(() => { setState({}); return () => { generation.current++; }; }, [issueId]);

  if (available === false)
    return (
      <ProviderUnavailable
        name="Audio briefing"
        detail="Spoken briefings need ElevenLabs credentials on this deployment. Reporting and revisits work without it."
      />
    );

  async function generate() {
    const request = ++generation.current;
    setState({ loading: true });
    try {
      const audio = await api.audio(issueId);
      const blob = await fetchMedia(audio.storageKey);
      if (request !== generation.current) return;
      setState({ url: URL.createObjectURL(blob), text: audio.text });
    } catch (e) {
      if (request !== generation.current) return;
      setState({ error: (e as Error).message });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {state.url ? (
        <audio controls autoPlay onError={() => setState({ error: "The audio could not be played. Try loading the briefing again." })} src={state.url} className="w-full" aria-label="Issue briefing audio">
          Your browser cannot play this audio.
        </audio>
      ) : (
        <Button variant="outline" onClick={generate} disabled={state.loading || available === undefined}>
          {state.loading ? <Spinner data-icon="inline-start" /> : <HeadphonesIcon data-icon="inline-start" />}
          {state.loading ? "Preparing briefing…" : "Listen to briefing"}
        </Button>
      )}
      <p className="text-xs text-muted-foreground">Requesting a briefing sends its text to ElevenLabs for speech. Generated audio is cached.</p>
      {state.text ? <p className="text-sm text-muted-foreground">Transcript: {state.text}</p> : null}
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
