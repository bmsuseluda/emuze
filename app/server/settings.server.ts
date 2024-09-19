import type { General } from "../types/jsonFiles/settings/general";
import type { Appearance } from "../types/jsonFiles/settings/appearance";
import { FileDataCache } from "./FileDataCache.server";

export type SettingsID = "general" | "appearance";

export interface Category {
  id: SettingsID;
  name: string;
  to: SettingsID;
}

export const categories = [
  {
    id: "general",
    name: "General",
    to: "general",
  },
  {
    id: "appearance",
    name: "Appearance",
    to: "appearance",
  },
] satisfies Category[];

export const paths = {
  general: "data/settings/general.json",
  appearance: "data/settings/appearance.json",
} satisfies Record<SettingsID, string>;

const generalDataCache = new FileDataCache<General>(paths.general);
export const readGeneral = () => {
  const testRomsPath = process.env.EMUZE_TEST_ROMS_PATH;
  const testEmulatorsPath = process.env.EMUZE_TEST_EMULATORS_PATH;
  const result = generalDataCache.readFile();

  if (result) {
    return {
      ...result,
      categoriesPath: testRomsPath || result.categoriesPath,
      applicationsPath: testEmulatorsPath || result.applicationsPath,
    };
  }

  return generalDataCache.readFile();
};
export const writeGeneral = (general: General) =>
  generalDataCache.writeFile(general);
export const invalidateGeneralDataCache = () => {
  generalDataCache.invalidateCache();
};

const appearanceDataCache = new FileDataCache<Appearance>(paths.appearance);
export const readAppearance = () => appearanceDataCache.readFile() || {};
export const writeAppearance = (appearance: Appearance) =>
  appearanceDataCache.writeFile(appearance);
export const invalidateAppearanceDataCache = () => {
  appearanceDataCache.invalidateCache();
};
