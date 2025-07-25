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

const flatpakId = "org.ppsspp.PPSSPP";
const applicationId: ApplicationId = "ppsspp";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "PPSSPPWindows64.exe");

const { config } = envPaths("ppsspp", { suffix: "" });

const ppssppConfigFileName = "ppsspp.ini";
export const getPpssppConfigFilePath = () => {
  return nodepath.join(config, "PSP", "SYSTEM", ppssppConfigFileName);
};

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

export const replaceGeneralConfig =
  (pspRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[General]", [
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
  replaceSection(sections, "[ControlMapping]", [
    { keyValue: `Up = 1-48,10-19` },
    { keyValue: `Down = 1-35,10-20` },
    { keyValue: `Left = 1-34,10-21` },
    { keyValue: `Right = 1-36,10-22` },
    { keyValue: `Circle = 1-39,10-190` },
    { keyValue: `Cross = 1-38,10-189` },
    { keyValue: `Square = 1-49,10-191` },
    { keyValue: `Triangle = 1-37,10-188` },
    { keyValue: `Start = 1-66,10-197` },
    { keyValue: `Select = 1-67,10-196` },
    { keyValue: `L = 1-40,10-194` },
    { keyValue: `R = 1-43,10-195` },
    { keyValue: `An.Up = 1-51,10-4003` },
    { keyValue: `An.Down = 1-47,10-4002` },
    { keyValue: `An.Left = 1-29,10-4001` },
    { keyValue: `An.Right = 1-32,10-4000` },
    { keyValue: `Pause = 1-132,10-4008` },
    { keyValue: `Save State = 1-131` },
    { keyValue: `Save State = 1-133` },
    { keyValue: `Toggle Fullscreen = 1-141` },
  ]);

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

const controlsConfigFileName = "controls.ini";
export const getControlsConfigFilePath = () => {
  return nodepath.join(config, "PSP", "SYSTEM", controlsConfigFileName);
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

export const ppsspp: Application = {
  id: applicationId,
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso"],
  flatpakId,
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
  bundledPathLinux,
  bundledPathWindows,
};
