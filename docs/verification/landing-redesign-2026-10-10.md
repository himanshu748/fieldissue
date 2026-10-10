# Landing page redesign

The public landing page now leads with real original/revisit photographs and a short report-to-revisit story. It retains the paper, ink and orange brand, existing routes, header labels, and shared dashboard styles. Layout rules are scoped to `.landing`.

The saved example comes from FI-000007 and the 10 October 2026 UNCHANGED comparison. The two bundled photographs are unaltered public report images, documented in `apps/web/public/assets/evidence/README.md`. The example links to the full evidence history and discloses the excluded photograph and inherited revisit location. It makes no AI calls. The park illustration remains explicitly labelled as generated.

Motion uses the existing Motion dependency: a short photo entrance, gentle scroll-linked movement and section reveals. Reduced-motion users receive visible content with no photo transforms. There are no scroll locks or autoplay loops.

Validation before publication:

- Production web build passed.
- Six browser tests passed: 320/390/768/1280-pixel layout and report/evidence links, keyboard photo switching with no API writes, and reduced-motion visibility (also exercised with a dark system preference; this page deliberately retains its paper brand palette).
- Desktop and Android-size browser inspection: original and revisit assets load; the evidence switch changes the image and caption; no horizontal overflow.
- Application/backend behavior and provider configuration are unchanged. No quota-consuming inference was requested.
