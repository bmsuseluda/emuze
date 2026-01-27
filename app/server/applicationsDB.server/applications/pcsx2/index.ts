import type { Application } from "../../types.js";
import fs from "node:fs";
import { EOL, homedir } from "os";
import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceGamepadConfigSection,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { log } from "../../../debug.server.js";
import { defaultSettings } from "./defaultSettings.js";
import type { ApplicationId } from "../../applicationId.js";
import { envPaths } from "../../../envPaths.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const flatpakId = "net.pcsx2.PCSX2";
const applicationId: ApplicationId = "pcsx2";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "pcsx2-qt.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);
const configFileName = "PCSX2.ini";
const configFilePathRelative = nodepath.join("inis", configFileName);

export const replaceGamepadConfig = (): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads();

  return replaceGamepadConfigSection(
    virtualGamepads,
    "[Pad1]",
    (section: string) =>
      section.startsWith("[Pad]") || !section.startsWith("[Pad"),
  );
};

export const replaceHotkeyConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", [
    {
      keyValue: "OpenPauseMenu = Keyboard/F2",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "ToggleFullscreen = Keyboard/F11",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "SaveStateToSlot = Keyboard/F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "LoadStateFromSlot = Keyboard/F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", [
    { keyValue: "CheckAtStartup = false" },
  ]);

export const replaceGameListConfig =
  (ps2RomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[GameList]", [
      { keyValue: `RecursivePaths = ${ps2RomsPath}` },
    ]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    { keyValue: "SDL = true" },
    { keyValue: "SDLControllerEnhancedMode = true" },
  ]);

export const replaceUiConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[UI]", [
    { keyValue: "ConfirmShutdown = false" },
    { keyValue: "SetupWizardIncomplete = false" },
  ]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replacePadConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Pad]", [{ keyValue: "MultitapPort1 = true" }]);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "PCSX2",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

const getConfigFilePath = () =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );

export const replaceConfigSections = (ps2RomsPath: string) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig,
    replaceInputSourcesConfig,
    // replacePadConfig,
    replaceHotkeyConfig,
    replaceGamepadConfig(),
    replaceAutoUpdaterConfig,
    replaceGameListConfig(ps2RomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(homedir(), "Documents", "PCSX2");
  } else {
    const { config } = envPaths("PCSX2", { suffix: "" });
    return nodepath.join(config);
  }
};

export const pcsx2: Application = {
  id: applicationId,
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  flatpakId,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      configFilePathRelative,
      "bios",
      "cheats",
      "gamesettings",
      "inputprofiles",
      "logs",
      "memcards",
      "savstates",
      "sstates",
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const ps2RomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(ps2RomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
  bundledPath,
};
