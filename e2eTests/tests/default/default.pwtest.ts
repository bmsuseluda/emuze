import { expect, test } from "../../pages/fixture.js";
import nodepath from "node:path";
import fs from "fs-extra/esm";
import { configFolderPath, e2ePath, testName } from "./config.js";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  fs.removeSync(configFolderPath);
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

  await libraryPage.press("ArrowRight");
  await libraryPage.expectGameFocused("Battletoads");
  await libraryPage.press("ArrowRight");
  await libraryPage.expectGameFocused("Beast Busters");

  await expect(page).toHaveScreenshot();

  await libraryPage.press("Backspace");
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
  await expect(settingsPage.generalPage.installEmulatorsButton).toBeVisible();

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
  await libraryPage.press("ArrowDown");
  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");

  const playstationSystemName = "Playstation";
  const playstationLink = page.getByRole("link", {
    name: playstationSystemName,
  });

  await expect(playstationLink).not.toBeVisible();

  await settingsPage.openSettingsViaClick(true);
  await libraryPage.press("i");
  await settingsPage.closeSettingsViaClick(true);

  await libraryPage.expectIsSystem("Game Boy", "Super Mario Land");

  await libraryPage.goToSystemViaClick(playstationSystemName, "Gex");
});

test("game versions", async ({ libraryPage }) => {
  await libraryPage.goToSystemViaClick("Playstation", "Gex");
  await libraryPage.press("ArrowRight");
  await libraryPage.expectGameFocused("Gex");
  await libraryPage.press("Enter");

  await libraryPage.gameVersionsPage.testGameVersionsPage();
  await libraryPage.expectIsSystem("Playstation", "Gex");
});

test("Should open the about page", async ({ page, settingsPage }) => {
  await settingsPage.openSettingsViaClick(true);
  await settingsPage.goToSubPageViaClick(settingsPage.aboutPage.name);
  await expect(settingsPage.aboutPage.github).toBeVisible();
  await settingsPage.press("ArrowRight");
  await settingsPage.press("ArrowDown");
  await expect(settingsPage.aboutPage.changelog).toBeFocused();
  await expect(page).toHaveScreenshot();
});

// TODO: add offline test
