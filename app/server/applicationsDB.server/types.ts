import type { Required } from "utility-types";

import type { Category, Entry } from "../../types/jsonFiles/category";
import type { GeneralConfigured } from "../../types/jsonFiles/settings/general";
import type { Appearance } from "../../types/jsonFiles/settings/appearance";
import type { ApplicationId } from "./applicationId";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
}

export type OptionParamFunction = ({
  entryData,
  categoryData,
  applicationPath,
  settings,
  absoluteEntryPath,
  hasAnalogStick,
}: {
  entryData: Entry;
  categoryData: Category;
  applicationPath?: string;
  settings: Settings;
  absoluteEntryPath: string;
  hasAnalogStick: boolean;
}) => string[];

export type EnvironmentVariableFunction = ({
  categoryData,
  applicationPath,
  settings,
}: {
  categoryData: Category;
  applicationPath?: string;
  settings: Settings;
}) => Record<string, string | null>;

export interface InstalledApplication {
  id: ApplicationId;
  path?: string;
}

export type InstalledApplicationWindows = Required<
  InstalledApplication,
  "path"
>;

export type FindEntryNameFunction = ({
  entry,
  categoriesPath,
  categoryName,
  installedApplication,
}: {
  entry: Entry;
  categoriesPath: string;
  categoryName: string;
  installedApplication?: InstalledApplication;
}) => string;

export type ExcludeFilesFunction = (filenames: string[]) => string[];

export interface Application {
  id: ApplicationId;
  name: string;
  executable?: `${string}.exe`;
  fileExtensions?: `${string}.${string}`[];
  entryAsDirectory?: boolean;
  omitAbsoluteEntryPathAsLastParam?: boolean;
  setEnvironmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
}
