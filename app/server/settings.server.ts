import type { General } from "~/types/settings/general";
import type { Appearance } from "~/types/settings/appearance";
import { readFileHome, writeFileHome } from "~/server/readWriteData.server";

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

export const readGeneral = (): General => readFileHome(paths.general);
export const writeGeneral = (general: General) =>
  writeFileHome(general, paths.general);

export const readAppearance = (): Appearance =>
  readFileHome(paths.appearance) || {};
export const writeAppearance = (appearance: Appearance) =>
  writeFileHome(appearance, paths.appearance);
