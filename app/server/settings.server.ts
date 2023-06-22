import type { General } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import { readFileHome, writeFileHome } from "~/server/readWriteData.server";

export type Category = { id: string; name: string; to: string };

export const categories: Category[] = [
  {
    id: "general",
    name: "General",
    to: "general",
  },
  {
    id: "appearance",
    name: "Appearance",
    to: "appearance",
  },
];

type FilePath = "data/settings/general.json" | "data/settings/appearance.json";

type Paths = Record<string, FilePath>;

export const paths = {
  general: "data/settings/general.json",
  appearance: "data/settings/appearance.json",
} satisfies Paths;

type DataCachePool = Record<FilePath, unknown | null>;
const dataCachePool = {
  "data/settings/general.json": null as General | null,
  "data/settings/appearance.json": null as Appearance | null,
} satisfies DataCachePool;

type GenericDataCachePool = Record<string, unknown | null>;
const readFileHomeWithCaching = <T extends keyof typeof dataCachePool>(
  filePath: T
) => {
  if (!dataCachePool[filePath]) {
    dataCachePool[filePath] = readFileHome<(typeof dataCachePool)[T]>(filePath);
  }
  return dataCachePool[filePath];
};

const writeFileHomeWithCaching = <T extends keyof typeof dataCachePool>(
  filePath: T,
  content: (typeof dataCachePool)[T]
) => {
  writeFileHome(content, filePath);
  dataCachePool[filePath] = content;
};

export const readGeneral = () => readFileHomeWithCaching(paths.general);
export const writeGeneral = (general: General) =>
  writeFileHomeWithCaching(paths.general, general);

export const readAppearance = (): Appearance =>
  readFileHomeWithCaching(paths.appearance) || {};
export const writeAppearance = (appearance: Appearance) =>
  writeFileHomeWithCaching(paths.appearance, appearance);
