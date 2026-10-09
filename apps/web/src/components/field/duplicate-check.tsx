import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import { label } from "@/lib/format";
import { ErrorNotice } from "./states";
export function DuplicateCheck({
  latitude,
  longitude,
  note,
}: {
  latitude: number;
  longitude: number;
  note: string;
}) {
  const [category, setCategory] = useState(""),
    [items, setItems] =
      useState<
        {
          public_id: string;
          title: string;
          distance_meters: number;
          text_match: boolean;
          category_match: boolean;
        }[]
      >(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error>();
  useEffect(() => {
    setItems(undefined);
  }, [latitude, longitude, note, category]);
  async function check() {
    setBusy(true);
    setError(undefined);
    try {
      const q = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        note,
        ...(category ? { category } : {}),
      });
      setItems(
        (
          await request<{ items: NonNullable<typeof items> }>(
            `/v1/duplicates?${q}`,
          )
        ).items,
      );
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-3 border border-ink p-4">
      <h2 className="font-bold">Already reported nearby?</h2>
      <p className="text-sm text-muted-foreground">
        Check public reports within 300 metres, ranked by distance, category and
        matching words. Suggestions never merge reports automatically.
      </p>
      <label className="block text-sm">
        Category to compare (optional)
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 block min-h-11 w-full border border-ink bg-paper px-3"
        >
          <option value="">Any category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {label(c)}
            </option>
          ))}
        </select>
      </label>
      <Button variant="outline" disabled={busy} type="button" onClick={check}>
        {busy ? "Checking…" : "Check nearby reports"}
      </Button>
      {items?.length ? (
        <>
          <p>
            This may already have been reported. Open a match to add a revisit,
            or continue with a new report.
          </p>
          <ul>
            {items.map((i) => (
              <li key={i.public_id} className="border-t py-3">
                <Link className="underline" to={`/app/issues/${i.public_id}`}>
                  {i.title}
                </Link>
                <p className="text-sm">
                  {i.distance_meters} m away
                  {i.category_match ? " · same category" : ""}
                  {i.text_match ? " · matching words" : ""}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : items ? (
        <p>No nearby candidates found. You can continue reporting.</p>
      ) : null}
      {error ? <ErrorNotice error={error} /> : null}
    </section>
  );
}
