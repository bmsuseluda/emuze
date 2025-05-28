import type {
  Application,
  FindEntryNameFunction,
  OptionParamFunction,
} from "../../types.js";
import { findGameNameById } from "../../nameMappings/findGameNameById.js";
import mameGames from "./nameMapping/mame.json" with { type: "json" };
import nodepath from "node:path";

const findMameArcadeGameName: FindEntryNameFunction = ({ entry: { name } }) =>
  findGameNameById(name, mameGames, "mame");

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { name },
  settings: {
    general: { categoriesPath },
    appearance: { fullscreen },
  },
}) => {
  const entryDirname = nodepath.join(categoriesPath, name);
  const optionParams = [];

  optionParams.push(
    ...["-rompath", entryDirname],
    ...["-cfg_directory", nodepath.join(entryDirname, "cfg")],
    ...["-nvram_directory", nodepath.join(entryDirname, "nvram")],
    "-skip_gameinfo",
    fullscreen ? "-nowindow" : "-window",
  );

  return optionParams;
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
  createOptionParams: async (props) => [
    ...(await getSharedMameOptionParams(props)),
    "neocdz",
    "-cdrm",
  ],
  excludeFiles: () => ["neocdz.zip"],
  findEntryName: undefined,
};
