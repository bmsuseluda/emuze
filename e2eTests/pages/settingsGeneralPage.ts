import type { Locator, Page } from "@playwright/test";

export class SettingsGeneralPage {
  readonly page: Page;
  readonly headline: Locator;
  readonly name = "General";
  readonly romsPath: Locator;
  readonly romsPathNotExistError: Locator;
  readonly romsPathRequiredError: Locator;
  readonly emulatorsPath: Locator;
  readonly emulatorsPathNotExistError: Locator;
  readonly emulatorsPathRequiredError: Locator;
  readonly importAllButton: Locator;
  readonly installEmulatorsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headline = this.page.getByRole("heading", {
      name: this.name,
    });
    this.romsPath = page.getByRole("textbox", { name: "Roms Path" });
    this.romsPathNotExistError = page.getByText("The Roms Path does not exist");
    this.romsPathRequiredError = page.getByText("The Roms Path is missing");
    this.emulatorsPath = page.getByRole("textbox", { name: "Emulators Path" });
    this.emulatorsPathNotExistError = page.getByText(
      "The Emulators Path does not exist",
    );
    this.emulatorsPathRequiredError = page.getByText(
      "The Emulators Path is missing",
    );
    this.importAllButton = page.getByRole("button", { name: "Import all" });
    this.installEmulatorsButton = page.getByRole("button", {
      name: "Install Emulators",
    });
  }
}
