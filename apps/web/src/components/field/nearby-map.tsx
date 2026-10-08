import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Point } from "@/lib/geo";
import type { Status } from "@/lib/types";

const LeafletMap = lazy(() => import("./leaflet-map"));

export interface MapMarker extends Point {
  id: string;
  title: string;
  status?: Status;
  label?: string;
}

export interface NearbyMapProps {
  markers: MapMarker[];
  center?: Point | null;
  origin?: Point | null;
  activeId?: string;
  route?: boolean;
  radiusMeters?: number;
  onSelect?: (id: string) => void;
  onPick?: (point: Point) => void;
  className?: string;
}

const CONSENT = "fieldissue-map-consent";

function hasMapConsent() {
  try {
    return sessionStorage.getItem(CONSENT) === "1";
  } catch {
    return false;
  }
}

// Tiles come from OpenStreetMap's servers, which then learn the viewed area,
// so the map loads only after the person asks for it.
class MapBoundary extends Component<{ children: ReactNode; className: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className={cn(this.props.className, "flex flex-col items-center justify-center gap-3 p-5")} role="alert">
      <p>The map could not load. Your reports are still available in the list.</p>
      <Button type="button" variant="outline" onClick={() => window.location.reload()}>Reload map</Button>
    </div>;
    return this.props.children;
  }
}

export function NearbyMap(props: NearbyMapProps) {
  const [enabled, setEnabled] = useState(hasMapConsent);
  const frame = cn("relative isolate min-h-64 border border-ink bg-[#E7E3D6]", props.className);
  if (!enabled)
    return (
      <div className={cn(frame, "grid-lines flex flex-col items-center justify-center gap-3 p-6 text-center")}>
        <MapIcon aria-hidden className="size-6" />
        <p className="max-w-xs text-sm text-muted-foreground">
          The map loads tiles from OpenStreetMap, which will see the area you view.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            try {
              sessionStorage.setItem(CONSENT, "1");
            } catch {
              // Consent then lasts for this view only.
            }
            setEnabled(true);
          }}
        >
          Show map
        </Button>
      </div>
    );
  return (
    <MapBoundary className={frame}><Suspense fallback={<Skeleton className={frame} />}>
      <LeafletMap {...props} className={frame} />
    </Suspense></MapBoundary>
  );
}
