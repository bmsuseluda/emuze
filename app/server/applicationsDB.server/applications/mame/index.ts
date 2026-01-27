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
import { createPorts, defaultConfig, type ConfigFile } from "./config.js";
import { writeConfig } from "../../configFile.js";
import { mameDefaultConfig } from "./mameDefaultConfig.js";
import type { SystemId } from "../../../categoriesDB.server/systemId.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const flatpakId = "org.mamedev.MAME";
const applicationId: ApplicationId = "mame";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "mame.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const defaultConfigFileName = "default.cfg";
const mameConfigFileName = "mame.ini";

const defaultConfigPathRelative = nodepath.join("cfg", defaultConfigFileName);

const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );

const getDefaultConfigFilePath = () =>
  getConfigFilePath(defaultConfigPathRelative);
const getMameConfigFilePath = () => getConfigFilePath(mameConfigFileName);

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
    return defaultConfig;
  }
};

const readDefaultConfigFile = () =>
  readXmlConfigFile(getDefaultConfigFilePath()) as ConfigFile;

const replaceDefaultConfigFile = (systemId: SystemId) => {
  const fileContent = readDefaultConfigFile();

  const fileContentNew: ConfigFile = {
    ...fileContent,
    mameconfig: {
      ...fileContent?.mameconfig,
      system: {
        ...fileContent?.mameconfig?.system,
        input: {
          ...fileContent?.mameconfig?.system?.input,
          port: createPorts([
            ["UI_MENU", "KEYCODE_F2"],
            ["UI_SAVE_STATE_QUICK", "KEYCODE_F1"],
            ["UI_LOAD_STATE_QUICK", "KEYCODE_F3"],
            ["TOGGLE_FULLSCREEN", "KEYCODE_F11"],
            ["SERVICE", "JOYCODE_1_BUTTON2 JOYCODE_1_SELECT OR KEYCODE_TAB"],
            [
              "UI_FAST_FORWARD",
              systemId === "neogeocd" ? "JOYCODE_1_SLIDER1_NEG_SWITCH" : "NONE",
            ],
            ["UI_HELP", "NONE"],
            ["POWER_ON", "NONE"],
            ["POWER_OFF", "NONE"],
            ["MEMORY_RESET", "NONE"],
            ["UI_SAVE_STATE", "NONE"],
            ["UI_LOAD_STATE", "NONE"],
            ["UI_RESET_MACHINE", "NONE"],
            ["UI_SOFT_RESET", "NONE"],
            ["UI_TAPE_START", "NONE"],
            ["UI_TAPE_STOP", "NONE"],
            ["UI_AUDIT", "NONE"],
          ]),
        },
      },
    },
  };

  const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
  const xmlContent = builder.build(fileContentNew);

  writeConfig(getDefaultConfigFilePath(), xmlContent);
};

const replaceMameConfigFile = () => {
  const mameConfigFilePath = getMameConfigFilePath();
  if (!fs.existsSync(mameConfigFilePath)) {
    writeConfig(mameConfigFilePath, mameDefaultConfig);
  }
};

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { id, name },
  settings: {
    general: { categoriesPath },
    appearance: { fullscreen },
  },
}) => {
  replaceMameConfigFile();
  replaceDefaultConfigFile(id);

  const entryDirname = nodepath.join(categoriesPath, name);
  const optionParams = [];

  const configDirectory = nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
  );

  optionParams.push(
    ...["-rompath", entryDirname],
    ...["-inipath", configDirectory],
    ...["-cfg_directory", nodepath.join(configDirectory, "cfg")],
    ...["-nvram_directory", nodepath.join(configDirectory, "nvram")],
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
    ...sdlGameControllerConfig,
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
