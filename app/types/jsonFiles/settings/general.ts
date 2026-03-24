import type { Required } from "utility-types";

export interface General {
  applicationsPath?: string;
  categoriesPath?: string;
  biosPath?: string;
}

export type GeneralConfigured = Required<General, "categoriesPath">;
export type GeneralConfiguredWindows = Required<
  GeneralConfigured,
  "applicationsPath"
>;

export const isGeneralConfigured = (
  generalData: General | null,
): generalData is GeneralConfigured => !!generalData?.categoriesPath;
