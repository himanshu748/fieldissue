# Frozen evaluation sources

This dataset was frozen on 11 October 2026 before new model inference.

## Synthetic notes

The generator combines assistant-authored scenario facts with split-specific objects and writing frames. Training has 408 notes, validation has 66 notes and the synthetic test has 204 notes. Each split includes English, Hindi in Devanagari and Hinglish. All nine categories and all four severity levels occur. OTHER does not have fabricated life-threatening training scenarios merely to balance a table.

Test facts, objects, instructions and introductions differ from training. The manifest records normalized exact-match and character 5-gram Jaccard checks at threshold 0.6. Two validation candidates were dropped. No synthetic test candidate was dropped. This is a lexical screen. Template semantics can remain correlated and this dataset cannot establish real-world generalization.

## Public-source slice

Thirty unchanged English descriptions were selected from the first 300 public City of Boston Open311 request results. The selection deliberately uses civic maintenance reports and excludes contact details, precise addresses and sensitive personal reports. It is purposive rather than random. There are no Hindi or Hinglish public-source examples and no author walk notes in this slice.

Sources:

- [Boston Open311 API documentation](https://311.boston.gov/open311/docs).
- [City of Boston 311 dataset licence metadata](https://data.boston.gov/api/3/action/package_show?id=311-service-requests), which reports `odc-pddl` and Open Data Commons Public Domain Dedication and License.
- [City explanation of its public-domain data policy](https://www.boston.gov/ar/news/analyze-boston-puts-bostons-data-public-domain).

Each row links the source request and its read-only API record. The notes are genuine public reports, but FieldIssue severity and category labels were assigned by this assistant using the frozen rubric before inference. They are not independent human judgments. No report photos, coordinates, contact information or API authentication tokens are retained in the committed dataset. Source descriptions were not translated or rewritten.

Read synthetic and public-source metrics separately. In particular, this public slice lacks LOW and CRITICAL reference labels. Four-level macro F1 therefore has a maximum of 0.5 on this slice under the fixed-label definition. Accuracy and individual confusion counts should accompany it.
