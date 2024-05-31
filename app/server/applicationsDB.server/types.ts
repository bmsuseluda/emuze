import type { Category, Entry } from "../../types/jsonFiles/category";
import type { GeneralConfigured } from "../../types/jsonFiles/settings/general";
import type { Appearance } from "../../types/jsonFiles/settings/appearance";
import type { Application as InstalledApplication } from "../../types/jsonFiles/applications";
import type { ApplicationId } from "./applicationId";

export interface Settings {
  general: GeneralConfigured;
  appearance: Appearance;
}

export type OptionParamFunction = ({
  entryData,
  categoryData,
  settings,
  absoluteEntryPath,
  hasAnalogStick,
}: {
  entryData: Entry;
  categoryData: Category;
  settings: Settings;
  absoluteEntryPath: string;
  hasAnalogStick: boolean;
}) => string[];

export type EnvironmentVariableFunction = (
  category: Category,
  settings: Settings,
) => Record<string, string | null>;

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
  environmentVariables?: EnvironmentVariableFunction;
  createOptionParams?: OptionParamFunction;
  flatpakId: string;
  flatpakOptionParams?: string[];
  findEntryName?: FindEntryNameFunction;
  excludeFiles?: ExcludeFilesFunction;
}
