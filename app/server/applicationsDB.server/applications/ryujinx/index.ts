import type { Application, DetectedRequiredFile } from "../../types.js";
import nodepath from "node:path";
import { writeConfig } from "../../configFile.js";
import fs from "node:fs";
import { log } from "../../../debug.server.js";
import type { Config, Hotkeys } from "./config.js";
import { defaultConfig } from "./config.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { handleOperatingSystem } from "../../../operationsystem.server.js";
import { findEntryName } from "./findEntryName.js";
import { excludeFiles } from "./excludeFiles.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { copy } from "../../../readWriteData.server.js";
import { AdvancedSettings } from "../../../../types/jsonFiles/settings/advanced.js";
import {
  ApplicationHotkeys,
  Hotkey,
  hotkeysDefinition,
} from "../../../../types/hotkeys.js";

const applicationId: ApplicationId = "ryujinx";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "Ryujinx.exe"),
  mac: nodepath.join(applicationId, "Ryujinx.app"),
  linux: nodepath.join(applicationId, `${applicationId}.AppImage`),
});

const configFolderPath = nodepath.join(emulatorsConfigDirectory, applicationId);
const configFileName = "Config.json";
const configFilePath = nodepath.join(configFolderPath, configFileName);

const copyKeyFiles = (keyFiles: DetectedRequiredFile[]) => {
  keyFiles.forEach((keyFile) => {
    copy(
      keyFile.filePath,
      nodepath.join(configFolderPath, "system", keyFile.type),
    );
  });
};

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

const hotkeys: ApplicationHotkeys = {
  Fullscreen: "show_ui",
  "Fast Forward": "toggle_vsync_mode",
};

const getHotkeyParams = () =>
  Object.entries(hotkeys).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [value]: hotkeysDefinition[key as Hotkey].keyboard,
    }),
    {} as Hotkeys,
  );

const replaceConfig = (
  switchRomsPath: string,
  emulatorSettings?: AdvancedSettings,
) => {
  const oldConfig = readConfigFile(configFilePath);
  const virtualGamepads = getVirtualGamepads();
  const resolution = Number(emulatorSettings?.resolution || defaultResolution);

  const newConfig: Config = {
    ...oldConfig,
    show_confirm_exit: false,
    check_updates_on_start: false,
    update_checker_type: "Off",
    skip_user_profiles: true,
    hotkeys: {
      ...oldConfig.hotkeys,
      screenshot: "Unbound",
      pause: "Unbound",
      toggle_mute: "Unbound",
      ...getHotkeyParams(),
    },
    game_dirs: [switchRomsPath],
    autoload_dirs: [switchRomsPath],
    input_config: virtualGamepads,
    res_scale: resolution,
  };
  writeConfig(configFilePath, JSON.stringify(newConfig));
};

const requiredFileTypes = {
  devKeys: "dev.keys",
  prodKeys: "prod.keys",
  titleKeys: "title.keys",
};

const defaultResolution = "1";

export const ryujinx: Application = {
  id: applicationId,
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    otherRequiredFiles,
    emulatorSettings,
  }) => {
    const switchRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfig(switchRomsPath, emulatorSettings);
    copyKeyFiles(otherRequiredFiles!);

    const optionParams = ["--root-data-dir", configFolderPath];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--hide-updates");

    return optionParams;
  },
  excludeFiles,
  findEntryName,
  bundledPath,
  otherRequiredFiles: [
    {
      type: requiredFileTypes.prodKeys,
      requiredFiles: [{ filename: requiredFileTypes.prodKeys }],
    },
    {
      type: requiredFileTypes.devKeys,
      requiredFiles: [{ filename: requiredFileTypes.devKeys }],
    },
    {
      type: requiredFileTypes.titleKeys,
      requiredFiles: [{ filename: requiredFileTypes.titleKeys }],
    },
  ],
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x (1440p/2160p)", value: "2" },
        { name: "3x (2160p/3240p)", value: "3" },
        { name: "4x (2880p/4320p)", value: "4" },
      ],
    },
  ],
  hotkeys,
};
