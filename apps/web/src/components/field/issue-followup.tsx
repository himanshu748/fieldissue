import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { communityApi } from "@/lib/community";
import { ErrorNotice } from "./states";
export function saveDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function IssueFollowup({ id }: { id: string }) {
  const [signed, setSigned] = useState(false),
    [due, setDue] = useState(""),
    [error, setError] = useState<Error>(),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    void communityApi
      .me()
      .then((x) => setSigned(!!x.account))
      .catch(() => {});
  }, []);
  async function run(fn: () => Promise<unknown>, message: string) {
    setBusy(true);
    setError(undefined);
    try {
      await fn();
      setNotice(message);
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  function calendar() {
    const d = new Date(due);
    if (!Number.isFinite(d.getTime()) || d.getTime() < Date.now())
      return setError(new Error("Choose a future reminder time."));
    const fmt = (x: Date) =>
      x
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const url = `${window.location.origin}/app/issues/${encodeURIComponent(id)}`;
    const text = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//FieldIssue//Revisit//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}@fieldissue`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(d)}`,
      `DTEND:${fmt(new Date(d.getTime() + 30 * 60000))}`,
      `SUMMARY:Revisit ${id}`,
      `DESCRIPTION:Check conditions only if safe. ${url}`,
      `URL:${url}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Planned FieldIssue revisit",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    saveDownload(
      new Blob([text], { type: "text/calendar" }),
      `${id}-revisit.ics`,
    );
    setNotice(
      "Calendar file downloaded. Import it into your calendar to enable its reminder.",
    );
  }
  return (
    <section className="space-y-3 border-t pt-5">
      <h2 className="eyebrow">Come back later</h2>
      <label className="block text-sm">
        Revisit date and time
        <Input
          type="datetime-local"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
      </label>
      <Button variant="outline" disabled={!due} onClick={calendar}>
        Download calendar reminder
      </Button>
      {signed ? (
        <>
          <Button
            variant="outline"
            disabled={!due || busy}
            onClick={() =>
              void run(
                () => communityApi.reminder(id, new Date(due).toISOString()),
                "Reminder saved. It will appear in your Community inbox when due.",
              )
            }
          >
            Remind me in the app
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() =>
                void run(
                  () => communityApi.subscribe(id, true),
                  "Following this issue. Updates will appear in your Community inbox.",
                )
              }
            >
              Follow updates
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() =>
                void run(
                  () => communityApi.subscribe(id, false),
                  "Issue updates stopped.",
                )
              }
            >
              Unfollow
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm">
          <Link className="underline" to="/app/community">
            Sign in
          </Link>{" "}
          for in-app reminders and issue updates.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        No email or background push is sent. Calendar alerts depend on your
        calendar app settings.
      </p>
      {notice ? <p role="status">{notice}</p> : null}
      {error ? <ErrorNotice error={error} /> : null}
    </section>
  );
}
