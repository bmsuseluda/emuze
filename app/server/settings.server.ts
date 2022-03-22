import { General } from "~/types/settings/general";
import { readFileHome, writeFileHome } from "~/server/readWriteData.server";

export type Categories = typeof categories;

export const categories = [
  {
    id: "general",
    name: "General",
  },
];

export const paths = {
  general: "data/settings/general.json",
};

export const readGeneral = (): General => readFileHome(paths.general);

export const writeGeneral = (general: General) =>
  writeFileHome(general, paths.general);
