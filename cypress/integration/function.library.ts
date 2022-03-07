import { baseUrl, URLS } from "cypress/support/commands/urls";

describe("component 'library'", () => {
  beforeEach(() => {
    cy.visitCategories();
  });

  const checkCategory = (
    getCategoryLink: () => Cypress.Chainable<JQuery<HTMLElement>>
  ) => {
    getCategoryLink().click();

    getCategoryLink().should("have.class", "active");
    getCategoryLink()
      .find("span")
      .then((span) => {
        cy.get("[data-testid='category.name']").should(
          "contain.text",
          span.text()
        );
      });

    cy.get("[data-testid='category.entries.length']").then((entryLength) => {
      cy.get("[data-testid^='category.entries.entry.link']").should(
        "have.length",
        entryLength.text().slice(2, -1)
      );
    });
  };

  it("Should load entries on click of a category", () => {
    cy.url().should("eq", `${baseUrl}${URLS.CATEGORIES}`);
    cy.get("[data-testid='categories.index.paragraph']").should(
      "exist",
      "be.visible"
    );

    const firstLink = () => cy.get("[data-testid^='categories.link']").first();
    checkCategory(firstLink);

    const lastLink = () => cy.get("[data-testid^='categories.link']").last();
    checkCategory(lastLink);

    cy.get("[data-testid='category.button.launch']").should("be.disabled");

    cy.get("[data-testid^='category.entries.entry']").first().click();
    cy.get("[data-testid^='category.entries.entry.link']")
      .first()
      .should("be.checked");
    cy.get("[data-testid='category.button.launch']").should("not.be.disabled");
  });
});
