# FieldIssue: 80-second demonstration

Prepared 10 October 2026. Record the live product after a genuine revisit is saved.
At preparation, FI-000006 and FI-000007 each had one observation and no comparison.
The author plans to revisit in about an hour; that is a plan, not completed evidence.

## Capture prerequisite

Open the original report on Android Chrome, choose **Add revisit**, and take a new
photo at the same spot. Describe only what is visible now. Submit with analysis
consent and wait for the comparison. Keep an unchanged issue open. Send the issue
ID and the actual result before recording the final demonstration.

- [FI-000006: fallen branches](https://fieldissue-demo.onrender.com/app/issues/FI-000006)
- [FI-000007: cut tree and litter](https://fieldissue-demo.onrender.com/app/issues/FI-000007)

## Recording sequence

| Time | Live screen | Narration |
| --- | --- | --- |
| 0–8 s | Explore with the two real reports | “FieldIssue is built around the second walk. These are two reports I made outdoors on 9 October.” |
| 8–20 s | Chosen report, original photo and capture time | “A photo and a short note become a dated report. Gemma describes the visible conditions.” |
| 20–40 s | Actual fresh revisit and saved comparison | Explain the actual added, removed and unchanged conditions. Use the saved result; do not script a repair or claim unchanged until verified. |
| 40–50 s | Saved observations and history | “Both observations and the comparison stay in the history. A person decides whether to resolve the report.” |
| 50–70 s | Model Lab, `test-cleanliness-02` | “Tinker fine-tunes Qwen3 for informal notes. Here the base predicts High and the trained model predicts Medium, matching the synthetic target. Severity matches rose from 13 to 17 out of 18 in this run.” |
| 70–80 s | Tinker note action and public repository link | “The same checkpoint powers opt-in note interpretation. Its output stays separate from the photo evidence. The live app, code and evaluations are public.” |

The Tinker segment displays recorded real provider responses to synthetic notes.
It is not a fresh inference or an outdoor accuracy evaluation. A live note action
needs the report owner's consent. If no saved result is available, show its UI and
explain the action without claiming it was executed in the recording.

## Tinker evidence to show

In the [public Lab](https://fieldissue-demo.onrender.com/app/lab#tinker-examples),
select `test-cleanliness-02`: “Dustbin bhara hai aur kachra bahar gira hai.”
Both models identify an overflowing waste bin. Base severity is HIGH; fine-tuned
severity is MEDIUM, matching the assistant-authored synthetic annotation. The
full evaluation also contains a regression on `test-signage-02` and remains public.

## GitHub category evidence

The official category is **Best Use of GitHub Copilot**, whose
[rules explicitly include GitHub Actions automation](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).
No claim of Copilot-authored implementation is needed or made.

- [Workflow at the verified runtime commit](https://github.com/himanshu748/fieldissue/blob/2cc065e5b5869a323c19690deda49a9144daa131/.github/workflows/backend-ci.yml)
- [Passing run 37917938117](https://github.com/himanshu748/fieldissue/actions/runs/37917938117): 168 API and 74 Python tests, database extensions, HTTP runtime checks, and Render container boundaries/lifecycle.
- CI uses explicit fixtures; it does not establish live provider success.

## Final checks before sharing

- Use the newly saved real revisit, never a sample photo or a repeated-file control
  as a substitute for field evidence.
- Record actual browser actions and inspect the exported video and audio.
- Keep credentials, account settings and private reports out of frame.
- Check the public video link works without the author's login before embedding.
- Update the article's “Next I go back” sentence only after checking the real result.
- Submit all challenge work before **12 October 2026, 12:29 PM IST**.
