import type { Category, Entry } from "~/types/jsonFiles/category";
import type { GeneralConfigured } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import type { ApplicationId } from "~/server/applicationsDB.server/index";

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

export interface Application {
  id: ApplicationId;
  name: string;
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
