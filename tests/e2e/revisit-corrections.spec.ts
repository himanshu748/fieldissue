import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
test.skip(
  process.env.FIELDISSUE_LOCAL_E2E !== "1",
  "Requires opt-in isolated synthetic test server",
);
for (const width of [360, 390])
  test(`owner corrections and saved comparisons at ${width}px`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (baseURL !== "http://127.0.0.1:3190")
      throw new Error("Refusing any non-local test target");
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await context.request.get("/app-config");
    const upload = async (
      path: string,
      name: string,
      note: string,
      date: string,
    ) => {
      const r = await context.request.post(path, {
        headers: { Origin: baseURL },
        multipart: {
          image: {
            name: `${name}.png`,
            mimeType: "image/png",
            buffer: await readFile(
              resolve(`tests/fixtures/revisit/${name}.png`),
            ),
          },
          title: "Synthetic revisit QA",
          note,
          latitude: "0",
          longitude: "0",
          capturedAt: date,
          publicConsent: "true",
        },
      });
      expect(r.status()).toBe(201);
      return r.json();
    };
    const issue = await upload(
      "/v1/issues",
      "original",
      "Synthetic original broken tree",
      "2026-10-09T10:00:00Z",
    );
    const id = issue.publicId,
      A = issue.observations[0];
    const B = (
      await upload(
        `/v1/issues/${id}/observations`,
        "wrong-tree",
        "Synthetic wrong tree",
        "2026-10-10T03:00:00Z",
      )
    ).observation;
    const C = (
      await upload(
        `/v1/issues/${id}/observations`,
        "correct-revisit",
        "Synthetic correct tree",
        "2026-10-10T04:00:00Z",
      )
    ).observation;
    await page.goto(`/app/issues/${id}/compare?before=${B.id}&after=${C.id}`);
    await expect(
      page.getByText("Not comparable", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Added conditions", { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText("90%", { exact: false })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/verification/assets/revisit-${width}-not-comparable.png`,
      fullPage: true,
    });
    await page.goto(`/app/issues/${id}`);
    await page.getByRole("button", { name: /Revisit 1.*Eligible/ }).click();
    const wrong = page
      .locator('[data-slot="accordion-item"]')
      .filter({ has: page.getByRole("button", { name: /Revisit 1/ }) });
    await wrong
      .getByRole("button", { name: "Mark incorrect observation" })
      .click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page
      .getByLabel("Correction reason (optional)")
      .fill("Different tree. Preserve this mistake in history.");
    await page.getByRole("button", { name: "Confirm exclusion" }).click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("button", { name: /Revisit 1.*Excluded: Wrong location/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: /Revisit 1.*Excluded/ }).click();
    await expect(
      page.getByRole("button", { name: "Restore observation" }),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/verification/assets/revisit-${width}-excluded.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Compare with original", exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`before=${A.id}&after=${C.id}`));
    await page.getByRole("checkbox").check();
    await page
      .getByRole("button", { name: "Compare observations", exact: true })
      .click();
    await expect(
      page.getByText("No added or removed conditions identified", {
        exact: true,
      }),
    ).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`before=${A.id}&after=${C.id}`));
    const slider = page.getByRole("slider", { name: /Comparison divider/ });
    await slider.focus();
    await slider.press("ArrowRight");
    await expect(slider).toHaveValue("51");
    const size = await slider.boundingBox();
    expect(size!.width).toBeGreaterThanOrEqual(44);
    expect(size!.height).toBeGreaterThanOrEqual(44);
    await page.getByRole("tab", { name: "Side by side" }).click();
    await expect(page.getByRole("tabpanel").getByRole("img")).toHaveCount(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/verification/assets/revisit-${width}-comparison.png`,
      fullPage: true,
    });
    await page.goto(`/app/issues/${id}/evidence`);
    await expect(
      page.getByRole("heading", {
        name: "A report, a return visit, and the evidence",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("Excluded: Wrong location", { exact: true }),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/verification/assets/revisit-${width}-walkthrough.png`,
      fullPage: true,
    });
    await page.goto(`/app/issues/${id}`);
    await page.getByRole("button", { name: /Revisit 1.*Excluded/ }).click();
    await page.getByRole("button", { name: "Restore observation" }).click();
    await page.getByRole("button", { name: "Confirm restoration" }).click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("button", { name: /Revisit 1.*Eligible/ }),
    ).toBeVisible();
    const saved = await (await context.request.get(`/v1/issues/${id}`)).json();
    expect(saved.status).toBe("OPEN");
    const diffs = await (
      await context.request.get(`/v1/issues/${id}/diffs`)
    ).json();
    expect(diffs.items.filter((d: any) => d.supersededAt)).toHaveLength(2);
    expect(diffs.items.find((d: any) => !d.supersededAt)).toMatchObject({
      beforeObservationId: A.id,
      afterObservationId: C.id,
    });
    expect(errors).toEqual([]);
  });
