import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import {
  findConfigFile,
  getFlatpakConfigPath,
  writeConfig,
} from "../../configFile";
import fs from "fs";
import { homedir } from "os";
import { log } from "../../../debug.server";
import type { Config, InputConfig } from "./config";
import { defaultConfig, defaultInputConfig } from "./config";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";

const flatpakId = "org.ryujinx.Ryujinx";
const configFileName = "Config.json";

/**
 * look into application folder for config file, if not then home folder
 */
export const getWindowsConfigFilePath = (
  configFileName: string,
  applicationPath?: string,
) => {
  if (applicationPath) {
    const applicationDirectory = nodepath.dirname(applicationPath);
    const configFilePath = findConfigFile(applicationDirectory, configFileName);
    const portableExists = fs.existsSync(
      nodepath.join(applicationDirectory, "portable"),
    );

    if (portableExists) {
      if (configFilePath) {
        return configFilePath;
      }
      return nodepath.join(applicationDirectory, configFileName);
    }
  }

  return nodepath.join(
    homedir(),
    "AppData",
    "Roaming",
    "Ryujinx",
    configFileName,
  );
};

export const getConfigFilePath = (
  flatpakId: string,
  configFileName: string,
  applicationPath?: string,
) => {
  if (isWindows()) {
    return getWindowsConfigFilePath(configFileName, applicationPath);
  } else {
    return nodepath.join(
      getFlatpakConfigPath(flatpakId),
      "Ryujinx",
      configFileName,
    );
  }
};

/**
 * Excludes
 * - Updates
 * - DLCs
 * - digital files if physical files exist
 */
export const excludeFiles: ExcludeFilesFunction = (filePaths) =>
  filePaths.filter(
    (filePath) =>
      filePath.includes("[UPD]") ||
      filePath.includes("[DLC]") ||
      (filePath.includes("[BASE]") &&
        !!filePaths.find(
          (otheFilePath) =>
            otheFilePath.startsWith(
              filePath.split("[")[0].replace(versionNumberRegExp, "").trim(),
            ) && otheFilePath.endsWith(".xci"),
        )),
  );

const versionNumberRegExp = /\d{1,3}(.\d{1,3}){1,2}/;

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
  { stringToReplace: "_", replaceWith: "" },
  { stringToReplace: versionNumberRegExp, replaceWith: "" },
];

/**
 * Normalize the name from filename.
 * - Removes underscore
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

const readConfigFile = (filePath: string) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as Config;
  } catch (error) {
    log(
      "debug",
      "ryujinx",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultConfig;
  }
};

const splitStringByIndices = (str: string, indices: number[]): string[] => {
  const result: string[] = [];
  let start = 0;

  indices.forEach((index) => {
    result.push(str.slice(start, index));
    start = index;
  });

  result.push(str.slice(start));
  return result;
};

export const createControllerId = (sdlGuiId: string) => {
  const mapping = splitStringByIndices(sdlGuiId, [2, 4, 6, 8, 10, 12, 16, 20]);

  return `0-${mapping[3]}${mapping[2]}${mapping[1]}${mapping[0]}-${mapping[5]}${mapping[4]}-${mapping[6]}-${mapping[7]}-${mapping[8]}`;
};

const createInputConfig = (
  sdlDevice: Sdl.Controller.Device,
  index: number,
): InputConfig => ({
  ...defaultInputConfig,
  id: createControllerId(sdlDevice.guid),
  player_index: `Player${index + 1}`,
});

const replaceConfig = (applicationPath?: string) => {
  // TODO: set game dirs ?

  const gamepads = sdl.controller.devices;
  const inputConfig = gamepads.map(createInputConfig);

  const filePath = getConfigFilePath(
    flatpakId,
    configFileName,
    applicationPath,
  );
  const fileContent = readConfigFile(filePath);

  const fileContentNew: Config = {
    ...fileContent,
    show_confirm_exit: false,
    hotkeys: {
      ...fileContent.hotkeys,
      show_ui: "F2",
      toggle_mute: "F6",
    },
    input_config: inputConfig,
  };
  writeConfig(filePath, JSON.stringify(fileContentNew));
};

export const ryujinx: Application = {
  id: "ryujinx",
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    applicationPath,
  }) => {
    replaceConfig(applicationPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    return optionParams;
  },
  excludeFiles,
  findEntryName,
};
