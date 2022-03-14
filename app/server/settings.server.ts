import { General } from "~/types/settings/general";
import { readFile, writeFile } from "./readWriteData.server";

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

export const readGeneral = (): General => readFile(paths.general);

export const writeGeneral = (general: General) =>
  writeFile(general, paths.general);
