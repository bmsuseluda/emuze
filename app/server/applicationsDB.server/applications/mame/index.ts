import fs from "node:fs";
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
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { log } from "../../../debug.server.js";
import { createPorts, type ConfigFile } from "./config.js";
import { writeConfig } from "../../configFile.js";

const flatpakId = "org.mamedev.MAME";
const applicationId: ApplicationId = "mame";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "mame.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const defaultConfigFileName = "default.cfg";

const defaultConfigPathRelative = nodepath.join("cfg", defaultConfigFileName);

const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );

const getDefaultConfigFilePath = () =>
  getConfigFilePath(defaultConfigPathRelative);

const findMameArcadeGameName: FindEntryNameFunction = ({ entry: { name } }) =>
  findGameNameById(name, mameGames, "mame");

const readXmlConfigFile = (filePath: string) => {
  try {
    const file = fs.readFileSync(filePath, "utf8");
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    return parser.parse(file);
  } catch (error) {
    log("debug", "mame", "config file can not be read.", filePath, error);
    return {};
  }
};

const readDefaultConfigFile = () =>
  readXmlConfigFile(getDefaultConfigFilePath()) as ConfigFile;

const replaceDefaultConfigFile = () => {
  const fileContent = readDefaultConfigFile();
  log("debug", "mame", "config file", fileContent);
  const fileContentNew: ConfigFile = {
    ...fileContent,
    mameconfig: {
      ...fileContent.mameconfig,
      system: {
        ...fileContent.mameconfig.system,
        input: {
          ...fileContent.mameconfig.system.input,
          port: createPorts([
            ["POWER_ON", "NONE"],
            ["POWER_OFF", "NONE"],
            ["UI_MENU", "KEYCODE_F2"],
          ]),
        },
      },
    },
  };

  const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
  const xmlContent = builder.build(fileContentNew);

  writeConfig(getDefaultConfigFilePath(), xmlContent);
};

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { name },
  settings: {
    general: { categoriesPath },
    appearance: { fullscreen },
  },
}) => {
  replaceDefaultConfigFile();

  const entryDirname = nodepath.join(categoriesPath, name);
  const optionParams = [];

  optionParams.push(
    ...["-rompath", entryDirname],
    ...[
      "-cfg_directory",
      nodepath.join(emulatorsConfigDirectory, applicationId, "cfg"),
    ],
    ...[
      "-nvram_directory",
      nodepath.join(emulatorsConfigDirectory, applicationId, "nvram"),
    ],
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
