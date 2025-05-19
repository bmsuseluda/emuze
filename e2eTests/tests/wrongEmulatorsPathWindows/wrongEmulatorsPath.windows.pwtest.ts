import {expect, test} from "../../pages/fixture.js";
import nodepath from "node:path";
import fs from "fs-extra/esm";
import {configFolderPath, e2ePath, testName} from "./config.js";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  fs.removeSync(configFolderPath);
  fs.copySync(nodepath.join(e2ePath, "config"), configFolderPath);
});

test.beforeEach(async ({ libraryPage }) => {
  await libraryPage.goto(testName);
});

test("Should show settings on launch game", async ({
  page,
  libraryPage,
  settingsPage,
}) => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();
  await libraryPage.launchGameButton.click();

  await expect(settingsPage.generalPage.headline).toBeVisible();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await libraryPage.press("ArrowDown");
  await expect(settingsPage.appearancePage.headline).toBeVisible();

  await settingsPage.closeSettingsViaClick();
});

test("Should show settings on Import games", async ({
  page,
  libraryPage,
  settingsPage,
}) => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();
  await libraryPage.importGamesButton.click();

  await expect(settingsPage.generalPage.headline).toBeVisible();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await settingsPage.closeSettingsViaClick();
});

test("Should show error on general page", async ({ page, settingsPage }) => {
  await settingsPage.openSettingsViaClick();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();

  await settingsPage.generalPage.importAllButton.click();
  await expect(settingsPage.generalPage.romsPathNotExistError).toBeVisible();
  await expect(
    settingsPage.generalPage.emulatorsPathNotExistError,
  ).toBeVisible();
  await expect(page).toHaveScreenshot();
});
