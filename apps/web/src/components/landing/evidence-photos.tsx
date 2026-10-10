import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router";

export const evidencePhotos = [
  {
    src: "/assets/evidence/lucknow-original.jpg",
    label: "Original",
    date: "9 October 2026",
    alt: "Original report photo: a cut tree surrounded by dry branches and scattered litter in Lucknow",
  },
  {
    src: "/assets/evidence/lucknow-revisit.jpg",
    label: "Return visit",
    date: "10 October 2026",
    alt: "Return photo of the same cut tree, dry branches and litter from a different angle",
  },
];

export function EvidencePhotos() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -32]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, reduced ? -5 : 0]);
  return (
    <div className="landing-photos" ref={ref}>
      <motion.figure
        className="landing-photo-main"
        initial={reduced ? false : { opacity: 0, y: 24, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <img
          src={evidencePhotos[0].src}
          alt={evidencePhotos[0].alt}
          width={1200}
          height={1600}
          fetchPriority="high"
        />
        <figcaption>
          <span>Original observation</span>
          <time dateTime="2026-10-09">09.10.2026</time>
        </figcaption>
      </motion.figure>
      <motion.figure
        className="landing-photo-return"
        style={{ y, rotate }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
      >
        <img
          src={evidencePhotos[1].src}
          alt={evidencePhotos[1].alt}
          width={1200}
          height={1600}
        />
        <figcaption>
          <span>Back to the same spot</span>
          <time dateTime="2026-10-10">10.10.2026</time>
        </figcaption>
      </motion.figure>
      <Link to="/app/issues/FI-000007/evidence" className="landing-photo-link">
        A real revisit in Lucknow <ArrowUpRightIcon size={16} aria-hidden />
      </Link>
    </div>
  );
}

export function EvidenceViewer() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="landing-viewer">
      <div
        className="landing-photo-tabs"
        role="group"
        aria-label="Choose evidence photo"
      >
        {evidencePhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {photo.label}
            <span>{index === 0 ? "9 Oct" : "10 Oct"}</span>
          </button>
        ))}
      </div>
      <figure>
        <div className="landing-viewer-image">
          {evidencePhotos.map((photo, index) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              hidden={selected !== index}
              width={1200}
              height={1600}
              loading="lazy"
            />
          ))}
        </div>
        <figcaption aria-live="polite">
          {evidencePhotos[selected].label}, {evidencePhotos[selected].date}.
          Same place, different angle.
        </figcaption>
      </figure>
    </div>
  );
}
