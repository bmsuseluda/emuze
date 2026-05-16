import type { Locator, Page } from "@playwright/test";

export class SettingsAboutPage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "About";
  readonly github: Locator;
  readonly releasenotes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
    this.github = this.page.getByRole("link", { name: "GitHub" });
    this.releasenotes = this.page.getByRole("link", { name: "Release Notes" });
  }
}
