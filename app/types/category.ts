export interface Entry {
  id: string;
  name: string;
  path: string;
  imageUrl?: string;
}

export type Entries = Entry[];

export interface Category {
  id: string;
  name: string;
  applicationId: string;
  applicationPath?: string;
  applicationFlatpakId?: string;
  entryPath: string;
  fileExtensions: string[];
  platformIds: number[];
  entries?: Entries;
}

export type Categories = Category[];
