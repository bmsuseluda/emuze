import nodepath from "node:path";
import type { SystemId } from "../../server/categoriesDB.server/systemId.js";

export interface MetaData {
  imageUrl?: string;
  expiresOn: number;
}

export interface Entry {
  id: string;
  name: string;
  path: string;
  metaData?: MetaData;
  subEntries?: Entry[];
}

export interface Category {
  id: SystemId;
  name: string;
  entries?: Entry[];
}

export const createAbsoluteEntryPath = (
  categoriesPath: string,
  categoryName: string,
  entryPath: string,
) => nodepath.join(categoriesPath, categoryName, entryPath);
