import { motion, useReducedMotion } from "motion/react";

const PATH =
  "M -40 610 C 120 560, 230 470, 380 492 S 620 600, 760 520 S 930 330, 1080 352 S 1300 420, 1480 300";

const stops = [
  { x: 380, y: 492, label: "Observed", color: "var(--observe)", at: 0.9 },
  { x: 760, y: 520, label: "Revisited", color: "var(--water)", at: 1.6 },
  { x: 1080, y: 352, label: "Verified", color: "var(--grass)", at: 2.3 },
];

export function WalkTrace({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className}>
      <path d={PATH} fill="none" stroke="var(--ink)" strokeOpacity="0.1" strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d={PATH}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeDasharray="1 9"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      />
      {stops.map((s) => (
        <motion.g
          key={s.label}
          initial={reduced ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: s.at, type: "spring", stiffness: 260, damping: 18 }}
        >
          {!reduced ? (
            <motion.circle
              cx={s.x}
              cy={s.y}
              r="10"
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ delay: s.at + 0.3, duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: `${s.x}px ${s.y}px` }}
            />
          ) : null}
          <circle cx={s.x} cy={s.y} r="11" fill={s.color} stroke="var(--ink)" strokeWidth="2.5" />
          <circle cx={s.x} cy={s.y} r="3.5" fill="var(--ink)" />
          <g transform={`translate(${s.x + 20} ${s.y - 18})`}>
            <rect x="0" y="-15" width={s.label.length * 10.5 + 18} height="24" fill="var(--paper)" stroke="var(--ink)" />
            <text x="9" y="2" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="1.5" fill="var(--ink)">
              {s.label.toUpperCase()}
            </text>
          </g>
        </motion.g>
      ))}
    </svg>
  );
}
