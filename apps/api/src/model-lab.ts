// Evaluation records preserve dataset limitations and identify the serving checkpoint.
export const evaluations = [
  {
    id: "tinker-note-json-2026-10-09",
    modelVersion:
      "tinker://efb40129-33b1-57e0-9f76-6524f961de35:train:0/sampler_weights/fieldissue-note-json-20261009-045450",
    title: "Serving checkpoint: field-note classification",
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
