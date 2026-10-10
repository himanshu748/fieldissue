import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

test.skip(
  process.env.FIELDISSUE_LOCAL_E2E !== "1",
  "Requires isolated synthetic test server",
);

test("revisit captures fresh GPS without inserting a conclusion and preserves it offline", async ({
  page,
  context,
  baseURL,
}) => {
  if (baseURL !== "http://127.0.0.1:3190")
    throw new Error("Refusing non-local target");
  await context.request.get("/app-config");
  const created = await context.request.post("/v1/issues", {
    headers: { Origin: baseURL },
    multipart: {
      image: {
        name: "original.png",
        mimeType: "image/png",
        buffer: await readFile(resolve("tests/fixtures/revisit/original.png")),
      },
      title: "Synthetic location QA",
      note: "Synthetic original",
      latitude: "0",
      longitude: "0",
      publicConsent: "true",
    },
  });
  expect(created.status()).toBe(201);
  const issue = await created.json();
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 12.9763, longitude: 77.5929 });
  await page.goto(`/app/issues/${issue.publicId}/revisit`);
  await expect(
    page.getByRole("radio", {
      name: "Record my current location (recommended)",
    }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Nothing seems to have changed" }),
  ).toHaveCount(0);
  await expect(
    page.getByLabel("What do you see?", { exact: false }),
  ).toHaveValue("");
  await page.getByRole("checkbox", { name: "Reporter saw no change", exact: true }).check();
  await expect(page.getByLabel("What do you see?", { exact: false })).toHaveValue("");
  await page
    .getByLabel("Choose a photo from your files")
    .setInputFiles(resolve("tests/fixtures/revisit/correct-revisit.png"));
  await expect(
    page.getByRole("img", { name: "Selected photo preview" }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "Keep this capture on this device until I review and upload it",
    })
    .check();
  await expect(
    page.getByRole("button", { name: "Save offline capture", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(
    page.getByText("12.97630, 77.59290", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "Keep this capture on this device until I review and upload it",
    })
    .check();
  await page
    .getByRole("button", { name: "Save offline capture", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved on this device", exact: true }),
  ).toBeVisible();
  const captures = await page.evaluate(
    () =>
      new Promise<any[]>((resolve, reject) => {
        const r = indexedDB.open("fieldissue-offline-v1");
        r.onsuccess = () => {
          const db = r.result;
          const q = db.transaction("captures").objectStore("captures").getAll();
          q.onsuccess = () => {
            resolve(q.result);
            db.close();
          };
          q.onerror = () => reject(q.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
  expect(captures).toHaveLength(1);
  expect(captures[0].draft).toMatchObject({
    locationMode: "here",
    note: "",
    reporterSawNoChange: true,
    location: { latitude: 12.9763, longitude: 77.5929, source: "device" },
  });
  // Continue through the real HTTP upload against the isolated test provider.
  await page
    .getByRole("checkbox", {
      name: "Publish this photo, note and location, and analyze with AI",
      exact: true,
    })
    .last()
    .check();
  await page
    .getByRole("button", { name: "Save and compare observations", exact: true })
    .click();
  await expect(page).toHaveURL(/\/compare\?before=/);
  const saved = await (
    await context.request.get(`/v1/issues/${issue.publicId}`)
  ).json();
  expect(saved.observations.at(-1)).toMatchObject({
    note: "",
    reporterSawNoChange: true,
    locationSource: "device",
    latitude: 12.9763,
    longitude: 77.5929,
  });
  // Losing the issue API must not silently replace fresh GPS with inherited coordinates.
  await page.route(`**/v1/issues/${issue.publicId}`, (route) =>
    route.abort("internetdisconnected"),
  );
  await page.goto(`/app/issues/${issue.publicId}/revisit`);
  await expect(
    page.getByRole("heading", { name: "Save an offline revisit" }),
  ).toBeVisible();
  await expect(
    page.getByRole("radio", {
      name: "Record my current location",
      exact: true,
    }),
  ).toBeChecked();
  await page
    .getByLabel("Choose a photo from your files")
    .setInputFiles(resolve("tests/fixtures/revisit/correct-revisit.png"));
  await page
    .getByLabel("Your observation", { exact: true })
    .fill("Offline GPS retained");
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(
    page.getByText("12.97630, 77.59290", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "Keep this capture on this device until I review and upload it",
    })
    .check();
  await page
    .getByRole("button", { name: "Save offline capture", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Saved on this device", exact: true }),
  ).toBeVisible();
  const offline = await page.evaluate(
    () =>
      new Promise<any>((resolve, reject) => {
        const r = indexedDB.open("fieldissue-offline-v1");
        r.onsuccess = () => {
          const db = r.result;
          const q = db.transaction("captures").objectStore("captures").getAll();
          q.onsuccess = () => {
            resolve(
              q.result.find((x) => x.draft.note === "Offline GPS retained")
                ?.draft,
            );
            db.close();
          };
          q.onerror = () => reject(q.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
  expect(offline).toMatchObject({
    locationMode: "here",
    location: { source: "device", latitude: 12.9763, longitude: 77.5929 },
  });
});

test("new worker notice does not silently reload a draft", async ({
  page,
  baseURL,
}) => {
  if (baseURL !== "http://127.0.0.1:3190")
    throw new Error("Refusing non-local target");
  await page.goto("/app/report");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  const note = page.locator("#report-note");
  await note.fill("Keep this unsent draft");
  // Simulate the browser's update event after the initial real worker installation.
  await page.evaluate(() =>
    navigator.serviceWorker.dispatchEvent(new Event("controllerchange")),
  );
  await expect(
    page.getByRole("button", { name: "Reload updated app" }),
  ).toBeVisible();
  await expect(note).toHaveValue("Keep this unsent draft");
  await expect(page).toHaveURL(/\/app\/report$/);
});
