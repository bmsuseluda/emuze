import { baseUrl, URLS } from "cypress/support/commands/urls";

describe("component 'base'", () => {
  beforeEach(() => {
    cy.visitBase();
  });

  it("Should redirect to categories", () => {
    cy.url().should("eq", `${baseUrl}${URLS.CATEGORIES}`);
  });
});
