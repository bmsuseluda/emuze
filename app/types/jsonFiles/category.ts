import nodepath from "path";
import type { SystemId } from "../../server/categoriesDB.server/systemId";

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
  entries?: Entry[];
}

export type CategoryComplete = Required<Category>;

export const createAbsoluteEntryPath = (
  categoriesPath: string,
  categoryName: string,
  entryPath: string,
) => nodepath.join(categoriesPath, categoryName, entryPath);
