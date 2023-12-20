import type { PlatformId } from "~/server/categoriesDB.server";
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
  id: PlatformId;
  name: string;
  application?: Application;
  entries?: Entry[];
}

export const createAbsoluteEntryPath = (
  categoriesPath: string,
  categoryName: string,
  entryPath: string,
) => nodepath.join(categoriesPath, categoryName, entryPath);
