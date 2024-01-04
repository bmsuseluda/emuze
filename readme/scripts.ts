import { categories } from "~/server/categoriesDB.server";

export const createSystemsTable = () =>
  Object.values(categories)
    .map((category) => {
      return `| ${category.names[0]} | ${category.applications
        .map((application) => application.name)
        .join("<br>")} | ${category.defaultApplication.name} |`;
    })
    .join("\n");
