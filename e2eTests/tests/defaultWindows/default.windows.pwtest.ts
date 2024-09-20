import { expect, test } from "../../pages/fixture";
import nodepath from "path";
import fs from "fs-extra";
import { configFolderPath, e2ePath, testName } from "./config";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  fs.rmSync(configFolderPath, { recursive: true, force: true });
  fs.copySync(nodepath.join(e2ePath, "config"), configFolderPath);
});

test.beforeEach(async ({ libraryPage }) => {
  await libraryPage.goto(testName);
});

test("Should show initial system", async ({ page, libraryPage }) => {
  await expect(page.getByRole("heading", { name: "emuze" })).toBeVisible();
  const title = await page.title();
  expect(title).toBe("emuze");
  await libraryPage.expectIsInitialSystem();

  await expect(page).toHaveScreenshot();
});

test("Should switch to another system via click", async ({ libraryPage }) => {
  await libraryPage.goToSystemViaClick(
    "Sega Master System",
    "Sonic the Hedgehog",
  );

  await libraryPage.gotToInitialSystem();
});

test("Should switch to another system via key down", async ({
  libraryPage,
}) => {
  await libraryPage.expectIsInitialSystem();

  await libraryPage.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");

  await libraryPage.gotToInitialSystem();
});

test("Should open settings via mouse", async ({ page, settingsPage }) => {
  await settingsPage.openSettingsViaClick();
  await expect(
    settingsPage.generalPage.installEmulatorsButton,
  ).not.toBeVisible();

  await expect(page).toHaveScreenshot();

  await settingsPage.goToSubPageViaClick(settingsPage.appearancePage.name);

  await settingsPage.closeSettingsViaClick();
});

test("Should open settings via keyboard and activate appearance options", async ({
  settingsPage,
}) => {
  await settingsPage.openSettingsAndActivateAppearanceSettings();
});

test("Should check if focus history is valid after settings closed", async ({
  libraryPage,
}) => {
  await libraryPage.expectIsInitialSystem();

  await libraryPage.press("ArrowDown");

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");
});

test("import all", async ({ page, libraryPage, settingsPage }) => {
  const playstationSystemName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationSystemName,
  });

  await expect(playstationLink).not.toBeVisible();

  await settingsPage.openSettingsViaClick(true);
  await settingsPage.generalPage.importAllButton.click();
  await settingsPage.closeSettingsViaClick(true);

  await libraryPage.goToSystemViaClick(playstationSystemName, "Gex");
});
