import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMarker, NearbyMapProps } from "./nearby-map";

function markerIcon(marker: MapMarker, active: boolean) {
  const el = document.createElement("span");
  el.className = "fi-marker";
  el.dataset.status = marker.status ?? "OPEN";
  el.dataset.active = String(active);
  if (marker.label) {
    const text = document.createElement("span");
    text.className = "fi-marker-label";
    text.textContent = marker.label;
    el.append(text);
  }
  return L.divIcon({ html: el, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });
}

const originIcon = L.divIcon({ html: '<span class="fi-origin"></span>', className: "", iconSize: [16, 16], iconAnchor: [8, 8] });

export default function LeafletMap({ center, markers, activeId, origin, route, radiusMeters, onSelect, onPick, className }: NearbyMapProps) {
  const [tileError, setTileError] = useState(false);
  const tiles = useRef<L.TileLayer | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const viewport = useRef("");
  const handlers = useRef({ onSelect, onPick });
  handlers.current = { onSelect, onPick };

  useEffect(() => {
    if (!container.current) return;
    viewport.current = "";
    const m = L.map(container.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
    const tileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m);
    tiles.current = tileLayer;
    tileLayer.on("tileerror", () => setTileError(true));
    m.on("click", (event: L.LeafletMouseEvent) =>
      handlers.current.onPick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
    );
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
      tiles.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    const group = layer.current;
    if (!m || !group) return;
    group.clearLayers();
    const points: L.LatLngExpression[] = [];
    if (origin) {
      L.marker([origin.latitude, origin.longitude], { icon: originIcon, keyboard: false, title: "Your chosen origin" }).addTo(group);
      points.push([origin.latitude, origin.longitude]);
      if (radiusMeters)
        L.circle([origin.latitude, origin.longitude], {
          radius: radiusMeters,
          color: "#17211E",
          weight: 1,
          dashArray: "4 6",
          fillOpacity: 0.03,
          interactive: false,
        }).addTo(group);
    }
    for (const marker of markers) {
      const ll: L.LatLngExpression = [marker.latitude, marker.longitude];
      points.push(ll);
      const leafletMarker = L.marker(ll, {
        icon: markerIcon(marker, marker.id === activeId),
        title: marker.title,
        alt: marker.title,
        riseOnHover: true,
      }).addTo(group);
      const caption = document.createElement("span");
      caption.textContent = marker.title;
      leafletMarker.bindTooltip(caption);
      leafletMarker.on("click", () => handlers.current.onSelect?.(marker.id));
    }
    if (route && origin && markers.length)
      L.polyline(
        [[origin.latitude, origin.longitude], ...markers.map((m) => [m.latitude, m.longitude] as L.LatLngTuple)],
        { color: "#567D5B", weight: 3, dashArray: "2 8", lineCap: "round", interactive: false },
      ).addTo(group);
    // Selection highlighting should not reset a user's pan/zoom.
    const nextView = JSON.stringify([points, center, radiusMeters]);
    if (viewport.current === nextView) return;
    viewport.current = nextView;
    if (points.length > 1) m.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 17 });
    else if (points.length === 1) {
      const point = L.latLng(points[0]);
      m.setView(point, point.lat === 0 && point.lng === 0 ? 3 : 16);
    }
    else if (center) m.setView([center.latitude, center.longitude], 15);
    else m.setView([20, 0], 2);
  }, [markers, activeId, origin, route, radiusMeters, center]);

  return (
    <div className={className}>
      <div ref={container} className="absolute inset-0" role="region" aria-label="Map of issues" />
      {tileError ? (
        <div role="alert" className="absolute inset-x-2 bottom-8 z-[1000] flex flex-wrap items-center gap-2 border border-border bg-background p-3 text-sm shadow-md">
          <span className="flex-1">Some map tiles could not load. Your location and reports are still saved.</span>
          <button type="button" className="min-h-11 border border-ink px-3" onClick={() => { setTileError(false); tiles.current?.redraw(); }}>Retry map</button>
        </div>
      ) : null}
    </div>
  );
}
