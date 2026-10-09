import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { GitCompareIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ErrorNotice, ProviderUnavailable } from "./states";
import { api } from "@/lib/api";
import { label } from "@/lib/format";
import { COMPARISON_MODELS, type IntegrationStatus, type ModelComparisonResult, type SemanticResult } from "@/lib/types";

const available = (i?: IntegrationStatus) => !!i && !["unavailable", "not_configured"].includes(i.status.toLowerCase());

export function BackboardPanel({ integration, observationId }: { integration?: IntegrationStatus; observationId?: string }) {
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<{ result?: ModelComparisonResult; error?: Error; loading?: boolean }>({});

  if (!available(integration))
    return (
      <ProviderUnavailable
        name="Backboard model comparison"
        detail={integration?.detail ?? "This deployment does not report a Backboard integration. No comparison is shown."}
      />
    );
  if (!observationId) return <p className="text-muted-foreground">A stored observation is needed before two models can be compared.</p>;

  async function run() {
    if (!observationId) return;
    setState({ loading: true });
    try {
      setState({ result: await api.compareModels(observationId, COMPARISON_MODELS) });
    } catch (error) {
      setState({ error: error as Error });
    }
  }

  const result = state.result;
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-muted-foreground">
        Two open-weight models read the same stored note and recorded image analysis (text only) and each give a category,
        severity and rationale. The point is to surface disagreement for a person to review, not to average an answer.
      </p>
      <Field orientation="horizontal">
        <Checkbox id="bb-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="size-5" />
        <FieldLabel htmlFor="bb-consent" className="font-normal">
          Send the latest observation's note and stored analysis to Backboard for {COMPARISON_MODELS.join(" and ")}
        </FieldLabel>
      </Field>
      <Button onClick={run} disabled={!consent || state.loading} className="self-start">
        {state.loading ? <Spinner data-icon="inline-start" /> : <GitCompareIcon data-icon="inline-start" />}
        Compare interpretations
      </Button>
      {state.error ? <ErrorNotice error={state.error} title="Comparison failed" /> : null}
      {result ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {result.results.map((r, i) => (
              <div key={i} className="flex flex-col gap-3 border border-ink bg-surface p-4">
                <p className="font-mono text-xs break-all">{r.model ?? COMPARISON_MODELS[i]}</p>
                {r.status === "complete" && r.result ? (
                  <>
                    <p className="text-lg font-semibold">
                      {label(r.result.category)} · {label(r.result.severity)}
                    </p>
                    <p className="text-sm">{r.result.rationale}</p>
                    {r.result.evidence?.length ? (
                      <ul className="list-inside list-disc text-sm text-muted-foreground">
                        {r.result.evidence.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    ) : null}
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-xs text-muted-foreground">
                      {r.provider ? (
                        <>
                          <dt>Provider</dt>
                          <dd>{r.provider}</dd>
                        </>
                      ) : null}
                      {r.promptVersion ? (
                        <>
                          <dt>Prompt</dt>
                          <dd className="break-all">{r.promptVersion}</dd>
                        </>
                      ) : null}
                      {r.inputModality ? (
                        <>
                          <dt>Input</dt>
                          <dd>{r.inputModality}</dd>
                        </>
                      ) : null}
                      {r.latencyMs != null ? (
                        <>
                          <dt>Response time</dt>
                          <dd>{(r.latencyMs / 1000).toFixed(1)} s{r.cached ? " (recorded earlier)" : ""}</dd>
                        </>
                      ) : null}
                      {r.inputTokens != null || r.outputTokens != null ? (
                        <>
                          <dt>Tokens</dt>
                          <dd>
                            {r.inputTokens ?? "?"} in · {r.outputTokens ?? "?"} out
                          </dd>
                        </>
                      ) : null}
                      {r.costUsd != null ? (
                        <>
                          <dt>Cost</dt>
                          <dd>${r.costUsd.toFixed(5)}</dd>
                        </>
                      ) : null}
                      {r.createdAt ? (
                        <>
                          <dt>Recorded</dt>
                          <dd>{new Date(r.createdAt).toLocaleString()}</dd>
                        </>
                      ) : null}
                    </dl>
                    {r.cached ? <Badge variant="outline" className="self-start">Recorded earlier</Badge> : null}
                  </>
                ) : (
                  <p role="status" className="text-sm text-muted-foreground">
                    {r.status === "pending"
                      ? "Still running in another request. Try again shortly."
                      : "This model could not return a verified answer. Wait a minute before trying again. The other result is unaffected."}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm">
            {result.disagreement
              ? result.disagreement.category || result.disagreement.severity
                ? `Models disagree on ${[result.disagreement.category && "category", result.disagreement.severity && "severity"].filter(Boolean).join(" and ")}. A person should review.`
                : "Both models agree on category and severity."
              : "Disagreement needs two completed interpretations."}{" "}
            This never changes the issue's status.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function SemanticSearchPanel({ integration }: { integration?: IntegrationStatus }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<{ result?: SemanticResult; error?: Error; loading?: boolean }>({});

  if (!available(integration))
    return (
      <ProviderUnavailable
        name="Semantic search"
        detail={integration?.detail ?? "Not configured here. Explore still searches titles and FI numbers."}
      />
    );

  async function search(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setState({ loading: true });
    try {
      setState({ result: await api.semanticSearch(query.trim()) });
    } catch (error) {
      setState({ error: error as Error });
    }
  }

  return (
    <form onSubmit={search} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="semantic-q">Describe a problem</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="semantic-q"
            minLength={2}
            maxLength={300}
            placeholder="blocked ramp near a bus stop"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Button type="submit" size="sm" disabled={state.loading || query.trim().length < 2}>
              {state.loading ? <Spinner /> : <SearchIcon />}
              <span className="sr-only">Search</span>
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Hybrid keyword and vector search over saved issue text. Photos are not indexed.</FieldDescription>
      </Field>
      {state.error ? <ErrorNotice error={state.error} title="Search failed" /> : null}
      {state.result ? (
        state.result.items.length ? (
          <ul className="flex flex-col border-t border-ink">
            {state.result.items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                <Link to={`/app/issues/${item.publicId}`} className="min-w-0 underline-offset-4 hover:underline">
                  <span className="mr-2 font-mono text-sm text-observe-ink">{item.publicId}</span>
                  {item.title}
                </Link>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  similarity {Number(item.similarity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No similar issues found.</p>
        )
      ) : null}
      {state.result ? (
        <p className="font-mono text-xs text-muted-foreground">
          {state.result.method} · {state.result.model}
        </p>
      ) : null}
    </form>
  );
}
