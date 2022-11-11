import type { General } from "~/types/settings/general";
import { readFileHome, writeFileHome } from "~/server/readWriteData.server";

export type Category = { id: string; name: string; to: string };

export const categories: Category[] = [
  {
    id: "general",
    name: "General",
    to: "general",
  },
];

export const paths = {
  general: "data/settings/general.json",
};

export const readGeneral = (): General => readFileHome(paths.general);

export const writeGeneral = (general: General) =>
  writeFileHome(general, paths.general);
