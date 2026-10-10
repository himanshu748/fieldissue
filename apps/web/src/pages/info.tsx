import { useAppConfig } from "@/hooks/use-app-config";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Reveal } from "@/components/landing/reveal";

function Page({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-8 md:py-24">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-4 text-4xl leading-tight font-bold uppercase sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-xl text-muted-foreground">{lede}</p>
      <div className="mt-14 flex flex-col">{children}</div>
    </article>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-4 border-t border-ink py-10 sm:grid-cols-[5rem_1fr]">
        <span className="font-mono text-lg text-observe-ink">{n}</span>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex max-w-2xl flex-col gap-3 text-muted-foreground [&_strong]:text-ink">{children}</div>
        </div>
      </section>
    </Reveal>
  );
}

export function MethodologyPage() {
  return (
    <Page
      eyebrow="Methodology"
      title="How evidence becomes a record"
      lede="Every claim FieldIssue shows is tied to a stored photo, a model output with its provenance, or an explicit human action. This page explains which is which."
    >
      <Section n="01" title="Observations are append-only">
        <p>
          An issue starts from one photo, a location and an optional note. Each later photo is stored as a separate
          observation with its own capture time and location source (device, manual entry or inherited from the issue).
          Editing an issue's title, category or severity never rewrites the original model analysis.
        </p>
      </Section>
      <Section n="02" title="What the vision model produces">
        <p>
          Gemma returns a strict structure: visible objects, conditions, evidence phrases, a suggested category, a
          suggested severity and a self-reported confidence. The server rejects any output that does not match the schema.
        </p>
        <p>
          <strong>Confidence is the model's own number, not a calibrated probability.</strong> Severity is advisory and is
          not a substitute for a qualified inspection.
        </p>
      </Section>
      <Section n="03" title="Comparisons">
        <p>
          A comparison takes two observations of the same issue in chronological order and lists conditions that were
          removed, added or unchanged, with a recommended status. Comparisons are saved as their own records with model
          name and version. A photo from a different angle can produce misleading differences, so revisit screens ask you to
          match the original viewpoint where you safely can.
        </p>
      </Section>
      <Section n="04" title="People decide status">
        <p>
          The model's recommendation never changes an issue's status. Resolution requires an explicit confirmation and
          records its basis: either the latest observation or a manual confirmation without new evidence. Reopening keeps
          all earlier evidence.
        </p>
        <p>
          Guests manage reports from their reporting browser; accounts keep that ownership across devices. Operators can moderate all reports. Community review requires two other member accounts and fresh, compared evidence; the proposer and report owner cannot approve. Nicknames are unverified and the process does not certify independent people. A resolution is <strong>human-confirmed, not identity-verified</strong>.
        </p>
      </Section>
      <Section n="05" title="Walk suggestions">
        <p>
          Walk suggestions are unresolved issues within a radius, sorted by straight-line distance and then by how long
          since the last observation. No street route is calculated inside FieldIssue and no machine-learning ranking is applied. After you consent, Open walking directions sends the start and next stop coordinates to Google Maps for its walking route.
        </p>
      </Section>
      <Section n="06" title="Recorded experiments">
        <p>
          The <Link className="underline" to="/app/lab">Model Lab</Link> shows recorded evaluations, such as a small
          fine-tuning experiment on synthetic notes. The recorded evaluation remains distinct from the live Tinker note interpreter and live TabPFN synthetic scenario tester. Neither replaces photo evidence or changes a report’s status.
        </p>
      </Section>
    </Page>
  );
}

export function PrivacyPage() {
  const { config } = useAppConfig();
  return (
    <Page
      eyebrow="Privacy and safety"
      title="Photograph problems, not people"
      lede="Field photos and precise locations can reveal more than intended. FieldIssue is built to collect as little as the evidence needs."
    >
      <Section n="01" title="What leaves your device">
        <p>
          Before upload, the browser redraws your photo at no more than 1600 pixels and re-encodes it as JPEG. That removes
          embedded metadata such as camera GPS tags. Your location is only requested when you press “Use my location”, and
          there is no background tracking.
        </p>
      </Section>
      <Section n="02" title="AI processing">
        <p>
          Reports and revisits send the photo and note to the deployment's analysis service, which calls the configured
          Gemma endpoint. You are asked for consent each time before anything is sent. Model inputs and outputs are kept out
          of error telemetry by default.
        </p>
      </Section>
      <Section n="03" title="Optional services and storage">
        <p>Render runs the application. The configured PostgreSQL database stores reports, accounts and audit history; this deployment uses Tiger Data and database-backed photo storage. When enabled, Tiger Data keeps a secondary search index of report text and coordinates; local open-model embeddings turn the text into search vectors. SerpApi may receive report coordinates to look up nearby places.</p>
        <p>The synthetic scenario tester sends only the entered numeric scenario values to Prior Labs for TabPFN inference. It never uploads real reports and does not rank actual walks. Tinker receives only the selected written note after you consent to interpretation. Its model was fine-tuned on synthetic notes; its interpretations are not verified photo evidence. Backboard receives the stored note and analysis only after you consent to a comparison. ElevenLabs receives an issue briefing when you request spoken audio. These services cannot change an issue’s status.</p>
      </Section>
      <Section n="04" title="Maps">
        <p>
          Map tiles come from OpenStreetMap, whose servers see the area you view. The map stays off until you choose to
          show it. Opening optional walking directions shares the start and next stop with Google Maps.
        </p>
      </Section>
      <Section n="05" title="Guest access and operator access">
        <p>Public guest mode uses a signed, first-party, HttpOnly cookie for 30 days. It lets the reporting browser edit, resolve and reopen its reports. Sign in under Community to attach your browser-owned reports to an account. Without an account, clearing cookies or switching browsers loses these guest controls; the operator can still moderate. This is browser ownership, not a verified personal identity.</p>
        <p>New guest reports and revisits are public after explicit consent, including their photo, note and an approximate location. Public and non-owner responses round coordinates to three decimals, about 100 m. Report owners and operators retain full precision. Existing private reports stay private. Anyone can browse public reports and add revisit evidence.</p>
        <p>
          When a deployment requires a shared access token, it is stored in this browser tab's session storage only and is
          sent as an authorization header to the same origin. Photos are fetched with that header and shown through
          temporary in-memory links that are released when you leave the page.
        </p>
      </Section>
      <Section n="06" title="Drafts, removal and retention">
        <p>Unsubmitted drafts stay in this tab's session storage for up to 24 hours. Locking the workspace clears saved drafts, locations and the walk queue. Drafts are not uploaded automatically.</p>
        <p>{config?.retentionNotice || "Ask the workspace owner about this deployment's retention policy."}</p>
        <p>For removal, give the workspace owner the issue ID. Only the operator can remove the complete record and its photos, voice files and secondary search entry. The reporting browser, its linked account or an operator can change a public report’s classification or status. An evidence review can also resolve a report after two eligible workspace accounts approve. Do not publish sensitive locations. Share summaries exclude photos, notes, titles and street addresses. Public map pins and summaries round coordinates to 0.001 degrees (about 100 m). Owners and operators receive full precision, including in their summaries, so review the location before sharing. Private reports remain operator-only.</p>
      </Section>
      <Section n="07" title="Accounts and offline storage">
        <p>Accounts use a nickname and password, with a one-time recovery code instead of email reset. Passwords are salted and hashed; session and recovery tokens are stored only as hashes on the server. Account cookies expire after 30 days. Sign out all devices revokes existing sessions.</p>
        <p>Workspace names, area descriptions, membership, assignments and review notes are visible to members. Added issue reports remain public. Saved account walks include their exact start and stops and are private to that account. Remove the account copy from the Walk screen. In-app reminders and subscribed updates are visible in Community; there is no email or push delivery.</p>
        <p>Offline capture is optional and keeps up to ten photos, notes and exact coordinates in this browser. Use a personal device. Captures expire after seven days and expired files are removed when the queue is next opened. Delete from device removes a saved capture. Signing out clears the queue. The offline shell caches static assets only, never API responses or report photos. Uploads require your review and consent, one capture at a time.</p>
      </Section>
      <Section n="08" title="Safety">
        <p>
          <strong>Never put yourself at risk for a photo.</strong> Do not step into traffic, onto private property or near
          exposed electrical wiring or open manholes. For dangerous situations, keep your distance and contact local
          emergency or municipal services. FieldIssue is not an emergency service.
        </p>
        <p>Avoid photographing faces, vehicle number plates and the inside of homes. FieldIssue does no face recognition.</p>
      </Section>
    </Page>
  );
}

export function AboutPage() {
  return (
    <Page
      eyebrow="About"
      title="GitHub Issues for the real world"
      lede="FieldIssue is an open-source neighbourhood issue tracker built for the DEV Hacktoberfest “Touch Grass” challenge. Its unit is not a post. It is an issue with a history."
    >
      <Section n="01" title="Why it exists">
        <p>
          Damaged pavements, overflowing bins and broken benches get reported and then forgotten. FieldIssue focuses on what
          happens afterward: returning to the same place, comparing evidence and recording a human decision.
        </p>
      </Section>
      <Section n="02" title="What it is not">
        <p>
          It is not a replacement for official municipal complaint services, not an emergency app, not a social feed and not
          a leaderboard. It never accuses individuals.
        </p>
      </Section>
      <Section n="03" title="Open source">
        <p>
          The code, including this interface, the Hono API and the Python intelligence service, is on{" "}
          <a className="underline" href="https://github.com/himanshu748/fieldissue" target="_blank" rel="noreferrer">
            GitHub
          </a>{" "}
          under the MIT license.
        </p>
      </Section>
    </Page>
  );
}
