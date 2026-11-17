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
import {
  handleOperatingSystem,
  isWindows,
} from "../../../operationsystem.server.js";
import { bundledEmulatorsPathBase } from "../../../bundledEmulatorsPath.server.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { getVirtualGamepad } from "./getVirtualGamepad.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { AdvancedSettings } from "../../../../types/jsonFiles/settings/advanced.js";

const applicationId: ApplicationId = "ppsspp";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "PPSSPPWindows64.exe"),
  mac: nodepath.join(applicationId, "PPSSPPSDL.app"),
  linux: nodepath.join(applicationId, `${applicationId}.AppImage`),
});

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

export const replaceGraphicsConfig =
  (emulatorSettings?: AdvancedSettings): SectionReplacement =>
  (sections) => {
    const resolution = emulatorSettings?.resolution || defaultResolution;
    return replaceSection(sections, `${getSectionPrefix()}[Graphics]`, [
      { keyValue: `InternalResolution = ${resolution}` },
    ]);
  };

export const replacePostShaderSettingConfig: SectionReplacement = (sections) =>
  replaceSection(sections, `${getSectionPrefix()}[PostShaderSetting]`, [
    { keyValue: "LCDPersistenceSettingCurrentValue1 = 0.400000" },
  ]);

export const replacPostShaderListConfig =
  (emulatorSettings?: AdvancedSettings): SectionReplacement =>
  (sections) => {
    const shader = emulatorSettings?.shader || defaultShader;
    return replaceSection(sections, `${getSectionPrefix()}[PostShaderList]`, [
      { keyValue: `PostShader1 = ${shader}` },
    ]);
  };

export const replacePpssppConfigFile = (
  pspRomsPath: string,
  emulatorSettings?: AdvancedSettings,
) => {
  const filePath = getPpssppConfigFilePath();
  const fileContent = readPpssppConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig(pspRomsPath),
    replaceGraphicsConfig(emulatorSettings),
    replacePostShaderSettingConfig,
    replacPostShaderListConfig(emulatorSettings),
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

const defaultResolution = "1";
const defaultShader = "";

export const ppsspp: Application = {
  id: applicationId,
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso", ".pbp"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
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
    emulatorSettings,
  }) => {
    const pspRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replacePpssppConfigFile(pspRomsPath, emulatorSettings);
    replaceControlsConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--pause-menu-exit");
    return optionParams;
  },
  bundledPath,
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x for SD", value: "2" },
        { name: "3x for HD", value: "3" },
        { name: "4x for FHD", value: "4" },
        { name: "5x", value: "5" },
        { name: "6x", value: "6" },
        { name: "7x", value: "7" },
        { name: "8x for 4K UHD", value: "8" },
      ],
    },
    {
      id: "shader",
      label: "Shader",
      options: [
        { name: "Off", value: defaultShader },
        { name: "LCD Persistence", value: "LCDPersistence" },
        { name: "PSP Color", value: "PSPColor" },
      ],
    },
  ],
};
