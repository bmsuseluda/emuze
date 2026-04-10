import type { Application, DetectedRequiredFile } from "../../types.js";
import nodepath from "node:path";
import { writeConfig } from "../../configFile.js";
import fs from "node:fs";
import { log } from "../../../debug.server.js";
import type { Config } from "./config.js";
import { defaultConfig } from "./config.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";
import { findEntryName } from "./findEntryName.js";
import { excludeFiles } from "./excludeFiles.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { copy } from "../../../readWriteData.server.js";

const applicationId: ApplicationId = "ryujinx";
const flatpakId = "org.ryujinx.Ryujinx";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "Ryujinx.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

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

const replaceConfig = (switchRomsPath: string) => {
  const oldConfig = readConfigFile(configFilePath);
  const virtualGamepads = getVirtualGamepads();

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
    input_config: virtualGamepads,
  };
  writeConfig(configFilePath, JSON.stringify(newConfig));
};

const requiredFileTypes = {
  devKeys: "dev.keys",
  prodKeys: "prod.keys",
  titleKeys: "title.keys",
};

export const ryujinx: Application = {
  id: applicationId,
  name: "Ryujinx",
  fileExtensions: [".xci", ".nsp"],
  flatpakId,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    otherRequiredFiles,
  }) => {
    const switchRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfig(switchRomsPath);
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
};
