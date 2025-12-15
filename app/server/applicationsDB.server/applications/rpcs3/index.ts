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
  ConfigFile,
  GemMouseConfigFile,
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
const rpcnConfigFileName = "rpcn.yml";
const gemConfigFileName = "gem.yml";
const gemMouseConfigFileName = "gem_mouse.yml";
const gemRealConfigFileName = "gem_real.yml";
const rawMouseConfigFileName = "raw_mouse.yml";

const guiConfigPathRelative = nodepath.join("GuiConfigs", guiConfigFileName);
const vfsConfigPathRelative = isWindows()
  ? nodepath.join("config", vfsConfigFileName)
  : nodepath.join(vfsConfigFileName);
const rpcnConfigPathRelative = isWindows()
  ? nodepath.join("config", rpcnConfigFileName)
  : nodepath.join(rpcnConfigFileName);
const gemConfigPathRelative = isWindows()
  ? nodepath.join("config", gemConfigFileName)
  : nodepath.join(gemConfigFileName);
const gemMouseConfigPathRelative = isWindows()
  ? nodepath.join("config", gemMouseConfigFileName)
  : nodepath.join(gemMouseConfigFileName);
const gemRealConfigPathRelative = isWindows()
  ? nodepath.join("config", gemRealConfigFileName)
  : nodepath.join(gemRealConfigFileName);
const rawMouseConfigPathRelative = isWindows()
  ? nodepath.join("config", rawMouseConfigFileName)
  : nodepath.join(rawMouseConfigFileName);
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
const getGemMouseConfigFilePath = () =>
  getConfigFilePath(gemMouseConfigPathRelative);
const getConfigConfigFilePath = () => getConfigFilePath(gemConfigPathRelative);
const getActiveInputConfigFilePath = () =>
  getConfigFilePath(activeInputConfigPathRelative);
const getGlobalDefaultInputConfigFilePath = () =>
  getConfigFilePath(globalDefaultInputConfigPathRelative);

const readVfsConfigFile = () =>
  readYmlConfigFile(getVfsConfigFilePath()) as VfsConfigFile;
const readGemMouseConfigFile = () =>
  readYmlConfigFile(getGemMouseConfigFilePath()) as GemMouseConfigFile;
const readConfigFile = () =>
  readYmlConfigFile(getConfigConfigFilePath()) as ConfigFile;

const replaceMetaConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Meta]", [{ keyValue: "checkUpdateStart=false" }]);

const replacePadNavigationConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[PadNavigation]", [
    { keyValue: "allow_global_pad_input=true" },
    { keyValue: "pad_input_enabled=true" },
  ]);

const replaceMainWindowConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[main_window]", [
    { keyValue: "confirmationBoxExitGame=false" },
    { keyValue: "infoBoxEnabledWelcome=false" },
  ]);

const replaceShortcutsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Shortcuts]", [
    { keyValue: "game_window_savestate=F1", disableParamWithSameValue: true },
    { keyValue: "gw_home_menu=F2" },
    {
      keyValue: "game_window_toggle_fullscreen=F11",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "game_window_toggle_recording=",
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
    replacePadNavigationConfig,
    replaceShortcutsConfig,
    replaceFileSystemConfig(ps3RomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const replaceVfsConfigFile = (ps3RomsPath: string) => {
  const fileContent = readVfsConfigFile();
  const fileContentNew: VfsConfigFile = {
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

const replaceGemMouseConfigFile = () => {
  const fileContent = readGemMouseConfigFile();
  const fileContentNew: GemMouseConfigFile = {
    ...fileContent,
    "Player 1": {
      ...fileContent["Player 1"],
      T: "Mouse Button 1",
      Start: "Mouse Button 3",
      Cross: "Mouse Button 3",
      Select: "Mouse Button 7",
      Triangle: "Mouse Button 8",
      Circle: "Mouse Button 4",
      Square: "Mouse Button 5",
      Move: "Mouse Button 2",
    },
  };

  writeConfig(getGemMouseConfigFilePath(), YAML.stringify(fileContentNew));
};

const replaceConfigFile = () => {
  const fileContent = readConfigFile();
  const fileContentNew: ConfigFile = {
    ...fileContent,
    "Input/Output": {
      ...fileContent["Input/Output"],
      Keyboard: "Basic",
      Mouse: "Basic",
      Camera: "Fake",
      "Camera type": "PS Eye",
      "Camera flip": "None",
      "Camera ID": "Default",
      Move: "Mouse",
    },
  };

  writeConfig(getConfigConfigFilePath(), YAML.stringify(fileContentNew));
};

const readActiveInputConfigFile = () =>
  readYmlConfigFile(getActiveInputConfigFilePath()) as ActiveInputConfigFile;

const replaceActiveInputConfigFile = () => {
  const fileContent = readActiveInputConfigFile();
  const fileContentNew: ActiveInputConfigFile = {
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

const replaceGlobalDefaultInputConfigFile = (isPs1Classic: boolean) => {
  const virtualGamepads = getVirtualGamepads(isPs1Classic);

  const fileContent = readGlobalDefaultInputConfigFile();
  const fileContentNew: GlobalDefaultInputConfigFile = {
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
  omitAbsoluteEntryPathAsLastParam: true,
  searchFilesOnlyIn: [nodepath.join("dev_hdd0", "game"), "games"],
  fileExtensions: [
    nodepath.join("USRDIR", "EBOOT.BIN"),
    nodepath.join("USRDIR", "CONTENT", "EBOOT.PBP"),
  ],
  findEntryName: findPlaystation3GameName,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      guiConfigPathRelative,
      vfsConfigPathRelative,
      activeInputConfigPathRelative,
      globalDefaultInputConfigPathRelative,
      rpcnConfigPathRelative,
      gemConfigPathRelative,
      gemMouseConfigPathRelative,
      gemRealConfigPathRelative,
      rawMouseConfigPathRelative,
      // TODO: check if patches and savestates are under config folder as well on windows
      "patches",
      "savestates",
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    absoluteEntryPath,
  }) => {
    const ps3RomsPath = nodepath.posix
      .join(categoriesPath.replace(/\\/g, "/"), categoryData.name)
      .normalize();
    const ps3RomsPathWithTrailingSeparator = `${ps3RomsPath}${ps3RomsPath.endsWith(nodepath.posix.sep) ? "" : nodepath.posix.sep}`;
    const isPs1Classic = absoluteEntryPath.endsWith("EBOOT.PBP");
    log("debug", "rpcs3", "ps3RomsPath", ps3RomsPathWithTrailingSeparator);

    replaceGuiConfigFile(ps3RomsPathWithTrailingSeparator);
    replaceVfsConfigFile(ps3RomsPathWithTrailingSeparator);
    replaceGemMouseConfigFile();
    replaceConfigFile();
    replaceActiveInputConfigFile();
    replaceGlobalDefaultInputConfigFile(isPs1Classic);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
      optionParams.push("--no-gui");
    }

    const gameFolderPath = absoluteEntryPath.split("USRDIR")[0];
    optionParams.push(gameFolderPath);
    return optionParams;
  },
  excludeFiles: excludePlaystationFiles,
  bundledPath,
};
