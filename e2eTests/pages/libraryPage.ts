import { expect, Locator, Page } from "@playwright/test";

export class LibraryPage {
  readonly page: Page;
  readonly initialPlatform = "Arcade";
  readonly importAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.importAllButton = page.getByRole("button", { name: "Import all" });
  }

  async goToToPlatformViaClick(platformName: string, gameName?: string) {
    const link = this.page.getByRole("link", {
      name: platformName,
    });
    await expect(link).toBeVisible();
    await expect(link).not.toBeFocused();
    await expect(
      this.page.getByRole("heading", { name: platformName }),
    ).not.toBeVisible();

    gameName &&
      (await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).not.toBeVisible());

    await link.click();

    await this.expectIsPlatform(platformName, gameName);
  }

  async expectIsPlatform(platformName: string, gameName?: string) {
    const link = this.page.getByRole("link", {
      name: platformName,
    });

    await expect(
      this.page.getByRole("heading", { name: platformName }),
    ).toBeVisible();
    await expect(link).toBeVisible();

    gameName &&
      (await expect(
        this.page.getByRole("radio", { name: gameName }),
      ).toBeVisible());
  }

  async gotToInitialPlatform() {
    await this.goToToPlatformViaClick(this.initialPlatform);
  }

  async expectIsInitialPlatform() {
    await this.expectIsPlatform(this.initialPlatform);
  }
}
