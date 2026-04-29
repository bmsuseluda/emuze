import type { Required } from "utility-types";

import type { Category, Entry } from "../../types/jsonFiles/category.js";
import type { GeneralConfigured } from "../../types/jsonFiles/settings/general.js";
import type { Appearance } from "../../types/jsonFiles/settings/appearance.js";
import type { ApplicationId } from "./applicationId.js";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
}

export interface DetectedRequiredFile {
  filePath: string;
  /**
   * could be a region, a specific system bios type or other system specific file
   */
  type: string;
}

export type OptionParamFunction = ({
  entryData,
  categoryData,
  applicationPath,
  settings,
  absoluteEntryPath,
  hasAnalogStick,
  biosFiles,
  otherRequiredFiles,
}: {
  entryData: Entry;
  categoryData: Category;
  applicationPath?: string;
  settings: Settings;
  absoluteEntryPath: string;
  hasAnalogStick: boolean;
  biosFiles?: DetectedRequiredFile[];
  otherRequiredFiles?: DetectedRequiredFile[];
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

export interface RequiredFile {
  filename: string;
  hash?: string;
}

export interface RequiredFiles {
  /**
   * could be a region, a specific system bios type or other system specific file
   */
  type: string;
  requiredFiles: RequiredFile[];
  //** TODO: Check if necessary */
  instructionMessage?: string;
}

export interface Application {
  id: ApplicationId;
  name: string;
  fileExtensions?: string[];
  searchFilesOnlyIn?: string[];
  entryAsDirectory?: boolean;
  configFile?: ConfigFile;
  omitAbsoluteEntryPathAsLastParam?: boolean;
  defineEnvironmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
  bundledPath: string;
  bundledBiosOpenSource?: boolean;
  /** only one is necessary */
  biosFiles?: RequiredFiles[];
  /** if they are defined, all of them are necessary to run the applciation */
  otherRequiredFiles?: RequiredFiles[];
}
