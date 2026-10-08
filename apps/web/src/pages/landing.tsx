import { Link } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ContourField } from "@/components/landing/contour-field";
import { WalkTrace } from "@/components/landing/walk-trace";
import { Reveal } from "@/components/landing/reveal";
import { PublicFooter, PublicHeader } from "@/components/layout/public-layout";

const loop = [
  {
    n: "01",
    title: "Observe",
    body: "One photo, one location, one optional sentence. Gemma reads the photo into visible objects, conditions and a suggested category and severity. You can correct the title, category and severity; the original analysis stays in the history.",
  },
  {
    n: "02",
    title: "Revisit",
    body: "Come back on a later walk and photograph the same spot. The new observation is stored next to the original. Nothing is overwritten.",
  },
  {
    n: "03",
    title: "Verify",
    body: "The model lists what was added, removed or unchanged between the two photos. A person, never the model, decides whether the issue is resolved.",
  },
];

const does = [
  "Describes visible objects and conditions in a photo",
  "Suggests a category and a severity you can edit",
  "Compares two photos of one issue and lists changes",
  "Records which model and version produced each output",
];

const doesNot = [
  "Change an issue's status on its own",
  "Name a responsible person, agency or deadline",
  "Certify that a place is safe",
  "Identify faces or people",
];

export function LandingPage() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 120]);
  const fade = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 0.25]);

  return (
    <div className="bg-paper text-ink">
      <section className="paper-grain relative isolate flex min-h-dvh flex-col overflow-hidden" aria-labelledby="hero-title">
        <motion.div style={{ y: drift, opacity: fade }} className="absolute inset-0 -z-10">
          <ContourField className="absolute inset-0 size-full" />
          <WalkTrace className="absolute inset-0 size-full opacity-60 md:opacity-100" />
        </motion.div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--paper)_0%,rgb(244_241_232/0.92)_38%,rgb(244_241_232/0)_70%)] max-md:bg-[linear-gradient(180deg,rgb(244_241_232/0.9)_0%,rgb(244_241_232/0.6)_60%,var(--paper)_100%)]"
        />
        <PublicHeader overlay />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-28 pb-10 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-6 flex items-center gap-3 text-muted-foreground"
          >
            <span className="inline-block h-px w-10 bg-ink" />
            GitHub Issues for the real world
          </motion.p>
          <h1
            id="hero-title"
            className="max-w-full font-heading text-[clamp(1.85rem,8.4vw,7.25rem)] leading-[0.9] font-bold tracking-[-0.035em] uppercase [overflow-wrap:anywhere] [hyphens:none]"
          >
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              The world
            </motion.span>
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              has open <span className="relative inline-block">
                issues
                <motion.span
                  aria-hidden
                  className="absolute right-0 -bottom-1 left-0 h-[0.09em] origin-left bg-observe"
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
                />
              </span>
              <span className="text-observe">.</span>
            </motion.span>
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid gap-10 md:grid-cols-[minmax(0,26rem)_1fr] md:items-end"
          >
            <p className="font-heading text-2xl leading-snug sm:text-3xl">
              Take a walk.
              <br />
              Find what is broken.
              <br />
              <span className="text-muted-foreground">Come back with evidence.</span>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button asChild size="lg" className="h-14 px-7 text-base">
                <Link to="/app/report">
                  Report an issue
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 border-ink bg-paper/70 px-7 text-base">
                <Link to="/app/explore">Explore nearby</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-8">
          <Separator className="bg-ink" />
          <ol className="grid grid-cols-3 gap-4 pt-4 font-mono text-xs uppercase tracking-[0.18em] sm:text-sm">
            {loop.map((s) => (
              <li key={s.n} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                <span className="text-observe-ink">{s.n}</span>
                <span>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-ink" aria-labelledby="loop-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 md:py-28 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <p className="eyebrow text-muted-foreground">The loop</p>
            <h2 id="loop-title" className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
              Reporting is the start.
              <br />
              Checking is the point.
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Most reporting tools stop at “ticket created”. FieldIssue keeps each problem as a record with a history, so the
              next person walking past can check what actually changed.
            </p>
          </Reveal>
          <ol className="flex flex-col">
            {loop.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <li className="grid grid-cols-[4rem_1fr] gap-4 border-t border-ink py-8 sm:grid-cols-[6rem_1fr]">
                  <span className="font-mono text-3xl text-observe-ink sm:text-4xl">{s.n}</span>
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-wide">{s.title}</h3>
                    <p className="mt-3 max-w-xl text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative border-t border-ink bg-ink text-paper" aria-labelledby="walk-title">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <Reveal>
            <figure className="relative">
              <img
                src="/assets/field-walk.png"
                alt="Illustrated park path curving past a green bench under trees"
                className="aspect-[4/3] w-full border border-paper/30 object-cover"
                loading="lazy"
                width={1536}
                height={1024}
              />
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-wider text-paper/60">
                Illustration, generated for this page. Not field evidence.
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-paper/60">Less scrolling. More walking.</p>
            <h2 id="walk-title" className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
              Your next walk already has a purpose.
            </h2>
            <p className="mt-6 max-w-lg text-lg text-paper/75">
              Pick up to five unresolved issues near you, ordered by distance and by how long since anyone looked. Walk Mode
              marks a stop as visited only when you actually save a new photo there.
            </p>
            <p className="mt-4 max-w-lg text-paper/75">
              Never step into traffic, onto private property or near exposed wiring for a photo. For dangerous situations,
              keep your distance and contact local emergency or municipal services.
            </p>
            <Button asChild size="lg" variant="outline" className="mt-8 h-14 border-paper bg-transparent px-7 text-base text-paper hover:bg-paper hover:text-ink">
              <Link to="/app/walk">
                Plan a walk
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink" aria-labelledby="ai-title">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
          <Reveal>
            <p className="eyebrow text-muted-foreground">Open-weight AI, kept on a short leash</p>
            <h2 id="ai-title" className="mt-4 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
              The model reads the evidence. People make the calls.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px border border-ink bg-ink md:grid-cols-2">
            <Reveal className="bg-paper p-6 sm:p-10">
              <h3 className="eyebrow text-grass">What Gemma does here</h3>
              <ul className="mt-6 flex flex-col gap-4">
                {does.map((d) => (
                  <li key={d} className="flex gap-3 text-lg">
                    <CheckIcon aria-hidden className="mt-1 size-5 shrink-0 text-grass" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="bg-paper p-6 sm:p-10" delay={0.08}>
              <h3 className="eyebrow text-observe-ink">What it is never allowed to do</h3>
              <ul className="mt-6 flex flex-col gap-4">
                {doesNot.map((d) => (
                  <li key={d} className="flex gap-3 text-lg">
                    <XIcon aria-hidden className="mt-1 size-5 shrink-0 text-observe-ink" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link to="/methodology" className="inline-flex min-h-11 items-center gap-1.5 underline decoration-observe decoration-2 underline-offset-4">
              Read the methodology <ArrowUpRightIcon aria-hidden className="size-4" />
            </Link>
            <Link to="/privacy" className="inline-flex min-h-11 items-center gap-1.5 underline decoration-observe decoration-2 underline-offset-4">
              Privacy and safety <ArrowUpRightIcon aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="paper-grain relative overflow-hidden border-t border-ink" aria-labelledby="cta-title">
        <ContourField className="absolute inset-0 -z-0 size-full opacity-70" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-24 sm:px-8 md:py-32">
          <Reveal>
            <h2 id="cta-title" className="font-heading text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] font-bold tracking-tight uppercase">
              Go outside.
              <br />
              <span className="text-observe-ink">Bring evidence back.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-7 text-base">
              <Link to="/app/report">
                Report what you noticed
                <ArrowUpRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 border-ink bg-paper px-7 text-base">
              <Link to="/app/explore">See open issues</Link>
            </Button>
          </Reveal>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
