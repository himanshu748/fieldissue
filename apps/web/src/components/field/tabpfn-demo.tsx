import { Checkbox } from "@/components/ui/checkbox";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ErrorNotice } from "./states";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
const initial = { days_since_last_observation:7, previous_observation_count:3, issue_age_days:21, severity:1, category:0, nearby_issue_count:4, previous_change_count:1, status:0 };
const fields = [
  ["days_since_last_observation","Days since last visit",1,30],
  ["previous_observation_count","Previous observations",1,8],
  ["issue_age_days","Issue age in days",1,120],
  ["nearby_issue_count","Nearby issues",0,14],
  ["previous_change_count","Previously changed visits",0,7],
] as const;
const selects = [
  ["severity","Severity",["Low","Medium","High","Critical"]],
  ["category","Category",["Cleanliness","Infrastructure","Accessibility","Safety","Environment","Signage","Lighting","Trail","Other"]],
  ["status","Status",["Open","Acknowledged","In progress"]],
] as const;
export function TabPFNDemo({available}:{available:boolean}) {
  const consentId=useId();
  const [acknowledged,setAcknowledged]=useState(false);
  const [features,setFeatures]=useState(initial);
  const [result,setResult]=useState<Awaited<ReturnType<typeof api.revisitDemo>>>();
  const [error,setError]=useState<Error>();
  const [loading,setLoading]=useState(false);
  const valid=fields.every(([key,,min,max])=>Number.isInteger(features[key])&&features[key]>=min&&features[key]<=max)&&features.issue_age_days>=features.days_since_last_observation&&features.previous_change_count<features.previous_observation_count;
  async function run(){if(!acknowledged||!valid)return;setLoading(true);setError(undefined);try{setResult(await api.revisitDemo(features));}catch(e){setError(e as Error);}finally{setLoading(false);}}
  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap gap-2"><Badge variant="outline">Live TabPFN inference</Badge><Badge variant="secondary">Synthetic scenarios only</Badge></div>
    <p className="max-w-2xl text-muted-foreground">Explore how a tabular model responds to different revisit scenarios. TabPFN reads 96 invented, labeled training examples. These probabilities describe the synthetic demo, not the chance that a real issue has changed. They do not affect walk rankings or resolution.</p>
    <p className="text-sm text-muted-foreground">Held-out synthetic check: 16/24 correct, versus 17/24 for a majority-label baseline. This demonstrates the integration; it does not demonstrate predictive improvement.</p>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([key,name,min,max])=><label key={key} className="flex flex-col gap-2 text-sm">{name}<input aria-label={name} type="number" min={min} max={max} value={features[key]} onChange={e=>{setFeatures({...features,[key]:Number(e.target.value)});setResult(undefined);}} className="min-h-11 border border-ink bg-paper px-3" /></label>)}
      {selects.map(([key,name,values])=><label key={key} className="flex flex-col gap-2 text-sm">{name}<select aria-label={name} value={features[key]} onChange={e=>{setFeatures({...features,[key]:Number(e.target.value)});setResult(undefined);}} className="min-h-11 border border-ink bg-paper px-3">{values.map((s,i)=><option key={s} value={i}>{s}</option>)}</select></label>)}
    </div>
    {!valid?<p className="text-sm text-destructive">Issue age must cover the last visit, and changed visits must be fewer than total observations.</p>:null}
    <p className="text-xs text-muted-foreground">Running sends only these numeric scenario values to Prior Labs. No report, photo, note, location or account information is included.</p>
    <label htmlFor={consentId} className="flex items-start gap-3 text-sm"><Checkbox id={consentId} checked={acknowledged} onCheckedChange={v=>setAcknowledged(v===true)} className="size-5 shrink-0"/>I understand this is synthetic data and agree to send these scenario values to Prior Labs.</label>
    <Button onClick={run} className="self-start" disabled={!available||!valid||!acknowledged||loading}>{loading?<Spinner/>:null}{loading?"Running TabPFN…":"Run synthetic scenario"}</Button>
    {!available?<p className="text-sm text-muted-foreground">This deployment has not configured the TabPFN demo.</p>:null}
    {error?<ErrorNotice error={error} title="Scenario prediction unavailable"/>:null}
    {result?<div className="space-y-2 border border-ink bg-surface p-5" aria-live="polite"><p className="eyebrow">Synthetic material-change probability</p><p className="font-mono text-4xl">{(result.probability*100).toFixed(1)}%</p><p className="text-sm">{result.model} · {result.trainingRows} synthetic training rows · {result.cached?"Saved prediction":"Fresh inference"}</p><p className="text-xs text-muted-foreground">{formatDateTime(result.createdAt)} · {(result.latencyMs/1000).toFixed(1)} s. No real-world accuracy claim.</p></div>:null}
    <a className="text-sm underline" href="https://github.com/himanshu748/fieldissue/tree/main/services/intelligence/training/revisit-demo" target="_blank" rel="noreferrer">Inspect the synthetic dataset, generator and evaluation</a>
  </div>;
}
