import type { Required } from "utility-types";

import type { Category, Entry } from "../../types/jsonFiles/category.js";
import type { GeneralConfigured } from "../../types/jsonFiles/settings/general.js";
import type { Appearance } from "../../types/jsonFiles/settings/appearance.js";
import type { ApplicationId } from "./applicationId.js";

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
}: {
  entry: Entry;
  categoriesPath: string;
  categoryName: string;
}) => string;

export type ExcludeFilesFunction = (filePaths: string[]) => string[];

export interface ConfigFile {
  basePath: string;
  /** file paths relative to the basePath */
  files: string[];
}

export interface Application {
  id: ApplicationId;
  name: string;
  executable?: `${string}.exe`;
  fileExtensions?: string[];
  searchFilesOnlyIn?: string[];
  entryAsDirectory?: boolean;
  configFile?: ConfigFile;
  omitAbsoluteEntryPathAsLastParam?: boolean;
  defineEnvironmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
  bundledPath?: string;
}
