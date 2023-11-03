import { ElectronApplication, expect, Page, test } from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";

test.describe.configure({ mode: "serial" });

let app: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  const response = await startApp(nodepath.join(__dirname, "empty"));
  app = response.app;
  page = response.page;
});

test.afterAll(async () => {
  if (app) {
    await app.close();
  }
});

test("Should show initial config page", async () => {
  await expect(page.getByRole("heading", { name: "settings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  await expect(page.getByRole("button", { name: "close" })).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("heading", { name: "settings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
});
