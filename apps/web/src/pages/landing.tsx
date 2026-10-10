import { Link } from "react-router";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CameraIcon,
  FootprintsIcon,
  GitCompareArrowsIcon,
  CodeIcon,
  MapPinIcon,
} from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import {
  EvidencePhotos,
  EvidenceViewer,
} from "@/components/landing/evidence-photos";
import { PublicFooter, PublicHeader } from "@/components/layout/public-layout";
import "./landing.css";

const steps = [
  {
    title: "Notice something.",
    Icon: CameraIcon,
    body: "A fallen branch. A broken path. Take a photo, add the location, and start a report. Gemma helps describe what is visible.",
  },
  {
    title: "Come back to it.",
    Icon: FootprintsIcon,
    body: "Photograph the same spot on your next walk. Every visit adds to the history. The original stays right where it belongs.",
  },
  {
    title: "See what changed.",
    Icon: GitCompareArrowsIcon,
    body: "Compare the photos. See what was added, removed or unchanged. A person decides when the issue is resolved.",
  },
];

export function LandingPage() {
  return (
    <div className="landing">
      <a href="#landing-main" className="landing-skip">
        Skip to content
      </a>
      <PublicHeader />
      <main id="landing-main">
        <section
          className="landing-hero landing-wrap"
          aria-labelledby="hero-title"
        >
          <div className="landing-hero-copy">
            <p className="landing-kicker">GitHub Issues for the real world</p>
            <h1 id="hero-title">
              Take a walk.
              <br />
              Look a little
              <br />
              <span>closer.</span>
            </h1>
            <p className="landing-intro">
              Spot a problem. Save a photo. Return with evidence of what
              changed.
            </p>
            <div className="landing-actions">
              <Link className="landing-button" to="/app/report">
                Report an issue <ArrowUpRightIcon aria-hidden size={19} />
              </Link>
              <a className="landing-text-link" href="#real-revisit">
                See a real revisit <ArrowRightIcon aria-hidden size={18} />
              </a>
            </div>
            <p className="landing-hero-note">
              For the streets, paths and places we share.
            </p>
          </div>
          <EvidencePhotos />
        </section>

        <section
          className="landing-loop landing-wrap"
          aria-labelledby="loop-title"
        >
          <Reveal className="landing-loop-heading">
            <h2 id="loop-title">
              Reporting is the start.
              <br />
              <span>Coming back is the point.</span>
            </h2>
            <p>
              A report should be more than a pin on a map. Keep a record people
              can return to, question, and update.
            </p>
          </Reveal>
          <ol className="landing-steps">
            {steps.map(({ title, body, Icon }, index) => (
              <li key={title}>
                <Reveal delay={index * 0.07} className="landing-step">
                  <span className="landing-step-icon">
                    <Icon aria-hidden size={26} strokeWidth={1.5} />
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="real-revisit"
          className="landing-proof"
          aria-labelledby="evidence-title"
        >
          <div className="landing-wrap landing-proof-grid">
            <Reveal>
              <EvidenceViewer />
            </Reveal>
            <Reveal className="landing-proof-copy" delay={0.1}>
              <p className="landing-kicker">
                <MapPinIcon aria-hidden size={14} /> Lucknow, India / FI-000007
              </p>
              <h2 id="evidence-title">
                Same tree.
                <br />
                Another day.
                <br />
                <span>Still worth checking.</span>
              </h2>
              <p>
                One real report. A return to the same tree. The cut trunk, dry
                branches and litter were still visible.
              </p>
              <div className="landing-result">
                <span>Saved comparison / 10 October 2026</span>
                <strong>
                  Unchanged <GitCompareArrowsIcon aria-hidden size={22} />
                </strong>
                <p>
                  Gemma found no significant change. An unchanged result is
                  useful evidence, too.
                </p>
              </div>
              <Link
                to="/app/issues/FI-000007/evidence"
                className="landing-text-link"
              >
                Follow the complete history{" "}
                <ArrowUpRightIcon aria-hidden size={18} />
              </Link>
              <p className="landing-evidence-note">
                The history also retains an excluded wrong-location photo. This
                revisit inherited the report’s location; it did not capture
                fresh GPS.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          className="landing-walk landing-wrap"
          aria-labelledby="walk-title"
        >
          <Reveal className="landing-walk-copy">
            <FootprintsIcon
              aria-hidden
              className="landing-walk-icon"
              size={42}
              strokeWidth={1.3}
            />
            <h2 id="walk-title">
              Your usual route.
              <br />A new reason to walk it.
            </h2>
            <p>
              Find unresolved issues nearby. Plan up to five stops, revisit them
              on foot, and add a fresh photo at each one.
            </p>
            <Link to="/app/walk" className="landing-button">
              Plan a walk <ArrowUpRightIcon aria-hidden size={19} />
            </Link>
            <p className="landing-safety">
              Stay on public paths and keep a safe distance. Never approach
              traffic, exposed wiring or other hazards for a photo.
            </p>
          </Reveal>
          <Reveal className="landing-walk-art" delay={0.1}>
            <figure>
              <img
                src="/assets/field-walk.png"
                alt="Illustration of a green park path with trees and a bench"
                width={1536}
                height={1024}
                loading="lazy"
              />
              <figcaption>
                Generated illustration. Real evidence lives in the reports.
              </figcaption>
            </figure>
          </Reveal>
        </section>

        <section
          className="landing-trust landing-wrap"
          aria-labelledby="ai-title"
        >
          <Reveal className="landing-trust-heading">
            <h2 id="ai-title">
              AI helps you look.
              <br />
              You make the call.
            </h2>
            <p>
              Gemma describes visible conditions and compares photos. It never
              closes an issue or certifies a place as safe.
            </p>
            <Link className="landing-text-link" to="/methodology">
              Read the methodology <ArrowUpRightIcon aria-hidden size={17} />
            </Link>
          </Reveal>
          <div className="landing-trust-details">
            <Reveal>
              <h3>Evidence you can inspect.</h3>
              <p>
                Original photos, observations, corrections and model details
                stay in the report history.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h3>Models you can question.</h3>
              <p>
                Explore saved Tinker examples and model comparisons in the
                public Model Lab.
              </p>
              <Link to="/app/lab" className="landing-text-link">
                Open the Model Lab <ArrowUpRightIcon aria-hidden size={16} />
              </Link>
            </Reveal>
            <Reveal delay={0.16}>
              <h3>Source you can read.</h3>
              <p>
                FieldIssue is open source. Look through the code, the checks,
                and how the pieces work together.
              </p>
              <a
                href="https://github.com/himanshu748/fieldissue"
                target="_blank"
                rel="noreferrer"
                className="landing-text-link"
              >
                <CodeIcon aria-hidden size={17} /> Explore the repository{" "}
                <ArrowUpRightIcon aria-hidden size={16} />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="landing-close" aria-labelledby="cta-title">
          <div className="landing-wrap">
            <Reveal>
              <h2 id="cta-title">
                Good things start
                <br />
                with paying attention.
              </h2>
              <div className="landing-actions">
                <Link to="/app/report" className="landing-button">
                  Report what you noticed{" "}
                  <ArrowUpRightIcon aria-hidden size={20} />
                </Link>
                <Link to="/app/explore" className="landing-text-link">
                  Explore nearby <ArrowRightIcon aria-hidden size={18} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
