import type { General } from "./jsonFiles/settings/general.js";

export type FocusElement =
  | "sidebar"
  | "main"
  | "settingsSidebar"
  | "settingsMain"
  | "errorDialog"
  | "gameDialog"
  | "closeDialog";

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
