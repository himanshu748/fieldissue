# FieldIssue real revisit: 90-second script

Recording plan only. Record the real deployed product after approval and verification. Do not use the local synthetic screenshots as outdoor/model evidence. Leave the original DEV article unchanged until its edit is approved.

| Time | Show | Say |
|---|---|---|
| 0–12s | FI-000007 and original October 9 photo | “I found this damaged tree in Lucknow on October 9. I photographed it and saved a report in FieldIssue.” |
| 12–25s | October 10 observations and capture/upload metadata | “I went back the next morning. My first revisit photo was the wrong tree. The next photo was the original tree from another angle.” |
| 25–40s | Wrong photograph, owner correction and retained history | “A mistake shouldn't erase evidence. I marked this photograph as the wrong location. It remains in the timeline, with the correction, but it no longer qualifies for comparison.” |
| 40–58s | Explicit original → correct revisit selection, both dates and slider | “Now I'm comparing the October 9 original with the correct October 10 photograph. The selected pair is visible. Inherited coordinates alone don't prove these are the same place.” |
| 58–76s | Exact saved result, explanation and model provenance | Read the actual outcome and one concise sentence from the actual explanation. If NOT_COMPARABLE or INSUFFICIENT_EVIDENCE: “The model couldn't support a reliable conclusion from these views. Another view or a human review is needed.” If UNCHANGED: “The model says these visible conditions appear unchanged.” If CHANGED: describe only the specific visible change the saved result supports. |
| 76–90s | Audit trail and current OPEN status | “The earlier comparisons are still auditable. This report remains open. AI can help inspect evidence, but a person decides whether the problem is resolved.” |

Do not speak the correction or comparison segments as completed until their real actions are verified. Avoid a new provider call while recording; show the saved, authorized result. Use the owner browser only for correction; use the read-only walkthrough for the public judge view. Hide account/session controls and private data.

## Unpublished DEV evidence section: accurate before deployment

On October 9, I reported a damaged tree in Lucknow. On October 10, I returned and uploaded two photographs. The first was the wrong tree. The second was the original tree from another angle.

That mistake exposed a real bug. FieldIssue compared the second revisit with the immediately previous, incorrect photo. The saved result said the images were not comparable, but also reported added conditions at 0.9 confidence. Those claims did not support a trustworthy conclusion.

The fix introduces owner corrections without deleting photographs, exclusion-aware comparison selection, an audit trail, and explicit outcomes for comparable, non-comparable and insufficient evidence. It also lets people select the original and a specific revisit. Automated local tests exercise the correction workflow with synthetic drawings and a test-only provider; they do not establish a new real-world comparison result. The production correction and fresh comparison are pending deployment and approval. The issue is still OPEN.

Sources:

- [The real report and stored observations](https://fieldissue-demo.onrender.com/app/issues/FI-000007)
- [Implementation, tests and verification report](https://github.com/himanshu748/fieldissue/blob/fix/revisit-evidence-corrections/docs/verification/real-revisit-2026-10-10.md)
- [Model validation](https://github.com/himanshu748/fieldissue/blob/fix/revisit-evidence-corrections/packages/shared/src/index.ts)
- [Correction and migration tests](https://github.com/himanshu748/fieldissue/tree/fix/revisit-evidence-corrections/apps/api/test)

After authorized deployment and comparison, replace only the pending-action sentence with the observed outcome, exact comparison ID and date. Link the deployed evidence walkthrough and the real recording. Do not prewrite “unchanged,” a repair or a resolution.
