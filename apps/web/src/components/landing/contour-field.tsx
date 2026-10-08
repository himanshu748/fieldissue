// Deterministic topographic rings. Generated once at module load so the hero
// carries no runtime cost beyond painting static SVG paths.
function ring(cx: number, cy: number, r: number, seed: number) {
  const points: string[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble =
      Math.sin(3 * t + seed) * r * 0.08 +
      Math.sin(5 * t + seed * 1.7) * r * 0.045 +
      Math.cos(2 * t + seed * 0.6) * r * 0.06;
    const rr = r + wobble;
    points.push(`${(cx + Math.cos(t) * rr * 1.35).toFixed(1)} ${(cy + Math.sin(t) * rr).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

const hills = [
  { cx: 1180, cy: 210, rings: 11, step: 34, seed: 0.4 },
  { cx: 250, cy: 690, rings: 9, step: 38, seed: 2.1 },
  { cx: 760, cy: 860, rings: 6, step: 44, seed: 4.2 },
];

const paths = hills.flatMap((h) =>
  Array.from({ length: h.rings }, (_, i) => ({
    d: ring(h.cx, h.cy, 26 + i * h.step, h.seed + i * 0.35),
    index: i,
  })),
);

export function ContourField({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className}>
      <g fill="none" stroke="var(--ink)" strokeWidth="1">
        {paths.map((p, i) => (
          <path key={i} d={p.d} opacity={p.index % 5 === 4 ? 0.2 : 0.09} strokeWidth={p.index % 5 === 4 ? 1.4 : 1} />
        ))}
      </g>
    </svg>
  );
}
