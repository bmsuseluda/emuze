import type {
  Application,
  FindEntryNameFunction,
  OptionParamFunction,
} from "~/server/applicationsDB.server/types";
import { findGameNameById } from "~/server/applicationsDB.server/nameMappings/findGameNameById";
import mameGames from "./nameMapping/mame.json";
import nodepath from "path";

const findMameArcadeGameName: FindEntryNameFunction = ({ entry: { name } }) =>
  findGameNameById(name, mameGames, "mame");

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { name },
  settings: {
    general: { categoriesPath },
  },
}) => {
  const entryDirname = nodepath.join(categoriesPath, name);
  return [
    "-w",
    "-rompath",
    entryDirname,
    "-cfg_directory",
    nodepath.join(entryDirname, "cfg"),
    "-nvram_directory",
    nodepath.join(entryDirname, "nvram"),
  ];
};

export const mame: Application = {
  id: "mame",
  name: "Mame",
  executable: "mame.exe",
  fileExtensions: [".zip", ".chd"],
  flatpakId: "org.mamedev.MAME",
  createOptionParams: getSharedMameOptionParams,
  findEntryName: findMameArcadeGameName,
};

export const mameNeoGeo: Application = {
  ...mame,
  id: "mameNeoGeo",
  excludeFiles: () => ["neogeo.zip"],
};

export const mameNeoGeoCD: Application = {
  ...mame,
  id: "mameNeoGeoCD",
  createOptionParams: (...props) => [
    ...getSharedMameOptionParams(...props),
    "neocdz",
    "-cdrm",
  ],
  excludeFiles: () => ["neocdz.zip"],
  findEntryName: undefined,
};
