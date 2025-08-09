import fs from "node:fs";
import YAML from "yaml";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type {
  Application,
  ExcludeFilesFunction,
  FindEntryNameFunction,
} from "../../types.js";
import nodepath from "node:path";
import ps3Games from "./nameMapping/ps3.json" with { type: "json" };
import { log } from "../../../debug.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { defaultGuiSettings } from "./defaultGuiSettings.js";
import { envPaths } from "../../../envPaths.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import type {
  PlayerInput,
  ActiveInputConfigFile,
  GlobalDefaultInputConfigFile,
  VfsConfigFile,
} from "./config.js";
import { globalDefaultInputConfigFileReset } from "./config.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { isSteamOs, isWindows } from "../../../operationsystem.server.js";
import {
  getNameIndex,
  getPlayerIndexArray,
} from "../../../../types/gamepad.js";

const flatpakId = "net.rpcs3.RPCS3";
const applicationId: ApplicationId = "rpcs3";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const getWindowsConfigFolder = () =>
  nodepath.join(process.env.APPDIR || "", "emulators", applicationId);
const bundledPathWindows = nodepath.join(applicationId, "rpcs3.exe");
const guiConfigFileName = "CurrentSettings.ini";
const activeInputConfigFileName = "active_input_configurations.yml";
const globalDefaultInputConfigFileName = "Default.yml";
const vfsConfigFileName = "vfs.yml";

/**
 * Find the 9digit serial number from path
 *
 * @param path  e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
export const findPlaystation3Serial = (path: string): string | undefined =>
  path
    .split(nodepath.sep)
    .reverse()
    .find(
      (pathSegment) =>
        pathSegment.match(/^\w{9}$/) || pathSegment.match(/^\w{9}-\[(.*)]$/),
    )
    ?.split("-")[0];

/**
 * Find the 9digit serial number and map to the Gamename.
 *
 * @param name EBOOT.BIN
 * @param path e.g. 'dev_hdd0/game/NPUB30493/USRDIR/EBOOT.BIN' or '/games/BLES01658-[Dragon Ball Z Budokai HD Collection]/PS3_GAME/USRDIR/EBOOT.BIN'
 */
const findPlaystation3GameName: FindEntryNameFunction = ({
  entry: { name, path },
}) => {
  let entryName: string | null = null;

  const serial = findPlaystation3Serial(path);

  if (serial) {
    try {
      entryName = (ps3Games as Record<string, string>)[serial];
    } catch (error) {
      log("error", "findPlaystation3GameName", error);
      return name;
    }
  }

  return entryName || serial || name;
};

const digitalPhysicalMapping: Record<string, string> = {
  BCUS98472: "XCUS00003",
};

/**
 * Exclude files without serial and files that are just update files for physical games
 */
export const excludePlaystationFiles: ExcludeFilesFunction = (filepaths) => {
  const filepathsTemp = [...filepaths];
  return filepaths.filter((filepath) => {
    const serial = findPlaystation3Serial(filepath);

    const foundExclude =
      !serial ||
      !!filepathsTemp.find((otherFilepath) => {
        const otherSerial = findPlaystation3Serial(otherFilepath);

        const isNotTheSame = otherFilepath !== filepath;
        const isUpdateOnly =
          serial === otherSerial ||
          (digitalPhysicalMapping[serial] &&
            digitalPhysicalMapping[serial] === otherSerial);

        return isNotTheSame && isUpdateOnly;
      });

    if (foundExclude) {
      filepathsTemp.splice(
        filepathsTemp.findIndex((filepathTemp) => filepathTemp === filepath),
        1,
      );
    }

    return foundExclude;
  });
};

const readYmlConfigFile = (filePath: string) => {
  try {
    const file = fs.readFileSync(filePath, "utf8");
    return YAML.parse(file);
  } catch (error) {
    log("debug", "rpcs3", "config file can not be read.", filePath, error);
    return {};
  }
};

const readGuiConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "rpcs3",
      "gui config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultGuiSettings;
  }
};

const { config } = envPaths("rpcs3", { suffix: "" });
export const getGuiConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      getWindowsConfigFolder(),
      "GuiConfigs",
      guiConfigFileName,
    );
  } else {
    return nodepath.join(config, "GuiConfigs", guiConfigFileName);
  }
};

const replaceMetaConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Meta]", [{ keyValue: "checkUpdateStart=false" }]);

const replaceMainWindowConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[main_window]", [
    { keyValue: "confirmationBoxExitGame=false" },
    { keyValue: "infoBoxEnabledWelcome=false" },
  ]);

const replaceShortcutsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Shortcuts]", [
    { keyValue: "game_window_savestate=F1", disableParamWithSameValue: true },
    { keyValue: "gw_home_menu=F2", disableParamWithSameValue: true },
    {
      keyValue: "game_window_toggle_fullscreen=F11",
      disableParamWithSameValue: true,
    },
  ]);

const replaceFileSystemConfig =
  (ps3RomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[FileSystem]", [
      {
        keyValue: `emulator_dir_list=, ${ps3RomsPath}`,
      },
      { keyValue: "dev_bdvd_list=$(EmulatorDir)dev_bdvd/" },
      { keyValue: "dev_flash2_list=$(EmulatorDir)dev_flash2/" },
      { keyValue: "dev_flash3_list=$(EmulatorDir)dev_flash3/" },
      { keyValue: "dev_flash_list=$(EmulatorDir)dev_flash/" },
      { keyValue: "dev_hdd0_list=$(EmulatorDir)dev_hdd0/" },
      { keyValue: "dev_hdd1_list=$(EmulatorDir)dev_hdd1/" },
      { keyValue: "games_list=$(EmulatorDir)games/" },
    ]);

export const replaceGuiConfigFile = (ps3RomsPath: string) => {
  const filePath = getGuiConfigFilePath();
  const fileContent = readGuiConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceMetaConfig,
    replaceMainWindowConfig,
    replaceShortcutsConfig,
    replaceFileSystemConfig(ps3RomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getVfsConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(getWindowsConfigFolder(), vfsConfigFileName);
  } else {
    return nodepath.join(config, vfsConfigFileName);
  }
};
const readVfsConfigFile = () =>
  readYmlConfigFile(getVfsConfigFilePath()) as VfsConfigFile;

const replaceVfsConfigFile = (ps3RomsPath: string) => {
  const fileContent = readVfsConfigFile();
  const fileContentNew = {
    ...fileContent,
    "$(EmulatorDir)": ps3RomsPath,
    "/dev_hdd0/": "$(EmulatorDir)dev_hdd0/",
    "/dev_hdd1/": "$(EmulatorDir)dev_hdd1/",
    "/dev_flash/": "$(EmulatorDir)dev_flash/",
    "/dev_flash2/": "$(EmulatorDir)dev_flash2/",
    "/dev_flash3/": "$(EmulatorDir)dev_flash3/",
    "/dev_bdvd/": "$(EmulatorDir)dev_bdvd/",
    "/games/": "$(EmulatorDir)games/",
  };

  writeConfig(getVfsConfigFilePath(), YAML.stringify(fileContentNew));
};

const getActiveInputConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      getWindowsConfigFolder(),
      "input_configs",
      activeInputConfigFileName,
    );
  } else {
    return nodepath.join(config, "input_configs", activeInputConfigFileName);
  }
};
const readActiveInputConfigFile = () =>
  readYmlConfigFile(getActiveInputConfigFilePath()) as ActiveInputConfigFile;

const replaceActiveInputConfigFile = () => {
  const fileContent = readActiveInputConfigFile();
  const fileContentNew = {
    ...fileContent,
    "Active Configurations": {
      global: "Default",
    },
  };

  writeConfig(getActiveInputConfigFilePath(), YAML.stringify(fileContentNew));
};

const getGlobalDefaultInputConfigFilePath = () => {
  return nodepath.join(
    config,
    "input_configs",
    "global",
    globalDefaultInputConfigFileName,
  );
};
const readGlobalDefaultInputConfigFile = () =>
  readYmlConfigFile(
    getGlobalDefaultInputConfigFilePath(),
  ) as GlobalDefaultInputConfigFile;

export const getVirtualGamepad = (
  name: string,
  index: number,
  devices: Sdl.Joystick.Device[] | Sdl.Controller.Device[],
): PlayerInput => {
  return {
    Handler: "SDL",
    Device: `${name} ${getNameIndex(name, index, devices) + 1}`,
    Config: {
      "Left Stick Left": "LS X-",
      "Left Stick Down": "LS Y-",
      "Left Stick Right": "LS X+",
      "Left Stick Up": "LS Y+",
      "Right Stick Left": "RS X-",
      "Right Stick Down": "RS Y-",
      "Right Stick Right": "RS X+",
      "Right Stick Up": "RS Y+",
      Start: "Start",
      Select: "Back",
      "PS Button": "Guide",
      Square: "West",
      Cross: "South",
      Circle: "East",
      Triangle: "North",
      Left: "Left",
      Down: "Down",
      Right: "Right",
      Up: "Up",
      R1: "RB",
      R2: "RT",
      R3: "RS",
      L1: "LB",
      L2: "LT",
      L3: "LS",
      "IR Nose": "",
      "IR Tail": "",
      "IR Left": "",
      "IR Right": "",
      "Tilt Left": "",
      "Tilt Right": "",
      "Motion Sensor X": {
        Axis: "",
        Mirrored: false,
        Shift: 0,
      },
      "Motion Sensor Y": {
        Axis: "",
        Mirrored: false,
        Shift: 0,
      },
      "Motion Sensor Z": {
        Axis: "",
        Mirrored: false,
        Shift: 0,
      },
      "Motion Sensor G": {
        Axis: "",
        Mirrored: false,
        Shift: 0,
      },
      "Orientation Reset Button": "",
      "Orientation Enabled": false,
      "Pressure Intensity Button": "",
      "Pressure Intensity Percent": 50,
      "Pressure Intensity Toggle Mode": false,
      "Pressure Intensity Deadzone": 0,
      "Analog Limiter Button": "",
      "Analog Limiter Toggle Mode": false,
      "Left Stick Multiplier": 100,
      "Right Stick Multiplier": 100,
      "Left Stick Deadzone": 8000,
      "Right Stick Deadzone": 8000,
      "Left Stick Anti-Deadzone": 4259,
      "Right Stick Anti-Deadzone": 4259,
      "Left Trigger Threshold": 0,
      "Right Trigger Threshold": 0,
      "Left Pad Squircling Factor": 8000,
      "Right Pad Squircling Factor": 8000,
      "Color Value R": 0,
      "Color Value G": 0,
      "Color Value B": 20,
      "Blink LED when battery is below 20%": true,
      "Use LED as a battery indicator": false,
      "LED battery indicator brightness": 10,
      "Player LED enabled": true,
      "Large Vibration Motor Multiplier": 100,
      "Small Vibration Motor Multiplier": 100,
      "Switch Vibration Motors": false,
      "Mouse Movement Mode": "Relative",
      "Mouse Deadzone X Axis": 60,
      "Mouse Deadzone Y Axis": 60,
      "Mouse Acceleration X Axis": 200,
      "Mouse Acceleration Y Axis": 250,
      "Left Stick Lerp Factor": 100,
      "Right Stick Lerp Factor": 100,
      "Analog Button Lerp Factor": 100,
      "Trigger Lerp Factor": 100,
      "Device Class Type": 0,
      "Vendor ID": 1356,
      "Product ID": 616,
    },
    "Buddy Device": "",
  };
};

export const getVirtualGamepads = (): GlobalDefaultInputConfigFile => {
  const gamepads = isSteamOs() ? sdl.joystick.devices : sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  if (gamepads.length > 0) {
    return gamepads.reduce<GlobalDefaultInputConfigFile>(
      (accumulator, currentDevice, index) => {
        if (currentDevice.name) {
          log("debug", "gamepad", { index, currentDevice });

          accumulator[`Player ${playerIndexArray[index] + 1} Input`] =
            getVirtualGamepad(currentDevice.name, index, gamepads);
        }
        return accumulator;
      },
      globalDefaultInputConfigFileReset,
    );
  }

  return keyboardConfig;
};

const replaceGlobalDefaultInputConfigFile = () => {
  const virtualGamepads = getVirtualGamepads();

  const fileContent = readGlobalDefaultInputConfigFile();
  const fileContentNew = {
    ...fileContent,
    ...virtualGamepads,
  };

  writeConfig(
    getGlobalDefaultInputConfigFilePath(),
    YAML.stringify(fileContentNew, { aliasDuplicateObjects: false }),
  );
};

export const rpcs3: Application = {
  id: applicationId,
  name: "RPCS3",
  flatpakId,
  fileExtensions: ["EBOOT.BIN"],
  findEntryName: findPlaystation3GameName,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const ps3RomsPath = nodepath.join(categoriesPath, categoryData.name);
    const ps3RomsPathWithTrailingSeparator = `${ps3RomsPath}${ps3RomsPath.endsWith(nodepath.sep) ? "" : nodepath.sep}`;
    replaceGuiConfigFile(ps3RomsPathWithTrailingSeparator);
    replaceVfsConfigFile(ps3RomsPathWithTrailingSeparator);
    replaceActiveInputConfigFile();
    replaceGlobalDefaultInputConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("--no-gui");
    }
    return optionParams;
  },
  excludeFiles: excludePlaystationFiles,
  bundledPathLinux,
  bundledPathWindows,
};
