# Field note labelling rubric v3

Frozen on 11 October 2026 before new training or evaluation inference.

Labels describe what the note explicitly reports. They do not verify a photograph or establish an emergency. Do not infer injuries, blocked access or danger from the object name alone.

| Severity | Required reported evidence | Example |
| --- | --- | --- |
| LOW | Cosmetic wear, minor inconvenience or an unclear concern. Normal use remains possible and no substantial hazard is stated. | A faded bench label is still readable. |
| MEDIUM | A definite maintenance or cleanliness problem. No substantial obstruction or major danger is explicitly reported. | A bin is overflowing onto the surrounding ground. |
| HIGH | Substantial loss of access, an unusable route or a serious hazard. The note does not describe a current life-threatening event. | The only wheelchair entrance is blocked. |
| CRITICAL | An explicitly current or imminent life-threatening event involving people. Severity must not be inferred from a generic word such as broken. | Live wires are sparking beside people walking through water now. |

Use the highest level supported by the reported facts. An explicit safe alternative may reduce an obstruction's severity. Uncertainty about a hazard does not create CRITICAL. Negated conditions such as no sparks or nobody trapped must be respected. A reporter's urgency alone does not establish severity.

## Category rules

Choose the primary reported problem. Context words such as park or roadside do not determine category.

- CLEANLINESS: litter, waste collection or overflowing bins.
- INFRASTRUCTURE: structural defects in roads, buildings or street furniture.
- ACCESSIBILITY: barriers affecting wheelchair access or accessible facilities.
- SAFETY: electrical hazards, fire or exposed dangerous openings without a more specific primary maintenance problem.
- ENVIRONMENT: trees, vegetation, water contamination or ecosystem damage.
- SIGNAGE: missing, unreadable or misleading signs.
- LIGHTING: failed or inadequate public illumination.
- TRAIL: an unpaved trail's surface, erosion or fallen material blocking that trail.
- OTHER: a stated concern outside these domains or an unclear concern. Preserve uncertainty rather than inventing an object.

If several problems compete, label the one responsible for the reported consequence. Record ambiguous public-source notes as ambiguous and exclude them before inference rather than label them after seeing a prediction.

## Independent evaluation policy

Training and validation use separate scenario banks. Test notes use a different writing instruction and reserved scenario vocabulary. Normalized exact matches and character 5-gram Jaccard similarities of at least 0.6 are rejected before model calls. This checks lexical overlap, not complete semantic independence.

Freeze the training files, validation files, test files, five few-shot example IDs and their hashes before inference. Choose learning rate and epochs using validation severity accuracy, then macro F1, then valid-schema rate. Resolve a remaining tie with fewer epochs followed by the lower learning rate. Rank stays 16. Never choose between seeds using test results.

Report synthetic notes and public-source notes separately. Public-source notes must retain source and licence provenance. Assistant rubric labels are disclosed as assistant labels. They are not independent human ground truth and are not notes from the author's real walks.

Invalid schema counts as incorrect category and severity. It also counts as a costly triage failure. Severity macro F1 always includes all four levels. Confidence intervals resample paired note indices 1,000 times. These intervals condition on this dataset and do not establish field generalization.
