import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { log } from "../../../debug.server.js";
import { EOL } from "node:os";
import { defaultPpssppSettings } from "./defaultPpssppSettings.js";
import { defaultControlsSettings } from "./defaultControlsSettings.js";
import { isWindows } from "../../../operationsystem.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { getVirtualGamepad } from "./getVirtualGamepad.js";

const flatpakId = "org.ppsspp.PPSSPP";
const applicationId: ApplicationId = "ppsspp";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "PPSSPPWindows64.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const ppssppConfigFileName = "ppsspp.ini";
const ppssppConfigPathRelative = nodepath.join(
  "PSP",
  "SYSTEM",
  ppssppConfigFileName,
);

const getConfigFilePath = (configFilePathRelative: string) =>
  nodepath.join(
    emulatorsConfigDirectory,
    applicationId,
    configFilePathRelative,
  );
export const getPpssppConfigFilePath = () =>
  getConfigFilePath(ppssppConfigPathRelative);
const controlsConfigFileName = "controls.ini";
const controlsConfigPathRelative = nodepath.join(
  "PSP",
  "SYSTEM",
  controlsConfigFileName,
);
export const getControlsConfigFilePath = () =>
  getConfigFilePath(controlsConfigPathRelative);

const readPpssppConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "ppsspp",
      "ppsspp config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultPpssppSettings;
  }
};

const getSectionPrefix = () => {
  if (isWindows()) {
    return "";
  } else {
    return "﻿";
  }
};

export const replaceGeneralConfig =
  (pspRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, `${getSectionPrefix()}[General]`, [
      { keyValue: `FirstRun = False` },
      { keyValue: `CurrentDirectory = ${pspRomsPath}` },
      { keyValue: `CheckForNewVersion = False` },
    ]);

export const replacePpssppConfigFile = (pspRomsPath: string) => {
  const filePath = getPpssppConfigFilePath();
  const fileContent = readPpssppConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig(pspRomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const replaceControlMappingConfig: SectionReplacement = (sections) =>
  replaceSection(
    sections,
    `${getSectionPrefix()}[ControlMapping]`,
    getVirtualGamepad(),
  );

const readControlsConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "ppsspp",
      "controls config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultControlsSettings;
  }
};

export const replaceControlsConfigFile = () => {
  const filePath = getControlsConfigFilePath();
  const fileContent = readControlsConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceControlMappingConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  const windowsConfigFolder = nodepath.join(
    bundledEmulatorsPathBase,
    applicationId,
    "memstick",
  );
  const { config } = envPaths("ppsspp", { suffix: "" });

  return isWindows()
    ? nodepath.join(windowsConfigFolder)
    : nodepath.join(config);
};

export const ppsspp: Application = {
  id: applicationId,
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso", ".pbp"],
  flatpakId,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [
      nodepath.join("PSP", "Cheats"),
      nodepath.join("PSP", "GAME"),
      nodepath.join("PSP", "PPSSPP_STATE"),
      nodepath.join("PSP", "SAVEDATA"),
      ppssppConfigPathRelative,
      controlsConfigPathRelative,
    ],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const pspRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replacePpssppConfigFile(pspRomsPath);
    replaceControlsConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--pause-menu-exit");
    return optionParams;
  },
  bundledPath,
};
