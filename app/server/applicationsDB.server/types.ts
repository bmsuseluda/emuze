import type { Category, Entry } from "~/types/jsonFiles/category";
import type { GeneralConfigured } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";

export type Settings = {
  general: GeneralConfigured;
  appearance: Appearance;
};

export type OptionParamFunction = ({
  entryData,
  categoryData,
  settings,
  absoluteEntryPath,
}: {
  entryData: Entry;
  categoryData: Category;
  settings: Settings;
  absoluteEntryPath: string;
}) => string[];

export type EnvironmentVariableFunction = (
  category: Category,
  settings: Settings,
) => Record<string, string | null>;

export type FindEntryNameFunction = ({
  entry,
  categoriesPath,
  categoryName,
}: {
  entry: Entry;
  categoriesPath: string;
  categoryName: string;
}) => string;

export type ExcludeFilesFunction = (filenames: string[]) => string[];

export type ApplicationId =
  | "duckstation"
  | "pcsx2"
  | "play"
  | "rpcs3"
  | "ppsspp"
  | "blastem"
  | "bsnes"
  | "snes9x"
  | "citra"
  | "melonds"
  | "desmume"
  | "dolphin"
  | "yuzu"
  | "ryujinx"
  | "cemu"
  | "nestopia"
  | "punes"
  | "mednafen"
  | "mame"
  | "mameNeoGeo"
  | "mameNeoGeoCD"
  | "ares"
  | "aresMegaDrive"
  | "aresSegaCd"
  | "aresSega32x"
  | "mupen64plus"
  | "rosaliesMupenGui"
  | "mgba"
  | "flycast"
  | "dosboxstaging"
  | "scummvm";

export interface Application {
  id: ApplicationId;
  name: string;
  executable?: `${string}.exe`;
  fileExtensions?: `${string}.${string}`[];
  entryAsDirectory?: boolean;
  omitAbsoluteEntryPathAsLastParam?: boolean;
  environmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
}
