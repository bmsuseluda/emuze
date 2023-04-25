import type { PlatformId } from "./platforms";

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
  // TODO: remove and use data from applicationDB
  applicationFlatpakId?: string;
  // TODO: remove and use data from applicationDB
  applicationFlatpakOptionParams?: string[];
  entryPath: string;
  // TODO: remove and use data from applicationDB
  fileExtensions: string[];
  // TODO: remove and use data from categoriesDB
  igdbPlatformIds: number[];
  entries?: Entry[];
}
