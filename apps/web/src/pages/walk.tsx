import { WalkSync } from "@/components/field/walk-sync";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { CameraIcon, CheckIcon, FootprintsIcon, RouteIcon, SearchIcon, ShieldAlertIcon, SkipForwardIcon, Undo2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IssueStatus } from "@/components/field/issue-status";
import { LocationPicker } from "@/components/field/location-picker";
import { NearbyMap } from "@/components/field/nearby-map";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { api } from "@/lib/api";
import { formatDistance, recallLocation, type Located } from "@/lib/geo";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { clearWalk, createWalk, skipItem, startWalk, useWalk, WALK_LIMIT, type WalkItem } from "@/lib/walk";
import type { WalkSuggestions } from "@/lib/types";

const RADII = [500, 1000, 2000, 5000];

function radiusLabel(r: number) {
  return r < 1000 ? `${r} m` : `${r / 1000} km`;
}

function Planner() {
  const routeOrigin = (useLocation().state as { origin?: Located } | null)?.origin;
  const [origin, setOrigin] = useState<Located | null>(routeOrigin ?? recallLocation());
  const [radius, setRadius] = useState(2000);
  const [result, setResult] = useState<{ data?: WalkSuggestions; error?: Error; loading?: boolean }>({});
  const [picked, setPicked] = useState<Set<string>>(new Set());

  async function find() {
    if (!origin) return;
    setResult({ loading: true });
    try {
      const data = await api.walkSuggestions(origin.latitude, origin.longitude, radius);
      setResult({ data });
      setPicked(new Set(data.items.slice(0, WALK_LIMIT).map((i) => i.issueId)));
    } catch (error) {
      setResult({ error: error as Error });
    }
  }

  const items = result.data?.items ?? [];
  function toggle(id: string, on: boolean) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (on && next.size < WALK_LIMIT) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow text-muted-foreground">Walk Mode</p>
        <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">Plan your next walk</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Find unresolved issues near a starting point, ordered by distance and then by how long since anyone checked. Pick up
          to {WALK_LIMIT}.
        </p>
      </div>
      <section className="grid gap-6 border border-ink p-4 sm:p-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="eyebrow">Starting point</h2>
          <LocationPicker value={origin} onChange={setOrigin} idPrefix="walk" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="eyebrow" id="walk-radius">
            Search radius
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            aria-labelledby="walk-radius"
            value={String(radius)}
            onValueChange={(v) => v && setRadius(Number(v))}
            className="w-full"
          >
            {RADII.map((r) => (
              <ToggleGroupItem key={r} value={String(r)} className="flex-1 font-mono">
                {radiusLabel(r)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button onClick={find} disabled={!origin || result.loading} size="lg">
            {result.loading ? <Spinner data-icon="inline-start" /> : <SearchIcon data-icon="inline-start" />}
            Find open issues nearby
          </Button>
          {!origin ? <p className="text-sm text-muted-foreground">Choose a starting point first.</p> : null}
        </div>
      </section>

      {result.error ? <ErrorNotice error={result.error} onRetry={find} title="Walk suggestions are unavailable" /> : null}

      {result.data && !items.length ? (
        <EmptyState
          icon={<FootprintsIcon />}
          title="No open issues within reach"
          description={`Nothing unresolved is recorded within ${radiusLabel(radius)} of this point. Try a wider radius, or report something you notice on the way.`}
        >
          <Button asChild variant="outline">
            <Link to="/app/report">Report an issue</Link>
          </Button>
        </EmptyState>
      ) : null}

      {items.length ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold uppercase">
              {items.length} open issue{items.length === 1 ? "" : "s"} nearby
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {picked.size}/{WALK_LIMIT} selected · sorted by {result.data?.sortingMethod.replaceAll("_", " ")}
            </span>
          </div>
          <ul className="flex flex-col border-t border-ink">
            {items.map((item, i) => (
              <li key={item.issueId} className="flex items-center gap-4 border-b border-ink py-3">
                <Checkbox
                  id={`pick-${item.issueId}`}
                  className="size-5"
                  checked={picked.has(item.issueId)}
                  disabled={!picked.has(item.issueId) && picked.size >= WALK_LIMIT}
                  onCheckedChange={(v) => toggle(item.issueId, v === true)}
                />
                <label htmlFor={`pick-${item.issueId}`} className="flex min-w-0 flex-1 cursor-pointer items-baseline gap-4">
                  <span className="font-mono text-observe-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{item.title}</span>
                    <span className="text-sm text-muted-foreground">Last checked {timeAgo(item.lastObservedAt)}</span>
                  </span>
                  <span className="font-mono text-sm">{formatDistance(item.distanceMeters)}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            {result.data?.routeCalculated ? null : "Distances are straight-line. No street route is calculated."}
          </p>
          <Button
            size="lg"
            className="h-14 self-start px-8"
            disabled={!picked.size || !origin}
            onClick={() => origin && createWalk(origin, radius, items.filter((i) => picked.has(i.issueId)))}
          >
            <FootprintsIcon data-icon="inline-start" />
            Save this walk
          </Button>
        </section>
      ) : null}
    </div>
  );
}

function WalkQueueItem({ item, index }: { item: WalkItem; index: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("flex flex-col gap-3 border-b border-ink py-5", item.state === "skipped" && "opacity-60")}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink font-mono text-sm",
            item.state === "visited" ? "bg-grass text-paper" : "bg-paper",
          )}
        >
          {item.state === "visited" ? <CheckIcon aria-label="Visited" className="size-5" /> : String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <Link to={`/app/issues/${item.issueId}`} className="text-lg font-semibold underline-offset-4 hover:underline">
            {item.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatDistance(item.distanceMeters)} from start · last checked {timeAgo(item.lastObservedAt)}
          </p>
        </div>
        {item.state === "visited" ? (
          <Badge className="bg-grass">Visited</Badge>
        ) : item.state === "skipped" ? (
          <Badge variant="outline">Skipped</Badge>
        ) : (
          <IssueStatus status={item.status} className="hidden sm:inline-flex" />
        )}
      </div>
      {item.state !== "visited" ? (
        <div className="flex flex-wrap gap-2 pl-14">
          {item.state === "pending" ? (
            <Button asChild size="sm">
              <Link to={`/app/issues/${item.issueId}/revisit`}>
                <CameraIcon data-icon="inline-start" />
                Revisit
              </Link>
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={() => skipItem(item.issueId)}>
            {item.state === "skipped" ? <Undo2Icon data-icon="inline-start" /> : <SkipForwardIcon data-icon="inline-start" />}
            {item.state === "skipped" ? "Undo skip" : "Skip"}
          </Button>
        </div>
      ) : null}
    </motion.li>
  );
}

function ActiveWalk() {
  const walk = useWalk()!;
  const visited = walk.items.filter((i) => i.state === "visited").length;
  const skipped = walk.items.filter((i) => i.state === "skipped").length;
  const pending = walk.items.length - visited - skipped;
  const markers = useMemo(
    () =>
      walk.items.map((i, n) => ({
        id: i.issueId,
        title: i.title,
        status: i.state === "visited" ? ("RESOLVED" as const) : i.status,
        label: String(n + 1),
        latitude: NaN,
        longitude: NaN,
      })),
    [walk.items],
  );
  const issueCoords = useIssueCoords(walk.items.map((i) => i.issueId));
  const [directionsConsent, setDirectionsConsent] = useState(false);
  const placed = useMemo(
    () => markers.flatMap((m) => (issueCoords[m.id] ? [{ ...m, ...issueCoords[m.id] }] : [])),
    [markers, issueCoords],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">{walk.startedAt ? `Walking since ${timeAgo(walk.startedAt)}` : "Your next walk"}</p>
          <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">
            {pending ? `${pending} stop${pending === 1 ? "" : "s"} to check` : "Walk complete"}
          </h1>
        </div>
        <p className="font-mono text-sm" aria-live="polite">
          {visited} visited · {skipped} skipped
        </p>
      </div>

      <Alert>
        <ShieldAlertIcon />
        <AlertTitle>Skip anything that feels unsafe</AlertTitle>
        <AlertDescription>
          There is no score and no pressure. A stop is marked visited only after a new photo is saved there.
        </AlertDescription>
      </Alert>

      <section className="space-y-3 border border-ink p-4"><h2 className="font-bold">Walking directions</h2><p className="text-sm text-muted-foreground">Open Google Maps for a walking route from the last visited stop (or your starting point) to the next stop. This shares the exact start and destination with Google. Follow local signs; accessibility and safe passage are not guaranteed.</p><label className="flex items-start gap-3"><Checkbox checked={directionsConsent} onCheckedChange={v=>setDirectionsConsent(v===true)}/>Share these two locations with Google Maps</label>{(() => {const next=walk.items.find(i=>i.state==='pending');const dest=next&&issueCoords[next.issueId];if(!dest)return <p>No pending stop with a location.</p>;const previous=walk.items.filter(i=>i.state==='visited').at(-1);const start=previous&&issueCoords[previous.issueId]||walk.origin;const url=new URL('https://www.google.com/maps/dir/');url.search=new URLSearchParams({api:'1',origin:`${start.latitude},${start.longitude}`,destination:`${dest.latitude},${dest.longitude}`,travelmode:'walking'}).toString();return directionsConsent?<Button asChild><a href={url.toString()} target="_blank" rel="noreferrer">Open walking directions</a></Button>:null;})()}</section>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col border-t border-ink">
            {walk.items.map((item, i) => (
              <WalkQueueItem key={item.issueId} item={item} index={i} />
            ))}
          </ol>
          <p className="text-sm text-muted-foreground">
            Estimated area: within {radiusLabel(walk.radiusMeters)} of your start. Order is by distance, not a street route.
          </p>
          <div className="flex flex-wrap gap-3">
            {!walk.startedAt && pending ? (
              <Button size="lg" onClick={startWalk}>
                <FootprintsIcon data-icon="inline-start" />
                Start walk
              </Button>
            ) : null}
            <Button size="lg" variant="outline" onClick={clearWalk}>
              {pending ? "Discard walk" : "Finish and clear"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <NearbyMap markers={placed} origin={walk.origin} route className="h-80 lg:h-[28rem]" />
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <RouteIcon aria-hidden className="size-4" />
            Dotted line joins stops in list order. Not a walking route.
          </p>
        </div>
      </div>
    </div>
  );
}

// Suggestions carry no coordinates, so the map looks them up per issue; this
// only runs once per stop and only after the walk view mounts.
function useIssueCoords(ids: string[]) {
  const key = ids.join(",");
  const [coords, setCoords] = useState<Record<string, { latitude: number; longitude: number }>>({});
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(
      key.split(",").filter(Boolean).map((id) =>
        api.issue(id, controller.signal).then(
          (i) => [id, { latitude: i.latitude, longitude: i.longitude }] as const,
          () => null,
        ),
      ),
    ).then((pairs) => {
      if (!controller.signal.aborted) setCoords(Object.fromEntries(pairs.filter((p) => p !== null)));
    });
    return () => controller.abort();
  }, [key]);
  return coords;
}

export function WalkPage() {
  const walk = useWalk();
  return <div className="space-y-8">{walk ? <ActiveWalk /> : <Planner />}<WalkSync /></div>;
}
