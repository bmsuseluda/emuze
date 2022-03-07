import { baseUrl, URLS } from "./commands/urls";

declare global {
  namespace Cypress {
    interface Chainable {
      visitBase: () => Cypress.Chainable<Window>;
      visitCategories: () => Cypress.Chainable<Window>;
    }
  }
}

Cypress.Commands.add("visitBase", () => {
  cy.visit(baseUrl);
});

Cypress.Commands.add("visitCategories", () => {
  cy.visit(`${baseUrl}${URLS.CATEGORIES}`);
});
