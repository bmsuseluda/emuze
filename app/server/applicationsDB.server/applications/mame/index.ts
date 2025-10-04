import type {
  Application,
  FindEntryNameFunction,
  OptionParamFunction,
} from "../../types.js";
import { findGameNameById } from "../../nameMappings/findGameNameById.js";
import mameGames from "./nameMapping/mame.json" with { type: "json" };
import nodepath from "node:path";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";

const flatpakId = "org.mamedev.MAME";
const applicationId: ApplicationId = "mame";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "mame.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

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
  id: applicationId,
  name: "MAME",
  fileExtensions: [".zip", ".chd", ".cue"],
  flatpakId,
  defineEnvironmentVariables: () => ({
    SDL_ENABLE_SCREEN_KEYBOARD: "0",
  }),
  createOptionParams: getSharedMameOptionParams,
  findEntryName: findMameArcadeGameName,
  bundledPath,
};

export const mameNeoGeo: Application = {
  ...mame,
  fileExtensions: [".zip"],
  excludeFiles: () => ["neogeo.zip"],
};

export const mameNeoGeoCD: Application = {
  ...mame,
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (props) => [
    ...getSharedMameOptionParams(props),
    "neocdz",
    "-cdrm",
  ],
  excludeFiles: () => ["neocdz.zip"],
  findEntryName: undefined,
};
