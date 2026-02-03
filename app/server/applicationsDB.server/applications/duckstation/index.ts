import type { Application } from "../../types.js";
import { log } from "../../../debug.server.js";
import fs from "node:fs";
import { EOL, homedir } from "node:os";
import { isWindows } from "../../../operationsystem.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceGamepadConfigSection,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import nodepath from "node:path";
import { defaultSettings } from "./defaultSettings.js";
import type { ApplicationId } from "../../applicationId.js";
import { envPaths } from "../../../envPaths.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";

const flatpakId = "org.duckstation.DuckStation";
const applicationId: ApplicationId = "duckstation";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "duckstation-qt-x64-ReleaseLTCG.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFileName = "settings.ini";

export const replaceGamepadConfig = (gameName: string): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads(gameName);

  return replaceGamepadConfigSection(
    virtualGamepads,
    "[Pad1]",
    (section: string) => !section.startsWith("[Pad"),
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
      keyValue: "SaveSelectedSaveState = Keyboard/F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "LoadSelectedSaveState = Keyboard/F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", [
    { keyValue: "CheckAtStartup = false" },
  ]);

export const replaceMainConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Main]", [
    { keyValue: "ConfirmPowerOff = false" },
    { keyValue: "SetupWizardIncomplete = false" },
  ]);

export const replaceGameListConfig =
  (psxRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[GameList]", [
      { keyValue: `RecursivePaths = ${psxRomsPath}` },
    ]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    { keyValue: "SDL = true" },
    { keyValue: "SDLControllerEnhancedMode = true" },
    { keyValue: "RawInput = true" },
  ]);

export const replaceUiConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[UI]", [{ keyValue: "EnableMouseMapping = true" }]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replaceControllerPortsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[ControllerPorts]", [
    { keyValue: "MultitapMode = Port1Only" },
  ]);

const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "duckstation",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const replaceConfigSections = (
  psxRomsPath: string,
  gameName: string,
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInputSourcesConfig,
    // replaceControllerPortsConfig,
    replaceMainConfig,
    replaceHotkeyConfig,
    replaceGamepadConfig(gameName),
    replaceAutoUpdaterConfig,
    replaceGameListConfig(psxRomsPath),
    replaceUiConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(homedir(), "Documents", "DuckStation");
  } else {
    const { data } = envPaths("duckstation", { suffix: "" });
    return nodepath.join(data);
  }
};

export const duckstation: Application = {
  id: applicationId,
  name: "DuckStation (Legacy)",
  fileExtensions: [".chd", ".cue"],
  flatpakId,
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      configFileName,
      "bios",
      "cheats",
      "gamesettings",
      "inputprofiles",
      "memcards",
      "savstates",
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    entryData,
  }) => {
    const psxRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(psxRomsPath, entryData.name);

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
