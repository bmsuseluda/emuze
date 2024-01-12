import type { General } from "~/types/jsonFiles/settings/general";
import type { Appearance } from "~/types/jsonFiles/settings/appearance";
import { FileDataCache } from "~/server/FileDataCache.server";

export type Category = { id: string; name: string; to: string };

export const categories: Category[] = [
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
];

export const paths = {
  general: "data/settings/general.json",
  appearance: "data/settings/appearance.json",
};

const generalDataCache = new FileDataCache<General>(paths.general);
export const readGeneral = () => {
  const testDataPath = process.env.EMUZE_TEST_DATA_PATH;
  const testEmulatorsPath = process.env.EMUZE_TEST_EMULATORS_PATH;
  const result = generalDataCache.readFile();

  if (result) {
    return {
      ...result,
      categoriesPath: testDataPath || result.categoriesPath,
      applicationsPath: testEmulatorsPath || result.applicationsPath,
    };
  }

  return generalDataCache.readFile();
};
export const writeGeneral = (general: General) =>
  generalDataCache.writeFile(general);

const appearanceDataCache = new FileDataCache<Appearance>(paths.appearance);
export const readAppearance = () => appearanceDataCache.readFile() || {};
export const writeAppearance = (appearance: Appearance) =>
  appearanceDataCache.writeFile(appearance);
