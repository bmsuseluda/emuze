import { expect, type Locator, type Page } from "@playwright/test";
import { ports, TestName } from "../tests/ports";

export class LibraryPage {
  readonly page: Page;
  readonly lastPlayed = "Last Played";
  readonly initialSystem = "Arcade";
  readonly launchGameButton: Locator;
  readonly noInstalledEmulatorsButton: Locator;
  readonly importGamesButton: Locator;

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
  }

  async goto(testName: TestName) {
    const port = ports[testName].toString();
    await this.page.goto(`http://127.0.0.1:${port}/invalidateCaches`);
  }

  async press(key: string) {
    await this.page.keyboard.press(key);
    await this.page.waitForTimeout(200);
  }

  async goToSystemViaClick(systemName: string, gameName?: string) {
    const link = this.page.getByRole("link", {
      name: systemName,
    });
    await expect(link).toBeVisible();
    await expect(link).not.toBeFocused();
    await expect(
      this.page.getByRole("heading", { name: systemName }),
    ).not.toBeVisible();

    gameName &&
      (await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).not.toBeVisible());

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

    gameName &&
      (await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).toBeVisible());
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
