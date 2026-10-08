import { test, expect } from "@playwright/test";

// Explicitly opt in with a public/synthetic control photo. No provider stubs and
// no retained traces/screenshots that might expose access tokens or field photos.
const enabled = process.env.FIELDISSUE_LIVE_E2E === "1";
test.skip(!enabled, "Requires explicit live-provider opt-in and existing quota");
test("report, reload, revisit, compare, manual resolution and reopening", async ({ page }) => {
  const token = process.env.FIELDISSUE_E2E_TOKEN;
  const photo = process.env.FIELDISSUE_E2E_PHOTO;
  expect(token, "Provide the access token through the environment").toBeTruthy();
  expect(photo, "Provide an approved public control photo path").toBeTruthy();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/app/report");
  await page.getByRole("textbox", { name: "Access token", exact: true }).fill(token!);
  await page.getByRole("button", { name: "Unlock", exact: true }).click();
  async function choosePhoto() {
    const chooser = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Choose an existing photo", exact: true }).click();
    await (await chooser).setFiles(photo!);
    await expect(page.getByAltText("Selected photo preview")).toBeVisible();
  }
  await choosePhoto();
  await page.getByRole("button", { name: "Enter coordinates", exact: true }).click();
  await page.getByRole("textbox", { name: "Latitude", exact: true }).fill("0");
  await page.getByRole("textbox", { name: "Longitude", exact: true }).fill("0");
  const note = `SYNTHETIC acceptance control ${Date.now()}: public photo, 0,0 test pin. Not an outdoor observation.`;
  await page.getByRole("textbox", { name: "Add a note (optional)", exact: true }).fill(note);
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.reload();
  await expect(page.getByAltText("Selected photo preview")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Add a note (optional)", exact: true })).toHaveValue(note);
  await page.getByRole("checkbox", { name: "Send this photo and note for AI analysis", exact: true }).check();
  await page.getByRole("button", { name: "Analyze observation", exact: true }).click();
  await page.waitForURL(/\/app\/report\/review\?issue=FI-/, { timeout: 120000 });
  const id = new URL(page.url()).searchParams.get("issue")!;
  await page.goto(`/app/issues/${id}`);
  await expect(page.getByRole("heading", { name: "Original photo", exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "Add revisit", exact: true }).click();
  await choosePhoto();
  await page.getByRole("checkbox", { name: "Send this photo and note for AI analysis", exact: true }).check();
  await page.getByRole("button", { name: "Save and compare observations", exact: true }).click();
  await page.waitForURL(/\/compare\?/, { timeout: 120000 });
  await expect(page.getByText("A fresh photo is needed", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Side by side", exact: true }).click();
  await page.getByRole("link", { name: "Review resolution", exact: true }).click();
  await page.getByRole("radio", { name: "Manually recorded without new evidence", exact: true }).check();
  await page.getByRole("textbox", { name: /Resolution note/ }).fill("Synthetic workflow test only; no actual repair. This control will be reopened.");
  await page.getByRole("button", { name: "Confirm resolution", exact: true }).click();
  await page.getByRole("button", { name: "Yes, I confirm", exact: true }).click();
  await page.waitForURL(new RegExp(`/app/issues/${id}$`));
  await page.getByRole("button", { name: "Reopen issue", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(page.getByRole("link", { name: "Add revisit", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Status Resolved → Open", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
