import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types";
import nodepath from "path";
import { writeConfig } from "../../configFile";
import fs from "fs";
import { log } from "../../../debug.server";
import type { Config, InputConfig } from "./config";
import { defaultConfig, defaultInputConfig } from "./config";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { emulatorsDirectory } from "../../../homeDirectory.server";
import { keyboardConfig } from "./keyboardConfig";
import type { ApplicationId } from "../../applicationId";

const applicationId: ApplicationId = "ryujinx";
const flatpakId = "org.ryujinx.Ryujinx";
const bundledDirectory = nodepath.join(applicationId, "publish");
const bundledPathLinux = nodepath.join(bundledDirectory, "Ryujinx.sh");
const bundledPathWindows = nodepath.join(bundledDirectory, "Ryujinx.exe");
const configFolderPath = nodepath.join(emulatorsDirectory, applicationId);
const configFileName = "Config.json";
const configFilePath = nodepath.join(configFolderPath, configFileName);

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

const versionNumberRegExp = /\d{1,3}(\.\d{1,10}){1,2}/;

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
    stringToReplace: "SEGA AGES",
    replaceWith: "SEGA AGES -",
  },
  {
    stringToReplace: "Superbeat",
    replaceWith: "Superbeat -",
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

const replaceConfig = (switchRomsPath: string) => {
  const gamepads = sdl.controller.devices;
  const inputConfig =
    gamepads.length > 0 ? gamepads.map(createInputConfig) : [keyboardConfig];

  const oldConfig = readConfigFile(configFilePath);

  const newConfig: Config = {
    ...oldConfig,
    show_confirm_exit: false,
    check_updates_on_start: false,
    hotkeys: {
      ...oldConfig.hotkeys,
      show_ui: "F2",
      toggle_mute: "F6",
    },
    game_dirs: [switchRomsPath],
    autoload_dirs: [switchRomsPath],
    input_config: inputConfig,
  };
  writeConfig(configFilePath, JSON.stringify(newConfig));
};

export const ryujinx: Application = {
  id: applicationId,
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const switchRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfig(switchRomsPath);

    const optionParams = ["-r", configFolderPath];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    return optionParams;
  },
  excludeFiles,
  findEntryName,
  bundledPathLinux,
  bundledPathWindows,
};
