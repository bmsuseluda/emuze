import { Category } from "~/server/categoriesDB.server";

export interface Application {
  id: string;
  name: string;
  path: string;
  categories: Category[];
  fileExtensions: string[];
  optionParams?: string[];
}

export type Applications = Application[];
