import type { Required } from "utility-types";

export interface General {
  categoriesPath?: string;
  biosPath?: string;
}

export type GeneralConfigured = Required<General, "categoriesPath">;

export const isGeneralConfigured = (
  generalData: General | null,
): generalData is GeneralConfigured => !!generalData?.categoriesPath;
