import { Appearance } from "~/types/settings/appearance";
import { readFile, writeFile } from "./readWriteData.server";

export type Categories = typeof categories;

export const categories = [
  {
    id: "appearance",
    name: "Appearance",
  },
];

export const paths = {
  appearance: "data/settings/appearance.json",
};

export const readAppearance = (): Appearance => readFile(paths.appearance);

export const writeAppearance = (appearance: Appearance) =>
  writeFile(appearance, paths.appearance);
