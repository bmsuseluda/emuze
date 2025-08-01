import { expect, type Locator, type Page } from "@playwright/test";
import type { TestName } from "../tests/ports.js";
import { ports } from "../tests/ports.js";
import { GameVersionsPage } from "./gameVersionsPage.js";

export class LibraryPage {
  readonly page: Page;
  readonly lastPlayed = "Last Played";
  readonly initialSystem = "Arcade";
  readonly launchGameButton: Locator;
  readonly noInstalledEmulatorsButton: Locator;
  readonly importGamesButton: Locator;
  readonly gameVersionsPage: GameVersionsPage;
  readonly loadingModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.launchGameButton = page.getByRole("button", {
      name: "Launch Game",
    });
    this.noInstalledEmulatorsButton = page.getByRole("button", {
      name: "No installed Emulators",
    });
    this.importGamesButton = page.getByRole("button", {
      name: "Import Games",
    });
    this.gameVersionsPage = new GameVersionsPage(page);
    this.loadingModal = page.getByRole("img", { name: "Logo pulse animation" });
  }

  async goto(testName: TestName) {
    const port = ports[testName].toString();
    await this.page.goto(`http://127.0.0.1:${port}/invalidateCaches`);
  }

  async press(key: string) {
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(250);
  }

  async goToSystemViaClick(systemName: string, gameName?: string) {
    const link = this.page.getByRole("link", {
      name: systemName,
    });
    await expect(link).toBeVisible();
    // TODO: instead of toBeFocused it needs to check if link has accent color
    // await expect(link).not.toBeFocused();
    await expect(
      this.page.getByRole("heading", { name: systemName }),
    ).not.toBeVisible();

    if (gameName) {
      await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).not.toBeVisible();
    }

    await link.click();

    await this.expectIsSystem(systemName, gameName);
  }

  async expectIsSystem(systemName: string, gameName?: string) {
    const link = this.page.getByRole("link", {
      name: systemName,
    });

    await expect(
      this.page.getByRole("heading", { name: systemName }),
    ).toBeVisible();
    await expect(link).toBeVisible();

    if (gameName) {
      await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).toBeVisible();
    }
  }

  async expectGameFocused(gameName: string) {
    await expect(
      this.page.getByRole("radio", { name: gameName }),
    ).toBeFocused();
  }

  async gotToInitialSystem() {
    await this.goToSystemViaClick(this.initialSystem);
  }
  async goToLastPlayed() {
    await this.goToSystemViaClick(this.lastPlayed);
  }

  async expectIsInitialSystem() {
    await this.expectIsSystem(this.initialSystem);
  }

  async expectIsLastPlayed() {
    await this.expectIsSystem(this.lastPlayed);
  }
}
