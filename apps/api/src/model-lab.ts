import { tinkerExamples } from "./tinker-examples.js";

// Evaluation records preserve dataset limitations and identify the serving checkpoint.
const measured = (model: string) => {
  const entry = tinkerExamples.summary.find(
    (s) => s.slice === "synthetic" && s.model === model,
  )!;
  return {
    strictSchema: Math.round(entry.schemaRate * entry.n),
    correctCategory: Math.round(entry.categoryAccuracy * entry.n),
    correctSeverity: Math.round(entry.severityAccuracy * entry.n),
    costlyErrorOrInvalid: Math.round(entry.costlyErrorRate * entry.n),
  };
};
export const evaluations = [
  {
    id: "tinker-note-json-2026-10-11",
    modelVersion: tinkerExamples.modelVersion,
    title: "Validation-selected candidate: independent field-note evaluation",
    model: tinkerExamples.model,
    dataset:
      "408 synthetic training notes, 66 validation notes and 204 held-out synthetic notes across English, Hindi and Hinglish. The separate 30-report Boston slice is shown above.",
    recordedAt: tinkerExamples.recordedAt,
    metrics: {
      heldOutExamples: 204,
      base: measured("zero_shot"),
      fewShot: measured("few_shot"),
      fineTuned: measured("fine_tuned_seed42"),
      secondSeed: measured("fine_tuned_seed1729"),
    },
    limitations: [
      "Assistant rubric labels. Synthetic templates are correlated. Public reports are genuine English source text with assistant labels, not independently human-labelled ground truth.",
      "Primary seed was fixed before testing. Public category accuracy fell from 25/30 few-shot to 20/30 fine-tuned. Both seeds and every error remain visible.",
      "Serving is reported only when this deployment configures the measured checkpoint. The selected checkpoint expires on 6 November 2026 UTC.",
    ],
    evidenceUrl: tinkerExamples.evidenceUrl,
    serving: true,
  },
  {
    id: "tinker-note-json-2026-10-09",
    modelVersion:
      "tinker://efb40129-33b1-57e0-9f76-6524f961de35:train:0/sampler_weights/fieldissue-note-json-20261009-045450",
    title: "October 9 field-note evaluation",
    model: "Qwen/Qwen3-8B",
    dataset:
      "54 assistant-authored synthetic notes: 36 training, 18 held-out; English, Hindi and Hinglish.",
    recordedAt: "2026-10-09T04:58:03.491641+00:00",
    metrics: {
      heldOutExamples: 18,
      base: {
        validJson: 18,
        strictSchema: 18,
        correctCategory: 17,
        correctSeverity: 13,
      },
      fineTuned: {
        validJson: 18,
        strictSchema: 18,
        correctCategory: 17,
        correctSeverity: 17,
      },
    },
    limitations: [
      "Tiny synthetic note-only evaluation; not real-world accuracy.",
      "Evidence descriptions are paraphrases of reporter claims, not verified observations. Exact-string annotation agreement remains weak.",
      "A human must review output. The note model never changes issue classification or resolution.",
    ],
    evidenceUrl:
      "https://github.com/himanshu748/fieldissue/blob/main/docs/verification/tinker-evaluation-2026-10-09.json",
    serving: true,
  },
  {
    id: "tinker-note-json-2026-10-07",
    modelVersion: "expired-historical-checkpoint",
    title: "Base versus fine-tuned field-note classification",
    model: "Qwen/Qwen3-8B",
    dataset:
      "54 assistant-authored synthetic notes: 36 training, 18 held-out; English, Hindi and Hinglish.",
    recordedAt: "2026-10-07T10:26:33.377792+00:00",
    metrics: {
      heldOutExamples: 18,
      base: {
        validJson: 18,
        strictSchema: 18,
        correctCategory: 17,
        correctSeverity: 14,
      },
      fineTuned: {
        validJson: 18,
        strictSchema: 18,
        correctCategory: 17,
        correctSeverity: 16,
      },
    },
    limitations: [
      "Tiny synthetic note-only evaluation, not field accuracy or image understanding.",
      "Exact-string evidence agreement was weak and is not a calibrated hallucination measurement.",
      "This original checkpoint expired. A new checkpoint now serves the separate note-interpretation feature; Gemma handles images.",
    ],
    evidenceUrl:
      "https://github.com/himanshu748/fieldissue/blob/main/docs/verification/tinker-evaluation-2026-10-07.json",
    serving: false,
  },
];
