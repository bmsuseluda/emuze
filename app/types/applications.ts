import type { Category } from "~/server/categoriesDB.server";

// TODO: Check how to align with database types
export interface Application {
  id: string;
  name: string;
  path?: string;
  flatpakId?: string;
  flatpakOptionParams?: string[];
  categories: Category[];
  fileExtensions: string[];
  optionParams?: string[];
}

export type Applications = Application[];
