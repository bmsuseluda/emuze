import { expect, test } from "../../pages/fixture.js";
import nodepath from "node:path";
import fs from "fs-extra/esm";
import { configFolderPath, e2ePath, testName } from "./config.js";

test.describe.configure({ mode: "serial" });

const testRomsPath = nodepath.join(e2ePath, "testRoms");

test.beforeAll(async () => {
  fs.removeSync(configFolderPath);
});

test.beforeEach(async ({ libraryPage }) => {
  await libraryPage.goto(testName);
});

test("Should show initial config page", async ({ page, settingsPage }) => {
  await settingsPage.expectIsInitialSubPage();
  await expect(settingsPage.generalPage.romsPath).toBeVisible();
  await expect(
    settingsPage.generalPage.romsPathRequiredError,
  ).not.toBeVisible();
  await expect(settingsPage.generalPage.emulatorsPath).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await test.step("Should prevent from submitting without roms path", async () => {
    await settingsPage.generalPage.importAllButton.click();
    await expect(settingsPage.generalPage.romsPathRequiredError).toBeVisible();
    await expect(
      settingsPage.generalPage.page.getByRole("group", { name: "Roms Path" }),
    ).toHaveScreenshot();
  });
});

test("Should import all", async ({ page, libraryPage, settingsPage }) => {
  await settingsPage.generalPage.romsPath.fill(testRomsPath);
  await settingsPage.generalPage.importAllButton.click();
  await expect(libraryPage.loadingModal).toBeVisible();
  await expect(libraryPage.loadingModal).not.toBeVisible();

  await libraryPage.press("Escape");
  await libraryPage.expectIsInitialSystem();
  await expect(page).toHaveScreenshot();

  await libraryPage.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");
});
