import type { PlatformId } from "~/server/categoriesDB.server";
import type { Application } from "~/types/jsonFiles/applications";

export interface Entry {
  id: string;
  name: string;
  path: string;
  imageUrl?: string;
}

export interface Category {
  id: PlatformId;
  name: string;
  application?: Application;
  entryPath: string;
  entries?: Entry[];
}
