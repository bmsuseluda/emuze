import { expect, type Locator, type Page } from "@playwright/test";

export class LibraryPage {
  readonly page: Page;
  readonly initialSystem = "Arcade";
  readonly launchGameButton: Locator;
  readonly noInstalledEmulatorsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.launchGameButton = page.getByRole("button", {
      name: "Launch Game",
    });
    this.noInstalledEmulatorsButton = page.getByRole("button", {
      name: "No installed Emulators",
    });
  }

  async goToToSystemViaClick(systemName: string, gameName?: string) {
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

  async gotToInitialSystem() {
    await this.goToToSystemViaClick(this.initialSystem);
  }

  async expectIsInitialSystem() {
    await this.expectIsSystem(this.initialSystem);
  }
}
