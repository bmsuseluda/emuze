import type { General } from "~/types/jsonFiles/settings/general";

export type FocusElement =
  | "sidebar"
  | "main"
  | "settingsSidebar"
  | "settingsMain"
  | "errorDialog";

export const getFocusDefault = (general: General | null): FocusElement => {
  if (general?.applicationsPath || general?.categoriesPath) {
    return "sidebar";
  }
  return "settingsSidebar";
};

export const getFocusHistoryDefault = (
  general: General | null,
): FocusElement[] => {
  if (general?.applicationsPath || general?.categoriesPath) {
    return [];
  }
  return ["sidebar"];
};
