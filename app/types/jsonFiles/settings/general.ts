import type { Required } from "utility-types";

export type General = {
  applicationsPath?: string;
  categoriesPath?: string;
  isWindows?: boolean;
};

export type GeneralConfigured = Required<General, "categoriesPath">;

export const isGeneralConfigured = (
  generalData: General | null,
): generalData is GeneralConfigured => !!generalData?.categoriesPath;
