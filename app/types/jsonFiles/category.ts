import type { PlatformId } from "~/server/categoriesDB.server";
import type { Application } from "~/types/jsonFiles/applications";

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
  entryPath: string;
  entries?: Entry[];
}
