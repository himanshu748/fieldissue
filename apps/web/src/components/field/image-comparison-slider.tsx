import { useId, useState } from "react";
import { MoveHorizontalIcon } from "lucide-react";
import { ObservationImage } from "./observation-image";

export function ImageComparisonSlider({
  beforeKey,
  afterKey,
  beforeLabel,
  afterLabel,
}: {
  beforeKey: string;
  afterKey: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [position, setPosition] = useState(50);
  const id = useId();
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden border border-ink bg-muted focus-within:ring-2 focus-within:ring-observe-ink focus-within:ring-offset-2">
        <ObservationImage storageKey={beforeKey} alt={`Before: ${beforeLabel}`} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <ObservationImage storageKey={afterKey} alt={`After: ${afterLabel}`} className="absolute inset-0" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper shadow-[0_0_0_1px_var(--ink)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-paper text-ink">
            <MoveHorizontalIcon />
          </span>
        </div>
        <span className="pointer-events-none absolute top-3 left-3 bg-ink/85 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-paper">
          Before
        </span>
        <span className="pointer-events-none absolute top-3 right-3 bg-ink/85 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-paper">
          After
        </span>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Comparison divider. Left shows before, right shows after."
          aria-valuetext={`${position}% before visible`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>{beforeLabel}</span>
        <label htmlFor={id} className="hidden sm:inline">
          Drag or use arrow keys to compare
        </label>
        <span className="text-right">{afterLabel}</span>
      </figcaption>
    </figure>
  );
}
