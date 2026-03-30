import type { Application, DetectedRequiredFile } from "../../types.js";
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

export const replaceBiosConfig =
  (biosFiles: DetectedRequiredFile[]): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[BIOS]", [
      {
        keyValue: `SearchDirectory = ${nodepath.dirname(biosFiles.at(0)!.filePath)}`,
      },
    ]);

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
  biosFiles: DetectedRequiredFile[],
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInputSourcesConfig,
    // replaceControllerPortsConfig,
    replaceMainConfig,
    replaceBiosConfig(biosFiles),
    replaceGamepadConfig(gameName),
    replaceHotkeyConfig,
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

const defaultBiosPath = nodepath.join(getConfigFileBasePath(), "bios");

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
  biosFiles: [
    {
      type: "default",
      defaultPath: defaultBiosPath,
      requiredFiles: [
        /** Europe */
        {
          filename: "scph5502.bin",
          hash: "1faaa18fa820a0225e488d9f086296b8e6c46df739666093987ff7d8fd352c09",
        },
        /** US */
        {
          filename: "scph5501.bin",
          hash: "11052b6499e466bbf0a709b1f9cb6834a9418e66680387912451e971cf8a1fef",
        },
        /** Japan */
        {
          filename: "scph5500.bin",
          hash: "9c0421858e217805f4abe18698afea8d5aa36ff0727eb8484944e00eb5e7eadb",
        },
      ],
    },
  ],
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    entryData,
    biosFiles,
  }) => {
    const psxRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(psxRomsPath, entryData.name, biosFiles!);

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
