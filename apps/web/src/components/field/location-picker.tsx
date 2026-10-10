import { useState } from "react";
import { CrosshairIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { NearbyMap } from "./nearby-map";
import {
  formatCoords,
  parseCoordinate,
  recallLocation,
  rememberLocation,
  requestDeviceLocation,
  type Located,
} from "@/lib/geo";

export function LocationPicker({
  value,
  onChange,
  idPrefix,
  showMap = true,
  allowReuse = true,
}: {
  value: Located | null;
  onChange: (value: Located | null) => void;
  idPrefix: string;
  showMap?: boolean;
  allowReuse?: boolean;
}) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string>();
  const [manual, setManual] = useState(() => ({
    lat: value?.source === "manual" ? String(value.latitude) : "",
    lon: value?.source === "manual" ? String(value.longitude) : "",
  }));
  const [manualOpen, setManualOpen] = useState(false);
  const recalled = allowReuse && !value ? recallLocation() : null;

  async function locate() {
    setLocating(true);
    setError(undefined);
    try {
      const located = await requestDeviceLocation();
      rememberLocation(located);
      onChange(located);
    } catch (e) {
      setError((e as Error).message);
      setManualOpen(true);
    } finally {
      setLocating(false);
    }
  }

  function applyManual(lat: string, lon: string) {
    setManual({ lat, lon });
    const latitude = parseCoordinate(lat, -90, 90);
    const longitude = parseCoordinate(lon, -180, 180);
    if (latitude !== null && longitude !== null) {
      const next: Located = { latitude, longitude, source: "manual" };
      rememberLocation(next);
      onChange(next);
    } else if (value?.source === "manual") onChange(null);
  }

  const manualInvalid =
    (manual.lat !== "" && parseCoordinate(manual.lat, -90, 90) === null) ||
    (manual.lon !== "" && parseCoordinate(manual.lon, -180, 180) === null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 border border-border bg-surface p-4">
        <MapPinIcon aria-hidden className={value ? "mt-0.5 text-observe-ink" : "mt-0.5 text-muted-foreground"} />
        <div className="min-w-0 flex-1" aria-live="polite">
          {value ? (
            <>
              <p className="font-mono text-sm break-all">{formatCoords(value)}</p>
              <p className="text-sm text-muted-foreground">
                {value.source === "device"
                  ? `From this device${value.accuracy ? `, accurate to about ${Math.round(value.accuracy)} m` : ""}`
                  : "Entered manually"}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No location yet. Nothing is requested until you choose.</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={locate} disabled={locating}>
          {locating ? <Spinner data-icon="inline-start" /> : <CrosshairIcon data-icon="inline-start" />}
          {locating ? "Locating…" : "Use my location"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setManualOpen((v) => !v)} aria-expanded={manualOpen}>
          Enter coordinates
        </Button>
        {recalled ? (
          <Button type="button" variant="ghost" onClick={() => onChange(recalled)}>
            Reuse {formatCoords(recalled)}
          </Button>
        ) : null}
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
      {manualOpen ? (
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field data-invalid={manual.lat !== "" && parseCoordinate(manual.lat, -90, 90) === null}>
              <FieldLabel htmlFor={`${idPrefix}-lat`}>Latitude</FieldLabel>
              <Input
                id={`${idPrefix}-lat`}
                inputMode="decimal"
                placeholder="12.97620"
                value={manual.lat}
                onChange={(e) => applyManual(e.target.value, manual.lon)}
                aria-invalid={manual.lat !== "" && parseCoordinate(manual.lat, -90, 90) === null}
              />
            </Field>
            <Field data-invalid={manual.lon !== "" && parseCoordinate(manual.lon, -180, 180) === null}>
              <FieldLabel htmlFor={`${idPrefix}-lon`}>Longitude</FieldLabel>
              <Input
                id={`${idPrefix}-lon`}
                inputMode="decimal"
                placeholder="77.59290"
                value={manual.lon}
                onChange={(e) => applyManual(manual.lat, e.target.value)}
                aria-invalid={manual.lon !== "" && parseCoordinate(manual.lon, -180, 180) === null}
              />
            </Field>
          </div>
          {manualInvalid ? (
            <FieldError>Latitude must be between -90 and 90, longitude between -180 and 180.</FieldError>
          ) : (
            <FieldDescription>Decimal degrees. {showMap ? "You can also tap the map to place the point." : null}</FieldDescription>
          )}
          {showMap ? (
            <NearbyMap
              markers={[]}
              origin={value}
              onPick={(p) => applyManual(p.latitude.toFixed(6), p.longitude.toFixed(6))}
              className="h-64"
            />
          ) : null}
        </FieldGroup>
      ) : null}
    </div>
  );
}
