import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types.js";
import nodepath from "node:path";
import { writeConfig } from "../../configFile.js";
import fs from "node:fs";
import { log } from "../../../debug.server.js";
import type { Config, InputConfig } from "./config.js";
import { defaultConfig, defaultInputConfig } from "./config.js";
import type { Sdl } from "@bmsuseluda/sdl";
import sdl from "@bmsuseluda/sdl";
import { emulatorsDirectory } from "../../../homeDirectory.server.js";
import { keyboardConfig } from "./keyboardConfig.js";
import type { ApplicationId } from "../../applicationId.js";
import { isGamecubeController } from "../../gamepads.js";
import { sortGamecubeLast } from "../../sortGamepads.js";

const applicationId: ApplicationId = "ryujinx";
const flatpakId = "org.ryujinx.Ryujinx";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "Ryujinx.exe");
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
  return `0-${mapping[0].padStart(8, "0")}-${mapping[5]}${mapping[4]}-${mapping[6]}-${mapping[7]}-${mapping[8]}`;
};

/**
 * TODO: Check joycons
 */
const createControllerType = () => {
  return "ProController";
};

const createDeviceSpecificInputConfig = (controllerName: string) => {
  if (isGamecubeController(controllerName)) {
    return {
      ...defaultInputConfig,
      right_joycon: {
        ...defaultInputConfig.right_joycon,
        button_x: "X",
        button_b: "B",
        button_y: "Y",
        button_a: "A",
      },
    };
  }

  return defaultInputConfig;
};

const createInputConfig = (
  controller: Sdl.Joystick.Device,
  index: number,
): InputConfig => {
  const joystick = sdl.joystick.devices[index];
  log("debug", "gamepad", {
    index,
    controller,
    joystick,
  });

  return {
    ...createDeviceSpecificInputConfig(joystick.name),
    id: createControllerId(controller.guid),
    controller_type: createControllerType(),
    player_index: `Player${index + 1}`,
  };
};

const replaceConfig = (switchRomsPath: string) => {
  const gamepads = sdl.joystick.devices;
  const gamepadsSorted = gamepads.toSorted(sortGamecubeLast);
  const inputConfig =
    gamepadsSorted.length > 0
      ? gamepadsSorted.map(createInputConfig)
      : [keyboardConfig];

  const oldConfig = readConfigFile(configFilePath);

  const newConfig: Config = {
    ...oldConfig,
    show_confirm_exit: false,
    check_updates_on_start: false,
    update_checker_type: "Off",
    skip_user_profiles: true,
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

    const optionParams = ["--root-data-dir", configFolderPath];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--hide-updates");

    return optionParams;
  },
  excludeFiles,
  findEntryName,
  bundledPathLinux,
  bundledPathWindows,
};
