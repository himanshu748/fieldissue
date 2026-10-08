import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0, // Live inference is opt-in and never automatically repeated.
  timeout: 180000,
  use: { baseURL: process.env.FIELDISSUE_E2E_URL, viewport: { width: 390, height: 844 }, trace: "off", screenshot: "off" },
});
