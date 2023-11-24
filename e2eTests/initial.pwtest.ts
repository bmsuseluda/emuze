import { ElectronApplication, expect, Page, test } from "@playwright/test";
import { startApp } from "./startApp";
import nodepath from "path";
import fs from "fs";
import { GamesResponse, url } from "~/server/igdb.server";

test.describe.configure({ mode: "serial" });

const configFolderPath = nodepath.join(__dirname, "empty");
const testDataPath = nodepath.join(__dirname, "testData");

let app: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  const response = await startApp(configFolderPath);
  app = response.app;
  page = response.page;
});

test.afterAll(async () => {
  if (app) {
    await app.close();

    fs.rmSync(configFolderPath, { recursive: true, force: true });
  }
});

test("Should show initial config page", async () => {
  await expect(page.getByRole("heading", { name: "settings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  await expect(page.getByRole("button", { name: "close" })).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await test.step("Should prevent from closing the overlay", async () => {
    await page.keyboard.press("Escape");

    await expect(page.getByRole("heading", { name: "settings" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "General" })).toBeVisible();
  });

  await test.step("Should prevent from submiting without roms path", async () => {
    await page.getByRole("button", { name: "Import all" }).click();
    await expect(
      page.getByRole("textbox", { name: "Roms Path" }),
    ).toHaveScreenshot();

    // TODO: check of invalid state of input field
  });
});

test("Should import all", async () => {
  await page.route(url, async (route) => {
    const result: GamesResponse = {
      data: [],
    };
    await route.fulfill({ json: result });
  });

  await page.getByRole("textbox", { name: "Roms Path" }).fill(testDataPath);
  await page.getByRole("button", { name: "Import all" }).click();

  await expect(page.getByRole("button", { name: "close" })).toBeVisible();
  await page.getByRole("button", { name: "close" }).click();
  await expect(page.getByRole("heading", { name: "Arcade" })).toBeVisible();
});
