import type { Required } from "utility-types";

export type General = {
  applicationsPath?: string;
  categoriesPath?: string;
};

export type GeneralConfigured = Required<General, "categoriesPath">;
export type GeneralConfiguredWindows = Required<
  GeneralConfigured,
  "applicationsPath"
>;

export const isGeneralConfigured = (
  generalData: General | null,
): generalData is GeneralConfigured => !!generalData?.categoriesPath;
