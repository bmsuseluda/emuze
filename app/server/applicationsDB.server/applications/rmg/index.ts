import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { envPaths } from "../../../envPaths.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { log } from "../../../debug.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceGamepadConfigSection,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { readAdvanced } from "../../../settings.server.js";

const applicationId: ApplicationId = "rosaliesMupenGui";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "RMG.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFileName = "mupen64plus.cfg";

const configPathRelative = isWindows()
  ? nodepath.join("config", configFileName)
  : nodepath.join(configFileName);

const savestatesPathRelative = isWindows()
  ? nodepath.join("config", "Save", "State")
  : nodepath.join("savstates");

const memcardsPathRelative = isWindows()
  ? nodepath.join("config", "Save", "Game")
  : nodepath.join("memcards");

const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configPathRelative);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "rmg",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return "";
  }
};

export const replaceMainConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Rosalie's Mupen GUI]", [
    { keyValue: "ConfirmExitWhileInGame = False" },
    { keyValue: "CheckForUpdates = False" },
  ]);

export const replaceGuiCoreConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Rosalie's Mupen GUI Core]", [
    { keyValue: `GFX_Plugin = "mupen64plus-video-parallel.so"` },
    { keyValue: `RSP_Plugin = "mupen64plus-rsp-parallel.so"` },
  ]);

export const replaceKeyBindingsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Rosalie's Mupen GUI KeyBindings]", [
    { keyValue: `SaveState = "F1"` },
    { keyValue: `Fullscreen = "F2"` },
    { keyValue: `LoadState = "F3"` },
    { keyValue: `SoftReset = ""` },
    { keyValue: `Resume = ""` },
    { keyValue: `Screenshot = ""` },
  ]);

export const replaceRomBrowserConfig =
  (n64RomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[Rosalie's Mupen GUI RomBrowser]", [
      {
        keyValue: `Directory = "${n64RomsPath}"`,
      },
    ]);

const replaceInputConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Rosalie's Mupen GUI - Input Plugin]", [
    /**
     * 0 = automatic
     * 1 = joystick
     * 2 = gamepad (controller)
     */
    {
      keyValue: `ControllerMode = 1`,
    },
  ]);

export const replaceGamepadConfig = (): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads();

  return replaceGamepadConfigSection(
    virtualGamepads,
    "[Rosalie's Mupen GUI - Input Plugin Profile 0]",
    (section: string) =>
      !section.startsWith("[Rosalie's Mupen GUI - Input Plugin Profile"),
  );
};

export const replaceVideoParallelConfig =
  (resolution: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[Video-Parallel]", [
      {
        keyValue: `Upscaling = ${resolution}`,
      },
    ]);

export const replaceConfigSections = (
  n64RomsPath: string,
  resolution: string,
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceMainConfig,
    replaceInputConfig,
    replaceGamepadConfig(),
    replaceGuiCoreConfig,
    replaceKeyBindingsConfig,
    replaceRomBrowserConfig(n64RomsPath),
    replaceVideoParallelConfig(resolution),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
  );
  const { config } = envPaths("RMG", { suffix: "" });

  return isWindows()
    ? nodepath.join(windowsConfigFolder)
    : nodepath.join(config);
};

const defaultResolution = "1";

export const rosaliesMupenGui: Application = {
  id: applicationId,
  name: "Rosalie's Mupen GUI",
  fileExtensions: [".z64", ".n64", ".v64"],
  defineEnvironmentVariables: () => ({
    ...sdlGameControllerConfig,
  }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      configPathRelative,
      savestatesPathRelative,
      memcardsPathRelative,
      "gamesettings",
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
      advanced,
    },
    categoryData,
  }) => {
    const n64RomsPath = nodepath.join(categoriesPath, categoryData.name);
    const resolution =
      advanced["nintendo64/rosaliesMupenGui"]?.resolution || defaultResolution;
    replaceConfigSections(n64RomsPath, resolution);

    const optionParams = [];

    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    return optionParams;
  },
  bundledPath,
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x", value: "2" },
        { name: "4x", value: "4" },
        { name: "8x", value: "8" },
      ],
    },
  ],
};

export const isRmgForN64 = () => {
  const rmg = readAdvanced()?.["nintendo64"]?.["emulator"] === applicationId;

  return rmg;
};
