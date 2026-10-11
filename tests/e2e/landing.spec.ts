import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.skip(
  !process.env.FIELDISSUE_LOCAL_E2E,
  "Landing checks run against an isolated local server.",
);

test.beforeEach(async ({ page }) => {
  const body = await readFile("tests/fixtures/revisit/original.png");
  await page.route("**/media/*.jpg", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body }),
  );
});

for (const width of [320, 390, 768, 1280]) {
  test(`landing fits ${width}px and keeps report/evidence paths accessible`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Take a walk.Look a littlecloser.",
    );
    await expect(
      page.getByRole("link", { name: "Report an issue", exact: true }).first(),
    ).toHaveAttribute("href", "/app/report");
    await expect(page.locator(".landing-photo-main img")).toHaveJSProperty(
      "complete",
      true,
    );
    expect(
      await page
        .locator(".landing-photo-main img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page
      .getByRole("link", { name: "See a real revisit", exact: true })
      .click();
    await expect(page).toHaveURL(/#real-revisit$/);
    await expect(
      page.getByRole("link", { name: "Follow the complete history" }),
    ).toHaveAttribute("href", "/app/issues/FI-000007/evidence");
  });
}

test("saved photo switch works by keyboard without calling model endpoints", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET" && request.url().includes("/v1/"))
      writes.push(request.url());
  });
  await page.goto("/#real-revisit");
  const original = page.getByRole("button", { name: "Original 9 Oct" });
  const revisit = page.getByRole("button", { name: "Return visit 10 Oct" });
  await original.focus();
  await original.press("Tab");
  await expect(revisit).toBeFocused();
  await revisit.press("Enter");
  await expect(revisit).toHaveAttribute("aria-pressed", "true");
  await expect(original).toHaveAttribute("aria-pressed", "false");
  await expect(
    page.locator(".landing-viewer-image img:visible"),
  ).toHaveAttribute(
    "alt",
    "Return photo of the same cut tree, dry branches and litter from a different angle",
  );
  await expect(page.locator(".landing-viewer figcaption")).toContainText(
    "10 October 2026",
  );
  await original.click();
  await expect(
    page.locator(".landing-viewer-image img:visible"),
  ).toHaveAttribute(
    "alt",
    "Original report photo: a cut tree surrounded by dry branches and scattered litter in Lucknow",
  );
  expect(writes).toEqual([]);
});

test("reduced motion shows content without photo transforms or hidden reveals", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator(".landing-photo-main")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".landing-photo-return")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".landing-loop-heading")).toHaveCSS("opacity", "1");
  await expect(page.locator(".landing-trust-heading")).toHaveCSS(
    "opacity",
    "1",
  );
});

test("removed landing photos show an unavailable state without a static fallback", async ({
  page,
}) => {
  await page.route("**/media/*.jpg", (route) =>
    route.fulfill({ status: 404, body: "Removed" }),
  );
  await page.goto("/");
  await expect(page.locator(".landing-photo-main")).toContainText(
    "Photo unavailable",
  );
  await expect(page.locator(".landing-photo-main img")).toHaveCount(0);
  await expect(page.locator('img[src^="/assets/evidence/"]')).toHaveCount(0);
});

test("landing media sends the configured operator token without putting it in image URLs", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("fieldissue-token", "isolated-landing-token"),
  );
  const authorizations: (string | undefined)[] = [];
  const body = await readFile("tests/fixtures/revisit/original.png");
  await page.route("**/media/*.jpg", async (route) => {
    const auth = route.request().headers().authorization;
    authorizations.push(auth);
    await route.fulfill(
      auth === "Bearer isolated-landing-token"
        ? { status: 200, contentType: "image/png", body }
        : { status: 401, body: "Access required" },
    );
  });
  await page.goto("/");
  await expect(page.locator(".landing-photo-main img")).toHaveAttribute(
    "src",
    /^blob:/,
  );
  await expect(page.locator(".landing-photo-return img")).toHaveAttribute(
    "src",
    /^blob:/,
  );
  expect(authorizations).toEqual([
    "Bearer isolated-landing-token",
    "Bearer isolated-landing-token",
  ]);
});
