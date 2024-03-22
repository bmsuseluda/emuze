import type { SystemId } from "~/server/categoriesDB.server/types";
import type { Application } from "~/types/jsonFiles/applications";
import nodepath from "path";

export interface MetaData {
  imageUrl?: string;
  expiresOn: number;
}

export interface Entry {
  id: string;
  name: string;
  path: string;
  metaData?: MetaData;
}

export interface Category {
  id: SystemId;
  name: string;
  application?: Application;
  entries?: Entry[];
}

export const createAbsoluteEntryPath = (
  categoriesPath: string,
  categoryName: string,
  entryPath: string,
) => nodepath.join(categoriesPath, categoryName, entryPath);
