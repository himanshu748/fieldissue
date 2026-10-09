import { useDeferredValue, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FootprintsIcon, ListIcon, MapIcon, PlusIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IssueCard } from "@/components/field/issue-card";
import { LocationPicker } from "@/components/field/location-picker";
import { NearbyMap, type MapMarker } from "@/components/field/nearby-map";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { useResource } from "@/hooks/use-resource";
import { api } from "@/lib/api";
import { distanceMeters, recallLocation, type Located } from "@/lib/geo";
import { label } from "@/lib/format";
import { CATEGORIES, SEVERITIES, STATUSES, type Issue } from "@/lib/types";
import { cn } from "@/lib/utils";

const RADII = [250, 500, 1000, 5000] as const;
const PAGE = 20;
const ANY = "any";

function FilterSelect({
  id,
  name,
  value,
  options,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={id} className="eyebrow text-muted-foreground">
        {name}
      </FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ANY}>Any {name.toLowerCase()}</SelectItem>
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {label(o)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function ExplorePage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<Located | null>(recallLocation);
  const [radius, setRadius] = useState<number>(1000);
  const [status, setStatus] = useState(ANY);
  const [category, setCategory] = useState(ANY);
  const [severity, setSeverity] = useState(ANY);
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search.trim());
  const [view, setView] = useState<"list" | "map">("list");
  const [active, setActive] = useState<string>();
  const [extra, setExtra] = useState<{ items: Issue[]; cursor: string | null; loading: boolean; error?: Error }>({
    items: [],
    cursor: null,
    loading: false,
  });

  const params = useMemo(() => {
    const p = new URLSearchParams({ limit: String(PAGE) });
    if (status !== ANY) p.set("status", status);
    if (category !== ANY) p.set("category", category);
    if (severity !== ANY) p.set("severity", severity);
    if (query) p.set("search", query.slice(0, 120));
    if (origin) {
      p.set("near_lat", String(origin.latitude));
      p.set("near_lon", String(origin.longitude));
      p.set("radius_meters", String(radius));
    }
    return p.toString();
  }, [status, category, severity, query, origin, radius]);

  const list = useResource(
    async (signal) => {
      const result = await api.listIssues(new URLSearchParams(params), signal);
      setExtra({ items: [], cursor: result.nextCursor, loading: false });
      return result;
    },
    [params],
  );

  const issues = useMemo(() => [...(list.data?.items ?? []), ...extra.items], [list.data, extra.items]);
  const withDistance = useMemo(
    () =>
      issues.map((issue) => ({
        issue,
        distance: origin ? distanceMeters(origin, issue) : undefined,
      })),
    [issues, origin],
  );
  const markers = useMemo<MapMarker[]>(
    () =>
      issues.map((i) => ({
        id: i.publicId,
        latitude: i.latitude,
        longitude: i.longitude,
        title: `${i.publicId} ${i.title}`,
        status: i.status,
      })),
    [issues],
  );

  async function loadMore() {
    if (!extra.cursor) return;
    setExtra((e) => ({ ...e, loading: true, error: undefined }));
    try {
      const p = new URLSearchParams(params);
      p.set("cursor", extra.cursor);
      const next = await api.listIssues(p);
      setExtra((e) => ({ items: [...e.items, ...next.items], cursor: next.nextCursor, loading: false }));
    } catch (error) {
      setExtra((e) => ({ ...e, loading: false, error: error as Error }));
    }
  }

  const filtered = status !== ANY || category !== ANY || severity !== ANY || !!query;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">Explore</p>
          <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">Your neighbourhood</h1>
        </div>
        <Button asChild>
          <Link to="/app/report">
            <PlusIcon data-icon="inline-start" />
            Report issue
          </Link>
        </Button>
      </div>

      <section aria-labelledby="where" className="grid gap-6 border border-ink bg-paper p-4 sm:p-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-3">
          <h2 id="where" className="eyebrow">
            Where
          </h2>
          <LocationPicker value={origin} onChange={setOrigin} idPrefix="explore" />
          {origin ? (
            <Button variant="link" className="self-start px-0" onClick={() => setOrigin(null)}>
              Clear location and show all recent issues
            </Button>
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="explore-search" className="eyebrow">
              Search
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="explore-search"
                type="search"
                placeholder="Title or FI number"
                maxLength={120}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon aria-hidden />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <div className="flex flex-col gap-2">
            <span className="eyebrow" id="distance-label">
              Distance {origin ? null : <span className="normal-case tracking-normal text-muted-foreground">(set a location first)</span>}
            </span>
            <ToggleGroup
              type="single"
              variant="outline"
              aria-labelledby="distance-label"
              value={String(radius)}
              onValueChange={(v) => v && setRadius(Number(v))}
              disabled={!origin}
              className="w-full"
            >
              {RADII.map((r) => (
                <ToggleGroupItem key={r} value={String(r)} className="flex-1 font-mono">
                  {r < 1000 ? `${r} m` : `${r / 1000} km`}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FilterSelect id="f-status" name="Status" value={status} options={STATUSES} onChange={setStatus} />
            <FilterSelect id="f-category" name="Category" value={category} options={CATEGORIES} onChange={setCategory} />
            <FilterSelect id="f-severity" name="Severity" value={severity} options={SEVERITIES} onChange={setSeverity} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {list.loading
            ? "Loading issues…"
            : `${issues.length} issue${issues.length === 1 ? "" : "s"}${extra.cursor ? " loaded, more available" : ""}${origin ? ` within ${radius < 1000 ? `${radius} m` : `${radius / 1000} km`}` : ", most recent first"}`}
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          value={view}
          onValueChange={(v) => v && setView(v as "list" | "map")}
          aria-label="Results view"
          className="lg:hidden"
        >
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="map" aria-label="Map view">
            <MapIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {list.error ? <ErrorNotice error={list.error} onRetry={list.reload} title="Issues could not be loaded" /> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className={cn("lg:sticky lg:top-24 lg:block lg:self-start", view === "map" ? "block" : "hidden")}>
          <NearbyMap
            markers={markers}
            origin={origin}
            radiusMeters={origin ? radius : undefined}
            activeId={active}
            onSelect={(id) => navigate(`/app/issues/${id}`)}
            className="h-[60vh] lg:h-[calc(100dvh-8rem)]"
          />
        </div>
        <div className={cn("flex flex-col gap-4", view === "map" && "hidden lg:flex")}>
          {list.loading && !list.data ? (
            Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-40" />)
          ) : !list.error && issues.length === 0 ? (
            <EmptyState
              icon={filtered ? <SearchXIcon /> : <MapIcon />}
              title={filtered ? "No issues match these filters" : "No issues recorded here yet"}
              description={
                origin
                  ? "No issues have been recorded near this location yet. Nothing here is invented to fill the space."
                  : "No reports are visible here yet. Be the first to publish one."
              }
            >
              <Button asChild>
                <Link to="/app/report">Report something you noticed</Link>
              </Button>
            </EmptyState>
          ) : (
            withDistance.map(({ issue, distance }) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                distance={distance}
                active={active === issue.publicId}
                onFocus={() => setActive(issue.publicId)}
              />
            ))
          )}
          {extra.error ? <ErrorNotice error={extra.error} onRetry={loadMore} /> : null}
          {extra.cursor ? (
            <Button variant="outline" onClick={loadMore} disabled={extra.loading}>
              {extra.loading ? <Spinner data-icon="inline-start" /> : null}
              Load {PAGE} more
            </Button>
          ) : null}
        </div>
      </div>

      <div className="sticky bottom-20 z-30 flex justify-center md:bottom-6">
        <Button asChild size="lg" className="h-14 px-8 shadow-[4px_4px_0_0_var(--observe)]">
          <Link to="/app/walk" state={origin ? { origin } : undefined}>
            <FootprintsIcon data-icon="inline-start" />
            Build my walk
          </Link>
        </Button>
      </div>
    </div>
  );
}
