import fs from "node:fs";
import YAML from "yaml";
import type { Application } from "../../types.js";
import nodepath from "node:path";
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
  ActiveInputConfigFile,
  GlobalDefaultInputConfigFile,
  VfsConfigFile,
} from "./config.js";
import { isWindows } from "../../../operationsystem.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import {
  excludePlaystationFiles,
  findPlaystation3GameName,
} from "./findEntryName.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";

const flatpakId = "net.rpcs3.RPCS3";
const applicationId: ApplicationId = "rpcs3";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "rpcs3.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const guiConfigFileName = "CurrentSettings.ini";
const vfsConfigFileName = "vfs.yml";
const activeInputConfigFileName = "active_input_configurations.yml";
const globalDefaultInputConfigFileName = "Default.yml";

const guiConfigPathRelative = nodepath.join("GuiConfigs", guiConfigFileName);
const vfsConfigPathRelative = isWindows()
  ? nodepath.join("config", vfsConfigFileName)
  : nodepath.join(vfsConfigFileName);
const activeInputConfigPathRelative = isWindows()
  ? nodepath.join("config", "input_configs", activeInputConfigFileName)
  : nodepath.join("input_configs", activeInputConfigFileName);
const globalDefaultInputConfigPathRelative = isWindows()
  ? nodepath.join(
      "config",
      "input_configs",
      "global",
      globalDefaultInputConfigFileName,
    )
  : nodepath.join("input_configs", "global", globalDefaultInputConfigFileName);

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
const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );
export const getGuiConfigFilePath = () =>
  getConfigFilePath(guiConfigPathRelative);
const getVfsConfigFilePath = () => getConfigFilePath(vfsConfigPathRelative);
const getActiveInputConfigFilePath = () =>
  getConfigFilePath(activeInputConfigPathRelative);
const getGlobalDefaultInputConfigFilePath = () =>
  getConfigFilePath(globalDefaultInputConfigPathRelative);

const readVfsConfigFile = () =>
  readYmlConfigFile(getVfsConfigFilePath()) as VfsConfigFile;

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
        keyValue: `emulator_dir_list=${ps3RomsPath}`,
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

const readGlobalDefaultInputConfigFile = () =>
  readYmlConfigFile(
    getGlobalDefaultInputConfigFilePath(),
  ) as GlobalDefaultInputConfigFile;

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

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { config } = envPaths("rpcs3", { suffix: "" });

  return isWindows()
    ? nodepath.join(windowsConfigFolder)
    : nodepath.join(config);
};

export const rpcs3: Application = {
  id: applicationId,
  name: "RPCS3",
  flatpakId,
  fileExtensions: ["EBOOT.BIN"],
  findEntryName: findPlaystation3GameName,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      guiConfigPathRelative,
      vfsConfigPathRelative,
      activeInputConfigPathRelative,
      globalDefaultInputConfigPathRelative,
      "patches",
      "savestates",
      "rpcn.yml",
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const ps3RomsPath = nodepath.posix
      .join(categoriesPath.replace(/\\/g, "/"), categoryData.name)
      .normalize();
    const ps3RomsPathWithTrailingSeparator = `${ps3RomsPath}${ps3RomsPath.endsWith(nodepath.posix.sep) ? "" : nodepath.posix.sep}`;
    log("debug", "rpcs3", "ps3RomsPath", ps3RomsPathWithTrailingSeparator);
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
  bundledPath,
};
