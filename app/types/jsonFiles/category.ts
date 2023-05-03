import type { PlatformId } from "~/server/categoriesDB.server";

export interface Entry {
  id: string;
  name: string;
  path: string;
  imageUrl?: string;
}

export interface Category {
  id: PlatformId;
  name: string;
  applicationId: string;
  applicationPath?: string;
  entryPath: string;
  entries?: Entry[];
}
