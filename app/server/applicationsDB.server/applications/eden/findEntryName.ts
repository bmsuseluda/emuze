import type { FindEntryNameFunction } from "../../types.js";
import { versionNumberRegExp } from "./types.js";

const stringsToReplace: {
  stringToReplace: string | RegExp;
  replaceWith: string;
}[] = [
  { stringToReplace: "ACA NEOGEO", replaceWith: "ACA NEO GEO -" },
  { stringToReplace: "Arcade Archives", replaceWith: "Arcade Archives -" },
  {
    stringToReplace: "Johnny Turbo's Arcade",
    replaceWith: "Johnny Turbo's Arcade -",
  },
  {
    stringToReplace: "Bad Dudes",
    replaceWith: "Johnny Turbo's Arcade - Bad Dudes",
  },
  {
    stringToReplace: "SEGA AGES",
    replaceWith: "SEGA AGES -",
  },
  {
    stringToReplace: "SUPERBEAT XONiC EX",
    replaceWith: "SUPERBEAT - XONiC EX",
  },
  {
    stringToReplace: "Picross S MEGA DRIVE",
    replaceWith: "Picross S: Mega Drive",
  },
  { stringToReplace: versionNumberRegExp, replaceWith: "" },
];

/**
 * Normalize the name from filename.
 * - Removes Brackets []
 * - Removes Version numbers
 */
export const findEntryName: FindEntryNameFunction = ({ entry }) =>
  stringsToReplace
    .reduce(
      (name, { stringToReplace, replaceWith }) =>
        name.replace(stringToReplace, replaceWith),
      entry.name,
    )
    .split("[")[0]
    .trim();
