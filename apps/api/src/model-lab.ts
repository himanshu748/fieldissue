// Recorded, reproducible experiment; never presented as a live serving checkpoint.
export const evaluations = [
  {
    id: "tinker-note-json-2026-10-07",
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
      "The temporary Tinker checkpoint expired. Production image analysis uses Gemma, not this checkpoint.",
    ],
    evidenceUrl:
      "https://github.com/himanshu748/fieldissue/blob/main/docs/verification/tinker-evaluation-2026-10-07.json",
    serving: false,
  },
];
