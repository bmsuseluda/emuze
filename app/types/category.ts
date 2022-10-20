import type { PlatformId } from "./platforms";

export interface Entry {
  id: string;
  name: string;
  path: string;
  imageUrl?: string;
}

export type Entries = Entry[];

export interface Category {
  id: PlatformId;
  name: string;
  applicationId: string;
  applicationPath?: string;
  applicationFlatpakId?: string;
  applicationFlatpakOptionParams?: string[];
  entryPath: string;
  fileExtensions: string[];
  igdbPlatformIds: number[];
  entries?: Entries;
}

export type Categories = Category[];
