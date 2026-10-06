import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2eTests/tests",
  testMatch: "*/*.pwtest.ts",
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  // workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
