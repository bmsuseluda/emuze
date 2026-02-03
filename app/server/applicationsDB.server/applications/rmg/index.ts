import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { importElectron } from "../../../importElectron.server.js";
import { commandLineOptions } from "../../../commandLine.server.js";
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

const flatpakId = "com.github.Rosalie241.RMG";
const applicationId: ApplicationId = "rosaliesMupenGui";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "RMG.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFileName = "mupen64plus.cfg";

const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

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

export const replaceGamepadConfig = (): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads();

  return replaceGamepadConfigSection(
    virtualGamepads,
    "[Rosalie's Mupen GUI - Input Plugin Profile 0]",
    (section: string) =>
      !section.startsWith("[Rosalie's Mupen GUI - Input Plugin Profile"),
  );
};

export const replaceConfigSections = (n64RomsPath: string) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceMainConfig,
    replaceGamepadConfig(),
    replaceKeyBindingsConfig,
    replaceRomBrowserConfig(n64RomsPath),
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

export const rosaliesMupenGui: Application = {
  id: applicationId,
  name: "Rosalie's Mupen GUI",
  fileExtensions: [".z64", ".n64", ".v64"],
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
  }) => {
    const n64RomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(n64RomsPath);

    const optionParams = [];

    if (fullscreen) {
      optionParams.push("--fullscreen");
    }

    return optionParams;
  },
  bundledPath,
};

export const isRmgForN64 = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.rmgN64.id) ||
    process.env.EMUZE_RMG_N64 === "true"
  );
};
