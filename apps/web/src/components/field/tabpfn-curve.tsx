import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { label } from "@/lib/format";
import type { TabPFNLearningCurve } from "@/lib/types";
const modelTitles: Record<string, string> = {
  tabpfn: "TabPFN",
  hist_gradient_boosting: "Histogram boosting",
};
const models = [
  "majority",
  "logistic_regression",
  "hist_gradient_boosting",
  "tabpfn",
  "oracle",
];
export function TabPFNMeasuredCurve({ data }: { data: TabPFNLearningCurve }) {
  const [metric, setMetric] = useState("rocAuc");
  return (
    <section
      id="tabpfn-learning-curve"
      aria-labelledby="tabpfn-curve-title"
      className="scroll-mt-24 space-y-4 border border-ink bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Measured learning curve</Badge>
        <Badge variant="secondary">Synthetic, not real revisits</Badge>
      </div>
      <h3 id="tabpfn-curve-title" className="text-xl font-bold">
        Where does TabPFN help?
      </h3>
      <p className="text-sm">
        2,500 rows from the original invented Bernoulli formula. Each training
        size has five repeats against the same 500-row test. Standardized
        logistic regression uses default L2 settings. Histogram boosting,
        majority class and the oracle probability rule use the exact same test
        rows. TabPFN uses Prior Labs' real API with one estimator.
      </p>
      <p className="text-sm">
        <strong>Rule fixed before inference:</strong> {data.decisionRule}{" "}
        {data.decisionImplementation}
      </p>
      <p className="text-sm font-semibold">
        {data.useful
          ? "The descriptive small-data AUC rule passed. Read the paired intervals before inferring a reliable advantage."
          : "The small-data AUC rule did not pass. This evaluation does not establish TabPFN as more useful than logistic regression."}
      </p>
      <img
        src={data.chartUrl}
        alt="ROC AUC learning curve for all five models with 95% intervals across training repeats"
        width="900"
        height="560"
        className="h-auto w-full border border-border bg-white"
        loading="lazy"
      />
      <label className="flex max-w-xs flex-col gap-2 text-sm font-semibold">
        Metric
        <select
          aria-label="TabPFN curve metric"
          className="min-h-11 border border-ink bg-paper px-3"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="rocAuc">ROC AUC</option>
          <option value="accuracy">Accuracy</option>
          <option value="brierScore">Brier score (lower is better)</option>
          <option value="logLoss">Log loss (lower is better)</option>
        </select>
      </label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-sm">
          <caption className="mb-2 text-left">
            Mean [95% interval]. {data.confidenceIntervalMethod}
          </caption>
          <thead>
            <tr className="border-b border-ink text-left">
              <th scope="col" className="py-2">
                Training rows
              </th>
              {models.map((m) => (
                <th scope="col" key={m}>
                  {modelTitles[m] ?? label(m)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.points.map((p) => (
              <tr className="border-b border-border" key={p.trainRows}>
                <th scope="row" className="py-2 text-left">
                  {p.trainRows}
                </th>
                {models.map((m) => {
                  const s = p.summary[m]?.[metric];
                  return (
                    <td key={m} className="font-mono">
                      {s
                        ? `${s.mean.toFixed(3)} [${s.ci95.map((v) => v.toFixed(3)).join(", ")}]`
                        : "Unavailable"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        Logistic regression matches the formula's shape. Oracle probabilities
        describe the Bayes rule in expectation; a noisy finite test can score
        another model above it. Intervals measure training-repeat variation
        only. This curve does not change the live 96-row scenario model, walk
        ranking or issue status.
      </p>
      <a
        href={data.evidenceUrl}
        className="inline-flex min-h-11 items-center text-sm underline"
        target="_blank"
        rel="noreferrer"
      >
        Inspect all repeats, metrics and test probabilities
      </a>
    </section>
  );
}
