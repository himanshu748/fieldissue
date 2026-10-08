# FIELDISSUE
## Product Requirements Document + Technical Specification
### Version 2.0 | Full Product Rework

**Product tagline:** *GitHub Issues for the real world.*

**Product philosophy:** *Less scrolling. More walking. Better evidence.*

| Field | Specification |
|---|---|
| Product | FieldIssue |
| Document | PRD + Engineering Specification |
| Version | 2.0 |
| Status | Proposed redesign, implementation-ready |
| Hackathon | DEV.to Hacktoberfest Open-Source AI Challenge |
| Challenge | Week 1: Touch Grass |
| Submission deadline | October 11, 2026, 11:59 PM PDT |
| Primary platform | Mobile-first Web App / PWA |
| Primary users | Residents, walkers and community volunteers |
| Core AI | Google Gemma |
| Agent orchestration | Mastra |
| Primary deployment | Render |
| Database | PostgreSQL + PostGIS + pgvector |
| Secondary database target | Tiger Data |
| Active sponsor target | 10 meaningful integrations |
| Stretch target | 11 integrations including TabPFN |
| Development budget | $0 out of pocket, subject to verified provider allowances |
| Existing repository | [github.com/himanshu748/fieldissue](https://github.com/himanshu748/fieldissue) |
| Existing deployment | [fieldissue-demo.onrender.com](https://fieldissue-demo.onrender.com/) |

The hackathon prioritizes writing quality, relevance to the theme, creativity, technical execution and meaningful partner usage. It explicitly encourages projects that make spending time outdoors the central experience. [DEV Community](https://dev.to/challenges/hacktoberfest-week1-2026-10-05?utm_source=chatgpt.com)

---

# 1. Executive summary

## 1.1 Product vision

Every neighbourhood has small problems that go unnoticed, get repeatedly reported or remain unresolved without evidence of what happened afterward.

A damaged pavement.

An overflowing public bin.

A broken park bench.

A blocked wheelchair ramp.

A streetlight that stopped working.

Most reporting applications focus on creating complaints.

**FieldIssue focuses on what happens afterward.**

It transforms a physical observation into a persistent issue with evidence, a location, an activity timeline and a process for checking what changed.

### The core experience

A resident goes for a walk.

They discover a problem.

They take a photograph.

FieldIssue creates an issue:

**FI-000142: Damaged pedestrian walkway**

Gemma examines the photograph and produces structured observations.

The resident continues walking.

Later, someone returns to the same location.

They capture another photograph.

FieldIssue compares the observations and reports which visible conditions were added, removed or unchanged.

If the problem has been fixed, a human confirms resolution.

The complete evidence history remains available.

**The product does not end when someone reports a problem. It ends when someone has checked what happened.**

## 1.2 Why this qualifies for Touch Grass

FieldIssue is designed to encourage a recurring physical activity:

**Observe → Walk → Revisit → Verify**

The application should minimize time spent on a screen.

The physical world supplies the evidence, while open-source AI makes that evidence easier to organize and interpret.

A user shouldn't need to type a long report or repeatedly explain the same issue.

One photograph and a short note should be enough to start.

### The core differentiator

Conventional civic reporting:

> Report submitted. Ticket created.

FieldIssue:

> Issue FI-000142 was reported seven days ago. You're walking near it. Would you like to check whether anything has changed?

That distinction defines the entire product.

---

# 2. Product positioning

### Category

**AI-assisted, location-based issue tracking for the physical world.**

### Primary promise

> Turn a walk into meaningful evidence of what is broken, what has changed and what has actually been checked.

### Positioning statement

FieldIssue is an open-source neighbourhood issue-tracking system that allows residents and volunteer walkers to document local problems, revisit locations and compare visual evidence using open-weight AI.

Unlike complaint portals, FieldIssue emphasizes longitudinal evidence, transparent changes and human-confirmed resolution.

### What FieldIssue is not

- A replacement for official municipal complaint services.
- A social media platform for complaints.
- An emergency-response application.
- A system that automatically declares infrastructure safe.
- A platform for publicly accusing individuals.
- An AI chatbot wrapped around a map.
- A leaderboard encouraging people to photograph dangerous situations.

Its fundamental unit is not a post.

**Its fundamental unit is an issue with a history.**

---

# 3. Existing implementation and rework assessment

We should preserve the functioning backend rather than rebuild proven components without reason.

I reviewed the [current repository](https://github.com/himanshu748/fieldissue), its [technical implementation notes](https://github.com/himanshu748/fieldissue/blob/main/docs/zero-cost-stack.md) and its [October 8 verification report](https://github.com/himanshu748/fieldissue/blob/main/docs/verification/product-repair-2026-10-08.md).

## 3.1 What already exists

| Component | Current state | V2 decision |
|---|---|---|
| Hono API | Implemented | Preserve |
| Python intelligence service | Implemented | Preserve |
| Gemma image analysis | Live verified | Preserve and enhance |
| Gemma image comparison | Live verified with identical-image control | Expand testing |
| Mastra workflows | Implemented | Preserve and extend |
| PostgreSQL | Working | Preserve |
| PostGIS | Implemented and tested | Preserve |
| pgvector extension | Installed, semantic search not implemented | Complete search |
| Issue creation | Working | Preserve |
| Issue history | Working | Preserve |
| Manual resolution | Working | Preserve |
| Reopening issues | Working | Preserve |
| Browser workspace | Working | Redesign frontend |
| Render hosting | Deployed | Preserve |
| SerpApi | Live verified | Expand contextual relevance |
| Sentry | Live verified | Add evaluation dashboard |
| Tinker | Actual training/evaluation run | Integrate evaluation evidence |
| Entire | Local agent session checkpoint exists | Prepare shareable evidence |
| ElevenLabs | Adapter implemented | Activate and verify |
| Tiger Data | Provisioned, direct TLS issue | Repair if feasible |
| Backboard | Not implemented | Add a bounded use case |
| TabPFN | Adapter exists, data/runtime missing | Experimental stretch feature |
| DigitalOcean | Portable deployment support only | Remove from active scope |

### Important implementation distinction

The existing Render deployment is real.

The Tinker experiment was also executed, using synthetic notes. Its recorded severity agreement improved from **14/18 to 16/18** on a small held-out sample, but this is not proof of real-world model improvement.

Gemma has been tested against real image input, but an independently verified photograph pair showing a genuine physical repair is still missing.

The V2 specification must not present these different levels of evidence as equivalent.

## 3.2 Rework decision

**Rebuild the frontend experience. Preserve the validated API and data model.**

The most expensive engineering work is already partly complete.

Rebuilding the backend just to use another framework would introduce unnecessary regression risk.

Instead, V2 will focus on:

1. Making the outdoor experience genuinely useful.
2. Improving the report and revisit workflows.
3. Making before-and-after evidence visually compelling.
4. Introducing a useful walking queue.
5. Activating meaningful partner integrations.
6. Improving the product's trust and transparency.
7. Creating a strong public demonstration.
8. Writing an evidence-backed submission.

---

# 4. Sponsor integration strategy

## 4.1 Official challenge requirements

DEV permits a project to enter multiple partner categories when it genuinely uses the corresponding technologies.

Featured categories award **$200**, while standard partner categories award **$100**.

However, **one submission can win only once per challenge**.

Therefore, ten integrations create more potential prize categories, not ten simultaneous cash prizes. [DEV Community](https://dev.to/challenges/hacktoberfest-week1-2026-10-05?utm_source=chatgpt.com)

## 4.2 Final sponsor selection

We will target **10 meaningful integrations**, with TabPFN as an eleventh experimental integration.

| # | Sponsor | Intended product responsibility | Prize category | Priority |
|---|---|---|---|---|
| 1 | **Render** | Host the working FieldIssue application and AI services | $200 | P0 |
| 2 | **Gemma** | Analyze photographic evidence and compare revisits | $200 | P0 |
| 3 | **Mastra** | Orchestrate issue creation and revisits | $100 | P0 |
| 4 | **SerpApi** | Ground observations in nearby real-world places | $100 | P0 |
| 5 | **Sentry** | Trace agent operations, errors and latency | $100 | P0 |
| 6 | **Entire** | Preserve and explain AI-assisted development sessions | $100 | P0 |
| 7 | **Tinker** | Fine-tune and evaluate structured field-note extraction | $200 | P1 |
| 8 | **ElevenLabs** | Produce spoken walking and issue briefings | $100 | P1 |
| 9 | **Backboard** | Compare open-weight interpretations of ambiguous reports | $100 | P1 |
| 10 | **Tiger Data** | Support semantic and hybrid issue search | $100 | P1 |
| 11 | **TabPFN** | Estimate which issues may benefit from revisiting | $200 | P2 |

P0 means the capability must work in the core submission. P1 means an integration should be completed if its dependencies are available without compromising the core product. P2 is experimental and cannot be claimed as implemented until verified.

The sponsor-category descriptions above follow the official challenge page. [DEV Community](https://dev.to/challenges/hacktoberfest-week1-2026-10-05?utm_source=chatgpt.com)

### Technologies deliberately excluded

| Technology | Reason |
|---|---|
| DigitalOcean | No verified FieldIssue deployment; Render already works |
| Temporal | Mastra already owns workflow orchestration |
| MongoDB Atlas | PostgreSQL/PostGIS is the established data layer |
| GitHub Copilot | Not required for the agreed development workflow |
| Arduino | No device available and hardware adds unnecessary scope |

### Backboard's role

Backboard is no longer excluded.

However, **it must not become a second chatbot**.

Its proposed role is an evidence-review laboratory.

For an ambiguous observation, FieldIssue can compare the structured interpretations of two supported open-weight models.

The purpose is to identify disagreement and request human review, not automatically average model outputs into a supposedly correct answer.

### Tiger Data's role

Tiger Data should not replace the existing working Render PostgreSQL database before submission.

Instead, the proposed integration will support a separate semantic issue index with hybrid retrieval.

For example:

> Find previously reported accessibility problems similar to this blocked pavement.

That creates a meaningful reason to use pgvector and hybrid search rather than merely enabling an unused database extension.

**Non-negotiable:** A provider counts as implemented only when its required functionality has been executed and verified. An SDK import, configuration file or unused adapter is insufficient.

---

# 5. Target users and problems

## 5.1 Primary persona: Neighbourhood walker

**Persona:** A resident who regularly walks through their neighbourhood.

**Problem:** They notice damaged infrastructure, litter or inaccessible paths but have no convenient way to record and follow up on those observations.

**Desired outcome:** Record the problem quickly and check whether anything changes during a later walk.

**Product requirement:** The first report should require no more than one photograph, a location and an optional short note.

## 5.2 Secondary persona: Community volunteer

A volunteer who checks parks, walking paths or public spaces.

Their primary needs are:

- Discover existing issues nearby.
- Avoid creating duplicate reports.
- Choose issues worth checking again.
- Capture follow-up evidence.
- Share an issue's history.

## 5.3 Third persona: Community organizer

An organizer coordinating a small group of volunteers.

Their primary needs are:

- Understand which issues remain open.
- Review evidence from different visits.
- Find issues without recent observations.
- Review disagreements about whether something has been fixed.
- Export or share issue histories.

Multiuser permissions and organizational workspaces are outside the hackathon MVP.

---

# 6. Product goals and success metrics

## 6.1 Product objectives

| ID | Objective | Measurement |
|---|---|---|
| G01 | Make outdoor reporting simple | Capture requires minimal input |
| G02 | Make reports persistent | Every issue receives a permanent identifier |
| G03 | Make revisits meaningful | Two observations produce a saved comparison |
| G04 | Preserve evidence | Original observations remain accessible |
| G05 | Maintain human control | AI cannot directly resolve an issue |
| G06 | Encourage real-world activity | Nearby open issues can be selected for revisits |
| G07 | Make AI inspectable | Model identity and evidence are stored |
| G08 | Demonstrate partner technologies | Each claimed integration has actual execution evidence |
| G09 | Keep the demo usable | No required accounts or paid services for the core demo |
| G10 | Deliver a compelling submission | Working demonstration supported by a detailed technical article |

## 6.2 Engineering targets

These are proposed acceptance targets, not measurements already achieved.

| Metric | Target |
|---|---|
| Camera-to-submit interaction | Under 30 seconds, excluding inference |
| Issue-detail page load | Under 2 seconds on a warm service |
| API read latency | p95 under 750 ms, excluding cold starts |
| AI analysis | Target p50 under 10 seconds, with explicit longer-running state |
| Valid stored observations | 100% schema compliant |
| Invalid image rejection | 100% of automated invalid fixtures |
| Automated issue resolution | 0 |
| Successful idempotent replay | 100% of tested cases |
| Mobile usability | 360px width and above |
| Accessibility | WCAG 2.2 AA target |
| Public integration evidence | One reproducible proof per claimed category |
| Critical E2E tests | 100% passing before submission |

## 6.3 Product success signals

After launch, useful metrics would include the proportion of reported issues that receive a second observation, time between observations and successful completion of the reporting flow.

We should **not** treat seeded issues, synthetic model evaluations or automated test runs as evidence of actual community adoption.

---

# 7. Scope and feature prioritization

## 7.1 Priority definitions

| Priority | Meaning |
|---|---|
| **P0** | Mandatory for the hackathon product |
| **P1** | High-value improvements and additional sponsor integrations |
| **P2** | Experimental or post-hackathon capabilities |

## 7.2 P0: Core submission

| Feature | Scope | Status |
|---|---|---|
| Landing page | Explain product and outdoor value | Exists, redesign proposed |
| Responsive workspace | Browse, report and revisit | Exists, redesign proposed |
| Issue creation | Photo, coordinates and optional note | Implemented |
| Gemma analysis | Structured visual evidence | Verified |
| Nearby issues | Geospatial search | Implemented |
| Basic Walk Queue | Select nearby issues to revisit | New |
| Issue details | History and original observations | Implemented |
| Revisit upload | Add new photographic evidence | Implemented |
| Before/after comparison | Visual and structured comparison | Backend exists |
| Human-confirmed resolution | Explicit action and audit event | Implemented |
| Activity timeline | Full chronological issue history | Implemented |
| SerpApi context | Verified nearby landmark information | Implemented |
| Sentry instrumentation | Sanitized traces and errors | Implemented |
| Mastra workflow | Create and revisit orchestration | Implemented |
| Render deployment | Public landing and functional API | Verified |
| Entire evidence | Document agent-assisted development | Partially completed |
| Submission article | Technical and field demonstration | Incomplete |

### P0 exit requirement

A user must be able to complete the following sequence in a deployed browser:

**Discover → Capture → Create → Return → Compare → Confirm → Review history**

No terminal commands should be necessary for the judge to experience this journey.

## 7.3 P1: Sponsor and experience enhancements

| Feature | Sponsor | Outcome |
|---|---|---|
| Audio field briefing | ElevenLabs | Spoken issue information |
| AI interpretation comparison | Backboard | Show model disagreements |
| Semantic issue search | Tiger Data | Find related issues by meaning |
| Note-model evaluation | Tinker | Demonstrate fine-tuning results |
| Duplicate detection | Gemma + PostGIS + optional Tiger | Reduce redundant reporting |
| Before/after image slider | Gemma comparison | Visually compelling evidence |
| Offline capture queue | Product feature | Support outdoor connectivity gaps |
| Shareable issue cards | Product feature | Better public communication |
| Revisit reminders | Product feature | Encourage returning to a location |
| Integration evidence page | All sponsors | Demonstrate real usage |

## 7.4 P2: Advanced roadmap

| Feature | Scope |
|---|---|
| TabPFN revisit prioritization | Data-driven prediction using real historical labels |
| Multiuser authentication | Personal identities and organization membership |
| Assignments | Assign issues to volunteers |
| Verified resolution workflow | Multiple reviewers and evidence requirements |
| Real routing | Walking directions between issues |
| Community workspaces | Shared geographic groups |
| Full offline-first PWA | Durable offline synchronization |
| Municipal integrations | Export reports to compatible civic platforms |
| Automated notifications | Opt-in issue updates |
| Public API | External application integrations |

### Scope freeze

**Do not add a new sponsor integration if it breaks the report-and-revisit workflow.**

The core product takes precedence over prize-category count.

---

# 8. Information architecture

## 8.1 Proposed navigation

```text
FIELDISSUE
│
├── Home
│
├── Explore
│   ├── Map
│   ├── Nearby issues
│   └── Walk Queue
│
├── Report Issue
│   ├── Capture photo
│   ├── Set location
│   ├── Add note
│   └── Review AI analysis
│
├── Issue Detail
│   ├── Current status
│   ├── Evidence gallery
│   ├── Revisit
│   ├── Before/after comparison
│   ├── Timeline
│   └── Resolve / Reopen
│
├── Walk Mode
│   ├── Selected issues
│   ├── Revisit checklist
│   └── Walking summary
│
├── Model Lab
│   ├── Gemma evidence
│   ├── Backboard comparison
│   └── Tinker evaluation
│
└── About
    ├── Methodology
    ├── Privacy
    ├── Open-source information
    └── AI limitations
```

The Model Lab is a technical demonstration area, not part of the ordinary resident workflow.

---

# 9. Detailed screen specifications

## Screen 1: Landing page

**Route:** `/`

**Priority:** P0

### Objective

Communicate the product in five seconds.

### Proposed hero

```text
FIELDISSUE                           EXPLORE ↗

THE WORLD
HAS OPEN ISSUES.

Take a walk.
Find what is broken.
Come back with evidence.


[ REPORT AN ISSUE ↗ ]

[ EXPLORE NEARBY ]


01  OBSERVE
02  REVISIT
03  VERIFY
```

### Design requirements

- Full-height editorial hero.
- Real or clearly labelled illustrative outdoor imagery.
- Large, readable typography.
- Subtle animated location markers.
- Short explanation of the workflow.
- Direct access to the application.
- No forced login.

### Functional requirements

**FR-001:** Report Issue opens the capture workflow.

**FR-002:** Explore Nearby opens the issue explorer.

**FR-003:** Show an accurate description of the available AI capabilities.

**FR-004:** Provide access to methodology and privacy information.

**FR-005:** Respect reduced-motion preferences.

### Animation

The hero may feature a simple geographic line tracing a walking path.

Small markers appear at three locations:

**Observed → Revisited → Verified**

Avoid elaborate 3D environments that delay the actual product.

---

## Screen 2: Explore

**Route:** `/app/explore`

**Priority:** P0

### Objective

Let users discover issues around them.

### Desktop layout

```text
FIELDISSUE                    + REPORT ISSUE

EXPLORE YOUR NEIGHBOURHOOD

[ Search area                         ]

CATEGORY    STATUS    DISTANCE    SEVERITY

┌────────────────────┬────────────────────┐
│                    │                    │
│                    │ FI-000142          │
│                    │ Damaged pavement   │
│                    │                    │
│       MAP          │ OPEN               │
│                    │ 240m away          │
│       •            │                    │
│     •   •          ├────────────────────┤
│                    │                    │
│                    │ FI-000156          │
│                    │ Broken park bench  │
│                    │                    │
└────────────────────┴────────────────────┘

         [ BUILD MY WALK ]
```

### Mobile layout

Map preview at the top.

Issue cards underneath.

Map and list views can be switched.

### Filters

| Filter | Options |
|---|---|
| Status | Open, acknowledged, in progress, resolved |
| Category | Existing category enum |
| Severity | Low, medium, high, critical |
| Distance | 250m, 500m, 1km, 5km |
| Search | Text query |

### Behaviour

**FR-006:** Request location only after user action.

**FR-007:** Support manual location selection.

**FR-008:** Retrieve issues using PostGIS proximity queries.

**FR-009:** Display issue category and status.

**FR-010:** Open permanent issue links.

**FR-011:** Handle empty areas without fabricating reports.

**FR-012:** Use bounded pagination.

### Error state

> No issues have been recorded near this location yet.

Action:

**Report something you noticed**

---

## Screen 3: Report an issue

**Route:** `/app/report`

**Priority:** P0

This is the most important mobile screen.

### UX principle

**One photo. One location. One optional sentence.**

### Layout

```text
FIELDISSUE                        01 / 03

WHAT DID YOU NOTICE?


┌────────────────────────────────┐
│                                │
│                                │
│        TAKE A PHOTO            │
│                                │
│                                │
└────────────────────────────────┘


LOCATION

● Near Cubbon Park
  Bengaluru, Karnataka


ADD A NOTE

"Bench seat is damaged..."


[ ANALYZE OBSERVATION ]
```

### Photo requirements

| Requirement | Specification |
|---|---|
| Accepted formats | JPEG, PNG, WebP |
| Maximum server upload | 10 MiB |
| Browser resize target | Maximum 1600px dimension |
| Metadata | Strip EXIF where practical before upload |
| Capture source | Camera or file picker |
| Upload | Multipart form-data |
| Storage | Existing storage abstraction |
| Failure | Preserve user input and allow retry |

### Location requirements

- Device geolocation with permission.
- Manual coordinates as fallback.
- Explicit location provenance.
- Capture timestamp stored independently.
- No background location tracking.

### Functional requirements

**FR-013:** Capture or select one image.

**FR-014:** Display a preview.

**FR-015:** Let the user remove and replace the image.

**FR-016:** Obtain coordinates or manual location.

**FR-017:** Accept an optional note.

**FR-018:** Submit a unique idempotency key.

**FR-019:** Prevent duplicate requests during processing.

**FR-020:** Explain when the model provider is unavailable.

### Loading experience

```text
READING YOUR OBSERVATION

✓ Photo uploaded
✓ Location recorded
◌ Examining visible conditions
◌ Preparing issue
```

Only show a completed stage after it genuinely completes.

The interface must not simulate provider progress.

---

## Screen 4: AI analysis review

**Route:** `/app/report/review`

**Priority:** P0

### Objective

Give the user a chance to review AI-generated information.

### Example

```text
FIELDISSUE

OBSERVATION ANALYZED


CATEGORY
Infrastructure

SUGGESTED SEVERITY
High


VISIBLE CONDITIONS

✓ Damaged walking surface
✓ Uneven pavement
✓ Possible obstruction


AI MODEL
Gemma


[ EDIT DETAILS ]

[ CREATE ISSUE ]
```

### Critical rules

AI suggestions must remain editable.

The model must not manufacture:

- A responsible organization.
- An official municipal complaint number.
- A repair deadline.
- A verified safety assessment.
- An individual responsible for the damage.

### Requirements

**FR-021:** Display category and severity suggestions.

**FR-022:** Display model provenance.

**FR-023:** Allow correction of editable fields.

**FR-024:** Store human corrections separately from model output.

**FR-025:** Display uncertainty without implying that model confidence is a calibrated probability.

### Backend compatibility

The existing backend currently creates and persists the issue during its create workflow.

For V2, the review screen can use either a server-side draft workflow or a post-creation edit workflow.

**Preferred rework:** Introduce a two-stage draft/commit API so the user can review classification before final creation.

If time is limited, preserve the existing atomic create flow and allow immediate post-creation edits. Do not destabilize the existing transactional implementation solely to add this screen.

---

## Screen 5: Issue detail

**Route:** `/app/issues/:id`

**Priority:** P0

### Objective

Make every issue feel like a persistent, inspectable record.

### Layout

```text
FI-000142

DAMAGED PEDESTRIAN WALKWAY

● OPEN

Last observed 4 days ago


┌────────────────────────────────┐
│                                │
│        ORIGINAL PHOTO          │
│                                │
└────────────────────────────────┘


LOCATION
Near Main Park Entrance

CATEGORY
Infrastructure

SEVERITY
High


ISSUE HISTORY

● Created                 Oct 6
│
● Analyzed by Gemma       Oct 6
│
○ Awaiting revisit


[ ADD REVISIT ]

[ LISTEN TO BRIEFING ]
```

### Required sections

1. Issue title and identifier.
2. Current status.
3. Category and severity.
4. Original photograph.
5. Location context.
6. Observation history.
7. Structured AI evidence.
8. Revisit action.
9. Saved comparisons.
10. Human resolution history.

### Acceptance requirements

**FR-026:** Permanent issue URL must work after page reload.

**FR-027:** All stored observations must remain available.

**FR-028:** Status changes must appear in the timeline.

**FR-029:** Resolution must not delete older evidence.

**FR-030:** Model identity and source provenance must be accessible.

---

## Screen 6: Walk Queue

**Route:** `/app/walk`

**Priority:** P0 for basic queue, P1 for persistent walks.

### Objective

Give users a reason to go outside again.

### Example

```text
YOUR NEXT WALK

3 OPEN ISSUES NEARBY


01  Broken park bench        120m
    Last checked 8 days ago

02  Damaged pavement         340m
    Last checked 5 days ago

03  Overflowing bin          510m
    Last checked 3 days ago


ESTIMATED AREA
Within 600m of your location


[ START WALK ]
```

### MVP logic

The system retrieves nearby unresolved issues and orders them by distance and last observation time.

It does not need a machine-learning model.

The basic version must not claim it has calculated a street-network route.

### Requirements

**FR-031:** Select up to five issues.

**FR-032:** Save a local queue for the current session.

**FR-033:** Open individual issue details.

**FR-034:** Mark an item visited after an actual observation is submitted.

**FR-035:** Allow users to skip an issue.

**FR-036:** Never pressure users to approach dangerous locations.

### P1 enhancements

- Persistent walk sessions.
- Approximate walk duration.
- Accessible-route preferences.
- Offline observation drafts.
- Spoken issue descriptions.

---

## Screen 7: Revisit

**Route:** `/app/issues/:id/revisit`

**Priority:** P0

### Objective

Document what happened at the same location after the original observation.

### Interface

```text
REVISIT FI-000142


PREVIOUS OBSERVATION

[ Original photograph ]


TAKE A NEW PHOTO

[ OPEN CAMERA ]


What changed?

[ Optional note ]


[ COMPARE OBSERVATIONS ]
```

### Requirements

**FR-037:** New observations reference an existing issue.

**FR-038:** Capture timestamp and location are preserved.

**FR-039:** Location may be inherited when device geolocation is unavailable.

**FR-040:** Images are stored as independent observations.

**FR-041:** Model comparison must not overwrite either observation.

**FR-042:** Users can report that nothing changed.

### Important

An image from a different angle can produce misleading differences.

The UI should encourage users to photograph approximately the same object from a comparable viewpoint, without requiring a perfect match.

---

## Screen 8: Before/after comparison

**Route:** `/app/issues/:id/compare`

**Priority:** P0

This is the most important visual feature.

### Interface

```text
WHAT CHANGED?


OCTOBER 6                 OCTOBER 8

┌────────────────────────────────────┐
│                  │                 │
│                  │                 │
│     BEFORE       │      AFTER      │
│                  │                 │
│                  │                 │
└────────────────────────────────────┘
                  ◉
             DRAG TO COMPARE


REMOVED CONDITIONS

✓ Broken wooden slat


UNCHANGED CONDITIONS

• Bench frame remains damaged


ADDED CONDITIONS

• No new condition identified


AI RECOMMENDATION

Further review needed.


[ KEEP OPEN ]

[ REVIEW RESOLUTION ]
```

### Interaction requirements

**FR-043:** Support a draggable before/after slider.

**FR-044:** Provide a side-by-side alternative.

**FR-045:** Clearly distinguish removed, added and unchanged conditions.

**FR-046:** Display the comparison model and version.

**FR-047:** Allow comparison of any valid chronological observation pair belonging to the same issue.

**FR-048:** Show an explicit no-change result when appropriate.

**FR-049:** Never automatically resolve an issue based on model output.

### Animation

The image divider moves smoothly.

Condition labels appear with restrained transitions.

Use animation to emphasize what changed, not to imply that an actual repair happened.

---

## Screen 9: Human resolution

**Route:** `/app/issues/:id/resolve`

**Priority:** P0

### Objective

Record an explicit human decision.

### Interface

```text
RESOLVE ISSUE?


FI-000142
Damaged pedestrian walkway


LATEST OBSERVATION

[ Photo ]


Resolution basis

◉ Verified from latest observation
○ Manually recorded without new evidence


RESOLUTION NOTE

"The damaged section appears repaired."


[ CONFIRM RESOLUTION ]
```

### Requirements

**FR-050:** Explicit confirmation is mandatory.

**FR-051:** Record the resolution timestamp.

**FR-052:** Preserve the resolution note.

**FR-053:** Record which observation supports the decision, when available.

**FR-054:** Make the resolution basis visible.

**FR-055:** Support reopening without deleting historical evidence.

**FR-056:** AI recommendation alone cannot change the status.

The current shared-access demo does not authenticate individual reporters. Until real identity management exists, the UI must describe this as **human-confirmed**, not identity-verified.

---

## Screen 10: Model Lab

**Route:** `/app/lab`

**Priority:** P1

### Objective

Provide an inspectable technical demonstration of the project's open-model integrations.

The Model Lab is intended for developers and judges rather than ordinary residents.

### Sections

**Gemma Evidence**

Display a real analysis with its input, schema, model identifier and latency.

**Backboard Comparison**

Compare two model interpretations of the same authorized text observation.

**Tinker Evaluation**

Display the base-versus-fine-tuned experiment, dataset limitations and actual metrics.

**System Traces**

Show a sanitized explanation of the pipeline and link to appropriate Sentry evidence.

### Restriction

The lab must not manufacture model outputs when a service is unavailable.

Archived evaluation records can be displayed, but must be labelled as recorded experiments.

---

# 10. Design system

## 10.1 Overall direction

The visual design should resemble a thoughtfully designed field journal mixed with a modern issue tracker.

**Not another AI dashboard.**

### Design keywords

Editorial, geographic, tactile, precise, calm, contemporary.

### Colour palette

| Token | Hex |
|---|---|
| Paper background | `#F4F1E8` |
| Deep ink | `#17211E` |
| Asphalt | `#303936` |
| Grass green | `#567D5B` |
| Observation orange | `#F07847` |
| Water blue | `#82B8C4` |
| Surface white | `#FFFFFF` |
| Border | `#D9DDD5` |

Use orange for important observations, not for decorative accents everywhere.

### Typography

| Role | Font |
|---|---|
| Headlines | Space Grotesk |
| Body | Inter |
| Issue identifiers | IBM Plex Mono |
| Optional Hindi | Noto Sans Devanagari |

### Components

Implement reusable:

- IssueCard
- IssueStatus
- SeverityIndicator
- ObservationImage
- ImageComparisonSlider
- ObservationTimeline
- NearbyMap
- CaptureButton
- ModelProvenance
- AudioBriefing
- EmptyState
- ProviderUnavailable
- IssueFilter
- WalkQueueItem

### Animation specification

| Animation | Purpose |
|---|---|
| Marker arrival | New observation added |
| Timeline expansion | Show event history |
| Before/after slider | Inspect evidence |
| Issue status transition | Confirm human action |
| Card expansion | Reveal details |
| Route-line drawing | Explain a selected walking queue |

All animations must support reduced-motion settings.

### Mobile requirements

- Minimum 44px touch targets.
- Camera access through a large primary control.
- No hover-dependent functionality.
- No horizontal scrolling.
- Readable issue identifiers.
- Accessible upload progress.
- Clear retry behaviour.
- Usable at 360px width.

---

# 11. Core business logic

## 11.1 Issue lifecycle

```text
                   CREATE
                      │
                      ▼
                    OPEN
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
       ACKNOWLEDGED         IN_PROGRESS
            │                   │
            └─────────┬─────────┘
                      │
                      ▼
               HUMAN REVIEW
                      │
             ┌────────┴────────┐
             ▼                 ▼
          RESOLVED           REJECTED
             │
             ▼
          REOPENED
             │
             ▼
            OPEN
```

Reopening should be represented by a transition back to `OPEN`, with a recorded event.

The database should preserve all prior statuses.

## 11.2 Observation model

Each observation must contain:

- Unique observation ID
- Parent issue ID
- Photograph storage reference
- Capture timestamp
- Submission timestamp
- Location
- Location source
- Reporter metadata, if available
- Optional note
- AI analysis
- Model provenance
- Creation timestamp

Observations are append-only evidence records.

Correcting an issue's title or severity must not silently alter the original model analysis.

## 11.3 Comparison model

Each comparison references exactly two existing observations.

The observations must belong to the same issue.

The comparison produces:

- Summary
- Removed conditions
- Added conditions
- Unchanged conditions
- Recommended status
- Model confidence
- Model identifier
- Model version
- Timestamp

The comparison is recorded as an event.

## 11.4 Duplicate handling

**Priority:** P1

Potential duplicate candidates should be ranked using:

1. Geospatial proximity.
2. Compatible issue category.
3. Text similarity.
4. Optional vector similarity.

### Important rule

Never automatically merge two issue histories.

Display:

> This may already have been reported.

Then allow the user to open the existing issue or continue creating a new one.

---

# 12. AI engineering specification

## 12.1 Gemma

**Responsibility:** Interpret visual field evidence.

Gemma is the primary open-weight intelligence component.

### Input

```json
{
  "image_base64": "<image bytes>",
  "mime_type": "image/jpeg",
  "note": "The pedestrian path is damaged."
}
```

### Required output

The existing shared contract must remain authoritative:

```json
{
  "objects": ["pedestrian_path"],
  "conditions": ["damaged surface"],
  "suggestedCategory": "INFRASTRUCTURE",
  "suggestedSeverity": "MEDIUM",
  "evidence": ["An uneven section is visible in the walkway"],
  "confidence": 0.81,
  "model": "<configured-gemma-model>",
  "modelVersion": "<provider-reported-version>"
}
```

This is a schema example, not a claim about a real image.

### Requirements

**AI-001:** Strictly validate response schema.

**AI-002:** Reject unrecognized categories.

**AI-003:** Reject invalid severity values.

**AI-004:** Store model provenance.

**AI-005:** Never silently switch to mock inference.

**AI-006:** Treat text embedded in photographs as untrusted input.

**AI-007:** Avoid inferring invisible conditions.

**AI-008:** Never identify private individuals from photos.

**AI-009:** Never make autonomous resolution decisions.

### Prompt contract

The model should be instructed to:

> Analyze only the provided photographic evidence and optional user note. Identify visible objects and conditions. Separate uncertain interpretations from directly supported observations. Return only the required structured schema. Do not invent responsible parties, causes or repair outcomes.

The actual prompt must be versioned in the repository.

---

## 12.2 Gemma comparison

### Input

Two observations of the same issue.

### Output

```json
{
  "summary": "The main obstruction remains visible.",
  "removed": [],
  "added": [],
  "unchanged": ["The path remains obstructed"],
  "recommendedStatus": "OPEN",
  "confidence": 0.77,
  "model": "<configured-gemma-model>",
  "modelVersion": "<provider-reported-version>"
}
```

### Required behaviour

- Compare only observable conditions.
- Preserve the original images.
- Never treat image-angle differences as automatically confirmed physical changes.
- Accept an unchanged result.
- Reject malformed output.
- Require human confirmation for resolution.

---

## 12.3 Mastra

**Responsibility:** Typed workflow orchestration.

The current repository already implements create-issue and revisit workflows.

### Creation workflow

```text
Receive observation
        ↓
Validate input
        ↓
Analyze with Gemma
        ↓
Normalize classification
        ↓
Find nearby issues
        ↓
Persist issue + observation
        ↓
Generate optional revisit metadata
        ↓
Return issue
```

### Revisit workflow

```text
Load existing issue
        ↓
Validate new observation
        ↓
Analyze new evidence
        ↓
Compare with previous observation
        ↓
Persist comparison
        ↓
Update optional revisit metadata
        ↓
Return structured diff
```

### Requirements

- Strongly typed workflow inputs and outputs.
- No arbitrary image bytes inside persisted workflow state.
- Database transactions for related writes.
- Request correlation IDs.
- Explicit failure states.
- No duplicate persisted observations after idempotent retries.
- Optional integrations must not corrupt successfully saved evidence.

---

# 13. Additional AI and sponsor integration specifications

## 13.1 Tinker: Field-note normalization

**Priority:** P1
**Existing state:** Training and evaluation completed.

### Objective

Convert informal descriptions, including Hinglish and misspelled notes, into a consistent structured representation.

Example input:

```text
bhai park gate ke paas wala dustbin full hai
aur kachra bahar pada hai
```

Expected target schema:

```json
{
  "category": "CLEANLINESS",
  "object": "waste_bin",
  "condition": "overflowing",
  "severity": "MEDIUM",
  "evidence": ["waste visible outside the bin"]
}
```

### Existing experiment

| Metric | Base Qwen3-8B | Tinker fine-tuned |
|---|---:|---:|
| Valid structured output | 18/18 | 18/18 |
| Correct category | 17/18 | 17/18 |
| Correct severity | 14/18 | 16/18 |

This was measured on 18 held-out synthetic examples.

The evidence-string comparison also showed substantial disagreement with the exact annotated descriptions. Those limitations must remain visible in the final write-up.

### V2 requirements

**TINK-001:** Preserve real training manifests.

**TINK-002:** Display dataset provenance.

**TINK-003:** Show baseline and fine-tuned results.

**TINK-004:** Do not present the tiny synthetic evaluation as real-world accuracy.

**TINK-005:** Do not pretend an expired checkpoint is actively serving production requests.

### Acceptance

The Model Lab displays the recorded evaluation, links to the reproducible scripts and clearly states its limitations.

If a checkpoint becomes available for an actual inference demonstration, the model can be used in an opt-in note-normalization experiment.

---

## 13.2 Backboard: Open-model disagreement

**Priority:** P1

### Objective

Compare alternative interpretations when a field observation is ambiguous.

### Proposed workflow

```text
New observation
        ↓
Gemma structured analysis
        ↓
Extract safe text summary
        ↓
Backboard model A
        ↓
Backboard model B
        ↓
Compare structured results
        ↓
Show disagreement
        ↓
Human review
```

For the first implementation, use text-based interpretation comparison. Do not assume that every model exposed through Backboard accepts images.

### Example

**Original note:**

> The drain cover is broken and part of the opening is exposed.

Model A:

`INFRASTRUCTURE / HIGH`

Model B:

`SAFETY / CRITICAL`

FieldIssue displays:

**Models disagree on severity. Human review recommended.**

### Requirements

**BACK-001:** Use an actual Backboard API request.

**BACK-002:** Use two verified supported open-weight models.

**BACK-003:** Normalize their outputs to a shared schema.

**BACK-004:** Record model identity and execution time.

**BACK-005:** Display disagreement rather than hiding it.

**BACK-006:** Do not allow model consensus to automatically resolve an issue.

**BACK-007:** Run only on authorized data.

### Acceptance

The lab must show an actual recorded comparison with request provenance and results.

A static mock comparison does not qualify as a completed integration.

---

## 13.3 ElevenLabs: Audio field briefing

**Priority:** P1

### Objective

Reduce screen interaction while walking.

### User experience

A walker selects an issue.

They tap:

**Listen to briefing**

FieldIssue reads a short summary:

> "FieldIssue 142. Damaged pedestrian walkway. Status open. Last observation four days ago. Check whether the obstruction remains."

### Requirements

**VOICE-001:** Generate spoken summaries from stored issue data.

**VOICE-002:** Do not send unnecessary personal information.

**VOICE-003:** Cache generated audio using issue version, language, model and voice.

**VOICE-004:** Regenerate audio when relevant issue details change.

**VOICE-005:** Provide clear playback controls.

**VOICE-006:** Show an unavailable state when credentials or quota are missing.

**VOICE-007:** Never block issue reporting when TTS fails.

### Acceptance

A real ElevenLabs-generated audio file plays from the deployed application.

---

## 13.4 SerpApi: Real-world place grounding

**Priority:** P0

### Objective

Make field reports easier to locate using recognizable landmarks.

### Example

Coordinates suggest a location near a known public landmark.

SerpApi retrieves nearby place information.

FieldIssue displays:

> Near Cubbon Park, Bengaluru.

### Rules

- Landmark results must be geographically verified.
- Never infer a precise address from a broad match.
- Save source provenance.
- Cache repeated queries.
- Respect provider quotas.
- Continue issue creation if place lookup fails.

The current implementation already restricts candidate landmarks to a 2 km radius.

### Acceptance

A live query returns a valid nearby place and stores the result with its source.

---

## 13.5 Tiger Data: Semantic issue retrieval

**Priority:** P1

### Objective

Find related reports based on meaning, not only matching keywords.

### Example

User searches:

> Paths that are difficult for wheelchair users.

The search can return:

- Blocked dropped-kerb approach.
- Inaccessible pavement.
- Obstructed accessible entrance.

Even when the exact phrase "wheelchair users" does not appear.

### Proposed architecture

```text
Issue data in Render PostgreSQL
                │
                ▼
       Sanitized index record
                │
                ▼
      Open embedding model
                │
                ▼
          Tiger Data
        PostgreSQL + pgvector
                │
                ▼
        Hybrid issue search
```

### Search design

Use an open embedding model with a documented output dimension.

For a lightweight first implementation, a 384-dimensional sentence embedding model is reasonable.

Combine:

- Keyword relevance.
- Vector similarity.
- Category filtering.
- Issue status.
- Geospatial constraints.

### Requirements

**TIGER-001:** Establish a certificate-verified connection.

**TIGER-002:** Never disable TLS verification to hide certificate errors.

**TIGER-003:** Enable the necessary database extensions.

**TIGER-004:** Store real embeddings generated from issue descriptions.

**TIGER-005:** Implement an actual vector query.

**TIGER-006:** Demonstrate semantic or hybrid retrieval.

**TIGER-007:** Keep Render PostgreSQL as the authoritative transaction database.

**TIGER-008:** Do not block issue creation when secondary indexing fails.

### Acceptance

An actual query against Tiger Data retrieves related issues.

Merely provisioning the database is insufficient.

---

## 13.6 Sentry: AI execution tracing

**Priority:** P0

### Objective

Make the agent's operation inspectable and debuggable.

### Trace example

```text
FieldIssue.createIssue

├── validate-upload             12ms
├── analyze-with-gemma        4392ms
├── lookup-place-context       580ms
├── database-transaction        41ms
└── return-result                7ms
```

These values are illustrative.

### Required trace information

- Operation name.
- Start and end timestamps.
- Duration.
- Success or failure.
- Safe error code.
- Request correlation ID.
- Provider category.

### Prohibited telemetry

- Raw images.
- Exact coordinates.
- Personal names.
- Raw user notes.
- Provider credentials.
- Private model outputs.
- Request bodies containing evidence.

### Acceptance

The deployed system produces a sanitized Sentry trace for a real operation.

The DEV article includes an actual screenshot or trace explanation.

---

## 13.7 Entire: Development provenance

**Priority:** P0

### Objective

Show how AI-assisted development contributed to the project.

### Required evidence

- Actual captured development session.
- Associated project/commit.
- Summary of decisions.
- Problems encountered.
- Fixes made.
- Verification performed.

### Acceptance

The submission links to safely shareable session evidence.

The captured material must be reviewed for credentials and private information before publication.

A local checkpoint can be documented, but it must not be represented as a publicly accessible session unless it has actually been made accessible.

---

## 13.8 TabPFN: Revisit prioritization

**Priority:** P2

### Objective

Estimate which unresolved issues are more likely to have materially changed since their previous observation.

### Existing features

The current adapter defines eight inputs:

1. Days since last observation.
2. Previous observation count.
3. Issue age.
4. Severity.
5. Category.
6. Number of nearby issues.
7. Previous change count.
8. Current status.

### Predicted target

`material_change_since_last_visit`

### Output

```json
{
  "probabilityChanged": 0.72,
  "priorityScore": 0.58,
  "modelVersion": "<verified-version>"
}
```

The example is a schema illustration only.

### Critical dependency

The project does not yet have a genuine labelled revisit-history dataset suitable for validating this predictor.

Therefore:

**Do not activate TabPFN predictions in the normal user experience until the real data, model runtime and evaluation are available.**

### V2 architecture improvement

Optional TabPFN failure must not make the entire product appear unavailable.

Separate service health into:

- Core API readiness.
- Gemma readiness.
- TabPFN capability availability.
- Optional provider status.

The core product should remain usable when the experimental predictor is disabled.

---

# 14. Revised system architecture

## 14.1 Architecture

```text
                    MOBILE / DESKTOP
                           │
                           ▼
                    React / Vite UI
                           │
                           ▼
                       Render
                           │
                           ▼
                    Hono API Server
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
           Mastra      PostgreSQL       SerpApi
         Workflows      + PostGIS      Place context
             │          + pgvector
             │             │
             ▼             ▼
       Python FastAPI   Media storage
       Intelligence
             │
       ┌─────┼───────────┐
       │     │           │
       ▼     ▼           ▼
     Gemma  TabPFN    Model metadata
       │
       ▼
  Structured evidence

OPTIONAL EXTENSIONS

Backboard → Model comparison
Tinker    → Fine-tuning evaluation
ElevenLabs→ Audio briefings
Tiger Data→ Semantic retrieval
Sentry    → Observability
Entire    → Development provenance
```

## 14.2 Technology stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Animation | Motion for React |
| Maps | Leaflet + OpenStreetMap |
| Backend | Node.js 22 + Hono |
| Validation | Zod |
| Agent workflows | Mastra |
| Intelligence API | Python + FastAPI |
| Model validation | Pydantic |
| Vision | Gemma |
| Primary database | PostgreSQL |
| Spatial queries | PostGIS |
| Vector search | pgvector |
| Secondary search | Tiger Data, if verified |
| Hosting | Render |
| Monitoring | Sentry |
| Testing | Vitest, Pytest, Playwright |
| Containerization | Docker |

### Frontend rework decision

Create `apps/web` using React and Vite.

Build static assets and serve them through the existing Render application or an appropriately configured Render frontend service.

Retain the Hono API and existing contracts.

**Do not migrate the backend to Next.js, Supabase or another framework solely for visual redesign.**

That preserves the work already completed.

---

# 15. Data model specification

## 15.1 Existing core entities

Preserve:

- `issues`
- `observations`
- `diffs`
- `events`
- Existing idempotency records
- Existing media storage records
- Existing audio summary records

Preserve stable public identifiers such as `FI-000142`.

## 15.2 Proposed additional entities

### `walk_sessions`

| Field | Type |
|---|---|
| id | UUID |
| created_at | TIMESTAMPTZ |
| started_at | TIMESTAMPTZ, nullable |
| completed_at | TIMESTAMPTZ, nullable |
| status | TEXT |
| selected_issue_ids | UUID[] |
| approximate_origin | GEOGRAPHY, nullable |
| completed_issue_ids | UUID[] |

P1 feature. A P0 session-only queue need not create this table.

### `model_comparisons`

| Field | Type |
|---|---|
| id | UUID |
| observation_id | UUID |
| provider | TEXT |
| model_a | TEXT |
| model_b | TEXT |
| result_a | JSONB |
| result_b | JSONB |
| disagreement | JSONB |
| created_at | TIMESTAMPTZ |

### `semantic_index_jobs`

| Field | Type |
|---|---|
| id | UUID |
| issue_id | UUID |
| source_version | INTEGER |
| status | TEXT |
| attempts | INTEGER |
| last_error_code | TEXT |
| created_at | TIMESTAMPTZ |

### `integration_runs`

| Field | Type |
|---|---|
| id | UUID |
| provider | TEXT |
| operation | TEXT |
| status | TEXT |
| duration_ms | INTEGER |
| evidence_ref | TEXT |
| created_at | TIMESTAMPTZ |

Do not store provider credentials or raw sensitive input in this table.

## 15.3 Database migration requirements

**DB-001:** Preserve existing issue IDs.

**DB-002:** Preserve existing observations.

**DB-003:** Use additive migrations wherever possible.

**DB-004:** Backfill new optional fields safely.

**DB-005:** Avoid destructive migrations during the hackathon.

**DB-006:** Test migrations against a disposable database.

**DB-007:** Preserve current PostGIS functionality.

**DB-008:** Make optional indexing failures recoverable.

---

# 16. API specification

## 16.1 Existing endpoints to preserve

| Method | Endpoint | Function |
|---|---|---|
| `GET` | `/health` | Process health |
| `GET` | `/ready` | Readiness |
| `POST` | `/v1/issues` | Create issue |
| `GET` | `/v1/issues` | Search and list |
| `GET` | `/v1/issues/map` | GeoJSON map data |
| `GET` | `/v1/issues/:id` | Issue detail |
| `PATCH` | `/v1/issues/:id` | Update issue |
| `POST` | `/v1/issues/:id/observations` | Add revisit |
| `GET` | `/v1/issues/:id/observations` | Evidence history |
| `POST` | `/v1/issues/:id/diff` | Compare observations |
| `GET` | `/v1/issues/:id/diffs` | Saved comparisons |
| `GET` | `/v1/issues/:id/timeline` | Event history |
| `POST` | `/v1/issues/:id/resolve` | Human resolution |
| `POST` | `/v1/issues/:id/revisit-prediction` | Optional prediction |
| `POST` | `/v1/issues/:id/audio-summary` | Audio briefing |

## 16.2 Proposed new endpoints

| Method | Endpoint | Priority |
|---|---|---|
| `GET` | `/v1/walks/suggestions` | P0 |
| `GET` | `/v1/issues/:id/duplicates` | P1 |
| `POST` | `/v1/model-lab/compare` | P1 |
| `GET` | `/v1/model-lab/evaluations` | P1 |
| `GET` | `/v1/search/semantic` | P1 |
| `GET` | `/v1/integrations/status` | P1 |
| `POST` | `/v1/walks` | P1 |
| `PATCH` | `/v1/walks/:id` | P1 |

### Example: Walk suggestions

```http
GET /v1/walks/suggestions
    ?latitude=12.9762
    &longitude=77.5929
    &radius_meters=1000
    &limit=5
```

Response:

```json
{
  "items": [
    {
      "issueId": "FI-000142",
      "title": "Damaged pedestrian walkway",
      "distanceMeters": 240,
      "status": "OPEN",
      "lastObservedAt": "2026-10-06T10:00:00Z"
    }
  ],
  "sortingMethod": "distance_then_age",
  "routeCalculated": false
}
```

### Example: Model comparison

```http
POST /v1/model-lab/compare
Content-Type: application/json
```

```json
{
  "observationId": "550e8400-e29b-41d4-a716-446655440000",
  "models": ["configured-model-a", "configured-model-b"],
  "consentToExternalProcessing": true
}
```

The server must validate model identifiers against an allowlist.

It must not permit arbitrary provider selection or unrestricted expensive inference from public anonymous requests.

## 16.3 Error contract

```json
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "The analysis service is temporarily unavailable.",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

Required behaviour:

- Stable error codes.
- Request correlation.
- No leaked credentials.
- No raw image or note echoed in errors.
- Retryable failures distinguished from invalid inputs.
- Idempotent operations protected against duplicate commits.

---

# 17. Security, privacy and safety

## 17.1 Major product risks

FieldIssue handles real-world photographs and potentially precise locations.

These can unintentionally reveal:

- Faces.
- Vehicle registration numbers.
- Homes.
- Private property.
- Sensitive locations.
- Individuals' daily routines.

### Requirements

**SEC-001:** Strip EXIF metadata where practical.

**SEC-002:** Obtain consent before sending images to external inference providers.

**SEC-003:** Do not expose access credentials in frontend bundles.

**SEC-004:** Protect write operations with authorization and rate limits.

**SEC-005:** Separate public and private location representations.

**SEC-006:** Do not automatically publish exact GPS coordinates of private or sensitive locations.

**SEC-007:** Avoid face recognition or person identification.

**SEC-008:** Provide issue removal and data-retention controls before a public production launch.

**SEC-009:** Keep the intelligence service private.

**SEC-010:** Keep model input and output out of telemetry by default.

## 17.2 Public demo access

The current hosted demonstration uses a shared access token.

That is acceptable for a controlled hackathon demo, but it is not individual user authentication.

For V2, use one of two safe access patterns:

**Option A: Public read-only demo**

Allow visitors to explore clearly labelled fictional issues, while write operations remain protected.

**Option B: Restricted interactive demo**

Provide authenticated demo access through an approved private channel, with strict quotas and an isolated dataset.

Do not publish a write-capable shared token in the README.

## 17.3 Safety-sensitive reporting

FieldIssue must not encourage users to enter unsafe areas to photograph an issue.

For dangerous situations, such as exposed electrical wires or open manholes, the product should encourage maintaining distance and contacting appropriate local emergency or municipal services.

Model-generated severity is advisory.

It is not a substitute for qualified inspection.

---

# 18. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-001 | Main pages work on Android Chrome and Safari |
| NFR-002 | All core screens function at 360px width |
| NFR-003 | Images are validated server-side |
| NFR-004 | API limits upload size |
| NFR-005 | Core writes are transactional |
| NFR-006 | Repeated idempotency keys do not duplicate records |
| NFR-007 | Production does not silently use mock inference |
| NFR-008 | Provider timeouts return explicit errors |
| NFR-009 | Optional provider failure does not delete existing evidence |
| NFR-010 | No raw sensitive evidence is stored in Sentry |
| NFR-011 | All links to issue details survive reload |
| NFR-012 | All displayed evidence has provenance |
| NFR-013 | User input survives recoverable frontend errors |
| NFR-014 | Core application works without TabPFN |
| NFR-015 | UI supports keyboard navigation |
| NFR-016 | UI respects reduced-motion preferences |
| NFR-017 | Map attribution remains visible |
| NFR-018 | Provider spending is bounded by configured quotas |

---

# 19. Testing and acceptance criteria

## 19.1 Unit tests

| Test | Expected result |
|---|---|
| Invalid category | Rejected |
| Invalid severity | Rejected |
| Invalid coordinates | Rejected |
| Invalid image signature | Rejected |
| Oversized image | Rejected |
| Model schema mismatch | Rejected |
| Missing observation | Explicit error |
| Cross-issue comparison | Rejected |
| Identical-photo comparison | No fabricated change |
| Duplicate idempotency key | Existing result returned |
| AI resolution recommendation | Does not change issue status |
| Manual resolution | Recorded event |
| Reopen issue | Preserves old evidence |
| Missing ElevenLabs credentials | Explicit unavailable state |
| Missing TabPFN model | Core application remains usable |
| Failed Tiger index write | Primary issue record remains intact |

## 19.2 Integration tests

**INT-001:** Hono API communicates with the intelligence service.

**INT-002:** Gemma output passes strict validation.

**INT-003:** Mastra creates an issue through the real persistence layer.

**INT-004:** PostGIS returns nearby issues.

**INT-005:** Revisit produces a stored comparison.

**INT-006:** Resolution produces audit events.

**INT-007:** SerpApi returns grounded place context.

**INT-008:** Sentry receives sanitized event data.

**INT-009:** ElevenLabs generates and stores playable audio when configured.

**INT-010:** Tiger Data returns actual semantic matches when configured.

**INT-011:** Backboard returns two verifiable model interpretations.

**INT-012:** Provider failure does not trigger a hidden mock fallback.

## 19.3 End-to-end tests

### E2E-001: Report an issue

1. Open the landing page.
2. Enter the workspace.
3. Capture or select a photo.
4. Set location.
5. Submit.
6. Verify saved issue.
7. Reload.
8. Verify persistent evidence.

### E2E-002: Revisit

1. Open existing issue.
2. Add a second observation.
3. Generate comparison.
4. Verify removed, added and unchanged conditions.
5. Reload.
6. Verify comparison persists.

### E2E-003: Resolution

1. Open issue.
2. Review evidence.
3. Confirm resolution.
4. Verify status.
5. Reopen.
6. Verify all historical events remain available.

### E2E-004: Mobile

Execute the primary user flow at 390px width.

### E2E-005: Live provider

Perform an authorized live Gemma test and verify that the stored provenance identifies the actual provider response.

---

# 20. Implementation plan

The challenge closes on **October 11 at 11:59 PM PDT**, which is **October 12 at 12:29 PM IST**. The final public article and links must be submitted before that deadline. ([DEV challenge rules](https://dev.to/challenges/hacktoberfest-week1-2026-10-05))

Because the project already exists, the work should be divided by risk rather than rewritten from scratch.

## Phase 1: Product stabilization

**Target: October 8**

### Deliverables

- Freeze current API contracts.
- Preserve the working Render deployment.
- Tag a known-good repository commit.
- Confirm database backups and migration state.
- Separate core readiness from optional TabPFN availability.
- Test current report/revisit/resolve flow.
- Document all provider capabilities.

**Exit condition:** Existing functionality remains operational.

## Phase 2: Frontend redesign

**Target: October 9**

### Deliverables

- Create React/Vite frontend.
- Implement design tokens.
- Build the new landing page.
- Build Explore.
- Build Report Issue.
- Build Issue Detail.
- Build Revisit.
- Implement the before/after comparison.
- Implement responsive behaviour.
- Add basic Walk Queue.

**Exit condition:** The entire core journey works without using API documentation or terminal commands.

## Phase 3: Sponsor integrations

**Target: October 10**

### Deliverables

- Activate ElevenLabs.
- Implement Backboard comparison.
- Repair Tiger Data connection if possible.
- Implement actual semantic search if Tiger is available.
- Surface the existing Tinker evaluation.
- Verify Sentry traces.
- Prepare Entire development evidence.
- Verify all claimed integrations individually.

**Exit condition:** Every integration listed as complete has a real execution record.

## Phase 4: Field demonstration and submission

**Target: October 11**

### Deliverables

- Capture a real outdoor observation.
- Revisit the same issue.
- Record real comparison output.
- Capture the full application demonstration.
- Complete README.
- Complete partner evidence documentation.
- Publish DEV article.
- Verify deployed links.
- Complete submission.

**Exit condition:** Judges can understand the product, inspect the evidence and reproduce the core workflow.

---

# 21. Three-minute demonstration

A three-minute video is a deliberate presentation target, not a separate length limit imposed by this DEV challenge.

DEV accepts a deployed link or video demonstration and gives substantial weight to the written submission. ([DEV submission template](https://dev.to/challenges/hacktoberfest-week1-2026-10-05))

## 0:00–0:20: The opening

Start outside.

Show a real pavement, public bin, bench or similarly ordinary object.

Voiceover:

> "Software issues have GitHub. But what about the issues we walk past every day?"

Show FieldIssue on a phone.

## 0:20–0:50: Create an issue

Take a photograph.

Attach location.

Submit it.

Gemma returns the observation analysis.

Show the resulting `FI-...` identifier.

## 0:50–1:15: Return to the location

Show a later observation of the same object.

The user opens the existing issue and adds another photograph.

If no real repair occurred, demonstrate a truthful unchanged result.

## 1:15–1:45: The visual payoff

Open the comparison screen.

Drag the before/after slider.

Reveal:

**Removed conditions**

**Added conditions**

**Unchanged conditions**

Show the stored AI recommendation.

Then explain that the recommendation doesn't automatically close the issue.

## 1:45–2:05: Human decision

Show the manual review or resolution action.

Display the updated timeline.

The issue's history remains visible.

## 2:05–2:35: Sponsor technology

Quickly show the real integration chain:

- Gemma evidence analysis.
- Mastra workflow.
- Render deployment.
- Sentry trace.
- SerpApi context.

Show other completed integrations as brief supporting evidence, without implying that unconfigured integrations are working.

## 2:35–2:55: Final message

Return to the outdoor footage.

Show the neighbourhood issue list.

Close with:

> **"The world has open issues. FieldIssue gives us a reason to walk back and see what changed."**

---

# 22. DEV submission requirements

The official template includes the following main sections:

| Section | Required content |
|---|---|
| What I Built | The problem, target users and core solution |
| Demo | Working URL or recorded demonstration |
| Code | Public GitHub repository |
| How I Built It | Architecture and open-source AI |
| Why Does Open Innovation Matter? | Why open models and frameworks are central |
| My Agent Session | Optional development evidence |
| Prize Categories | Every genuinely qualifying category |

The required tags are:

`devchallenge` and `hf26challenge`.

The submission must be written in English to be eligible for judged prizes. ([DEV challenge](https://dev.to/challenges/hacktoberfest-week1-2026-10-05))

## 22.1 Sponsor evidence matrix

The final article should include a compact proof table.

| Sponsor | Minimum evidence |
|---|---|
| Render | Deployed working application |
| Gemma | Live analysis/comparison and model provenance |
| Mastra | Workflow code plus actual execution |
| SerpApi | Verified nearby-place result |
| Sentry | Sanitized execution trace |
| Entire | Safe, shareable development evidence |
| Tinker | Training manifest and baseline comparison |
| ElevenLabs | Actual generated and played audio |
| Backboard | Actual comparison request and outputs |
| Tiger Data | Actual indexed data and retrieval query |
| TabPFN | Genuine labelled data and model evaluation, only if completed |

### Article strategy

The most important part of the article should be the **actual outdoor experiment**.

A compelling order is:

1. The physical issue that inspired the test.
2. What happened during the first observation.
3. What the model understood.
4. What happened during the revisit.
5. What the comparison detected.
6. What the system could not reliably determine.
7. How the technologies worked together.
8. What would be needed for real-world deployment.

That will be stronger than opening with eleven sponsor logos.

---

# 23. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Excessive sponsor complexity | Critical | P0 scope freeze |
| Core flow breaks during redesign | Critical | Preserve existing backend and regression suite |
| False AI claims | High | Store provenance and require human review |
| Sensitive photographs | High | Consent, access controls and metadata minimization |
| Public API abuse | High | Rate limits, private write gateway and quotas |
| Tiger Data TLS problem | High | Use only certificate-verified connection; keep Render DB |
| No genuine TabPFN dataset | High | Keep experimental capability disabled |
| ElevenLabs unavailable | Medium | Hide audio controls and preserve text |
| Backboard unavailable | Medium | Keep Gemma primary |
| Tinker evaluation overclaimed | High | State small synthetic-sample limitations |
| Demo uses synthetic images | Medium | Label fixtures and record real field observations where possible |
| Provider cost overruns | High | Verify allowance and disable paid overages |
| Render free service sleeps | Medium | Verify availability before recording and publishing |
| Database retention expires | Medium | Document expiration and preserve allowed backups |
| Weak submission article | High | Explain actual results, limitations and open-source decisions |

---

# 24. Final release checklist

## Product

- [ ] Landing page explains the product clearly.
- [ ] Mobile reporting works.
- [ ] Real photograph upload works.
- [ ] Location capture works.
- [ ] Gemma generates structured evidence.
- [ ] Issue creation persists.
- [ ] Nearby issue search works.
- [ ] Walk Queue works.
- [ ] Revisit upload works.
- [ ] Before/after comparison works.
- [ ] Human resolution works.
- [ ] Timeline preserves all evidence.
- [ ] Reopening preserves history.

## Integrations

- [ ] Render is live.
- [ ] Gemma inference is verified.
- [ ] Mastra workflow is verified.
- [ ] SerpApi place context is verified.
- [ ] Sentry traces are verified.
- [ ] Entire evidence is reviewed.
- [ ] Tinker evaluation is documented.
- [ ] ElevenLabs voice generation is verified if claimed.
- [ ] Backboard comparison is verified if claimed.
- [ ] Tiger Data retrieval is verified if claimed.
- [ ] TabPFN is only claimed if genuine inference and evaluation exist.

## Engineering

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Production mocks are disabled.
- [ ] Upload validation works.
- [ ] Sensitive data is excluded from telemetry.
- [ ] Database migrations are safe.
- [ ] Provider costs are bounded.
- [ ] API credentials remain private.
- [ ] Frontend works on mobile.
- [ ] Error recovery works.

## Submission

- [ ] README is accurate.
- [ ] Architecture is documented.
- [ ] Demo URL works.
- [ ] Public code is accessible.
- [ ] Field demonstration is recorded.
- [ ] Real and synthetic evidence are distinguished.
- [ ] Sponsor claims are supported.
- [ ] Open-source AI is explained.
- [ ] AI coding assistance is disclosed.
- [ ] DEV article is published.
- [ ] Submission is completed before the deadline.

---

# 25. Final implementation decision

**FieldIssue V2 should be an outdoor-first evidence tracker, not a sponsor showcase pretending to be a product.**

The implementation priorities are:

| Order | Work | Reason |
|---|---|---|
| 1 | Preserve the working backend | Protect current progress |
| 2 | Rebuild the visual experience | Make the product impressive and usable |
| 3 | Perfect report → revisit → compare | This is the product's central innovation |
| 4 | Add Walk Queue | Strengthen Touch Grass relevance |
| 5 | Activate ElevenLabs and Backboard | Useful, bounded integrations |
| 6 | Fix Tiger Data and implement search | Stronger technical depth |
| 7 | Document Tinker and Entire | Convert existing work into judge-visible evidence |
| 8 | Keep TabPFN experimental | Avoid unsupported predictions |
| 9 | Record a genuine field demonstration | Prove the product is about the physical world |
| 10 | Write an exceptional DEV submission | Directly optimize for the highest-weighted judging criterion |

### Non-negotiable implementation principle

**Do not rewrite an already verified backend component unless the V2 requirements genuinely demand it.**

The frontend deserves the largest rework. The data and intelligence layers mostly need completion, integration and hardening.

### Final product definition

FieldIssue V2 is complete when somebody can:

**Go outside → capture a physical issue → receive AI-assisted analysis → return later → compare evidence → explicitly confirm the outcome → inspect the complete history.**

The ten sponsor integrations support that experience or provide independently verifiable development and evaluation capabilities.

**That is the product and scope I would build toward.**