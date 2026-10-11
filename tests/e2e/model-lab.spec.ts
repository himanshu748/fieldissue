import { expect, test } from "@playwright/test";
test.skip(
  process.env.FIELDISSUE_LOCAL_E2E !== "1",
  "Uses the isolated local server and recorded results only",
);

test("recorded Tinker source and language filters preserve mistakes and empty states", async ({
  page,
  baseURL,
}) => {
  if (baseURL !== "http://127.0.0.1:3190")
    throw new Error("Refusing a non-local target");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/app/lab#tinker-examples");
  const section = page.locator("#tinker-examples");
  await expect(section.getByRole("status")).toHaveText(
    "Showing 234 of 234 notes.",
  );
  await section.getByLabel("Filter Tinker language").selectOption("hindi");
  await expect(section.getByRole("status")).toHaveText(
    "Showing 68 of 234 notes.",
  );
  await section
    .getByLabel("Filter Tinker source")
    .selectOption("public-source");
  await expect(
    section.getByText("No notes match these filters.", { exact: false }),
  ).toBeVisible();
  await section.getByLabel("Filter Tinker language").selectOption("english");
  await expect(section.getByRole("status")).toHaveText(
    "Showing 30 of 234 notes.",
  );
  await expect(
    section.getByRole("link", { name: "Original public source record" }),
  ).toHaveAttribute(
    "href",
    /^https:\/\/311\.boston\.gov\/open311\/v2\/requests\//,
  );
  await section.getByLabel("Filter Tinker source").selectOption("all");
  await section.getByLabel("Filter Tinker language").selectOption("all");
  await section.getByLabel("Filter Tinker result").selectOption("both_wrong");
  const selected = section.getByLabel("Choose a recorded note");
  if (await selected.count()) {
    await expect(
      section
        .getByText("Severity does not match the rubric target.", {
          exact: true,
        })
        .first(),
    ).toBeVisible();
    await section
      .getByText("Unmodified provider output", { exact: true })
      .click();
    await expect(section.locator("pre")).toContainText("zero_shot");
  } else {
    await expect(
      section.getByText("No notes match these filters.", { exact: false }),
    ).toBeVisible();
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});

test("TabPFN curve shows all five models and all measured metrics without inference", async ({
  page,
  baseURL,
}) => {
  if (baseURL !== "http://127.0.0.1:3190")
    throw new Error("Refusing a non-local target");
  await page.goto("/app/lab");
  const section = page.locator("#tabpfn-learning-curve");
  await expect(
    section.getByRole("heading", { name: "Where does TabPFN help?" }),
  ).toBeVisible();
  await expect(section.locator("tbody tr")).toHaveCount(6);
  await expect(section.locator("thead th")).toHaveCount(6);
  for (const metric of ["accuracy", "rocAuc", "brierScore", "logLoss"]) {
    await section.getByLabel("TabPFN curve metric").selectOption(metric);
    await expect(section.locator("tbody td").first()).not.toContainText(
      "Unavailable",
    );
  }
  await section.getByRole("img").scrollIntoViewIfNeeded();
  await expect(section.getByRole("img")).toHaveJSProperty("complete", true);
  expect(
    await section
      .getByRole("img")
      .evaluate((img: HTMLImageElement) => img.naturalWidth),
  ).toBeGreaterThan(0);
});
