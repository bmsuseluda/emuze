import fs from "node:fs";
import type {
  Application,
  DetectedRequiredFile,
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

const createBiosRompath = (biosFiles?: DetectedRequiredFile[]) =>
  biosFiles ? `${nodepath.dirname(biosFiles.at(0)!.filePath)};` : "";

const getSharedMameOptionParams: OptionParamFunction = ({
  categoryData: { id, name },
  settings: {
    general: { categoriesPath },
    appearance: { fullscreen },
  },
  biosFiles,
}) => {
  replaceMameConfigFile();
  replaceDefaultConfigFile(id);

  const entryDirname = nodepath.join(categoriesPath, name);
  const optionParams = [];

  const configDirectory = nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
  );

  const extraRomPath = createBiosRompath(biosFiles);

  optionParams.push(
    ...["-rompath", `${extraRomPath}${entryDirname}`],
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
  // TODO: Remove when bios files are not in roms folder anymore
  excludeFiles: () =>
    mameNeoGeo.biosFiles!.flatMap(({ requiredFiles }) =>
      requiredFiles.map(({ filename }) => filename),
    ),
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "uni-bios.rom",
          hash: "e016ce75097df0b5f5910e8eb4914439f5c77511de65df5a1e089eef147b256b",
        },
        {
          filename: "neogeo.zip",
          hash: "095f3324012226d67a968b4cb5bf291d96622228f74915deddd61a66985e3969",
        },
      ],
    },
  ],
};

export const mameNeoGeoCD: Application = {
  ...mame,
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (props) => [
    ...getSharedMameOptionParams(props),
    "neocdz",
    "-cdrm",
  ],
  // TODO: Remove when bios files are not in roms folder anymore
  excludeFiles: () =>
    mameNeoGeoCD.biosFiles!.flatMap(({ requiredFiles }) =>
      requiredFiles.map(({ filename }) => filename),
    ),
  findEntryName: undefined,
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "uni-bioscd.rom",
          hash: "1c3ec20824a58e5f5cbf47ccc2c91a10f34d21cfa2791b3413cea89b0c920db8",
        },
        {
          filename: "neocdz.zip",
          hash: "61c9a0034ad19fc7199ff87785e2818712ea01bf1633bf9315166ffac9669a44",
        },
      ],
    },
  ],
};
