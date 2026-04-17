import type { Locator, Page } from "@playwright/test";

export class SettingsGeneralPage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "General";
  readonly romsPath: Locator;
  readonly romsPathNotExistError: Locator;
  readonly romsPathRequiredError: Locator;
  readonly importAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
    this.romsPath = page.getByRole("textbox", { name: "Roms Path" });
    this.romsPathNotExistError = page.getByText("The Roms Path does not exist");
    this.romsPathRequiredError = page.getByText("The Roms Path is missing");
    this.importAllButton = page.getByRole("button", { name: "Import all" });
  }
}
