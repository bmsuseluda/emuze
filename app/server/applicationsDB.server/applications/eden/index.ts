import type { Application, DetectedRequiredFile } from "../../types.js";
import nodepath from "node:path";
import fs from "node:fs";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import type { ApplicationId } from "../../applicationId.js";
import { isWindows } from "../../../operationsystem.server.js";
import { findEntryName } from "./findEntryName.js";
import { excludeFiles } from "./excludeFiles.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import { copy } from "../../../readWriteData.server.js";
import { importElectron } from "../../../importElectron.server.js";
import { commandLineOptions } from "../../../commandLine.server.js";
import { envPaths } from "../../../envPaths.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import { log } from "../../../debug.server.js";
import { defaultSettings } from "./defaultSettings.js";
import { disableSetting, getSetting } from "./getSettings.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";

const applicationId: ApplicationId = "eden";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "Eden.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFolderPath = nodepath.join(emulatorsConfigDirectory, applicationId);
const configFileName = "qt-config.ini";
const configFilePath = nodepath.join(configFolderPath, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "eden",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const replaceUiConfig =
  (switchRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[UI]", [
      ...getSetting("firstStart", false),
      ...getSetting("confirmStop", 2),
      ...getSetting("disableControllerApplet", true),
      ...getSetting("check_for_updates", false),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq",
        "F2",
        false,
      ),
      ...disableSetting("Shortcuts\\Main%20Window\\Load%20Amiibo\\KeySeq"),
      ...disableSetting("Shortcuts\\Main%20Window\\Remove%20Amiibo\\KeySeq"),
      { keyValue: `Paths\\gamedirs\\4\\path=${switchRomsPath}` },
      { keyValue: `Paths\\external_content_dirs\\1\\path=${switchRomsPath}` },
      { keyValue: "fullscreen\\default=true" },
    ]);

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  const virtualGamepads = getVirtualGamepads();

  return replaceSection(sections, "[Controls]", virtualGamepads);
};

export const replaceConfigSections = (switchRomsPath: string) => {
  const filePath = configFilePath;
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig(switchRomsPath),
    replaceGamepadConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getDataBasePath = () => {
  if (isWindows()) {
    const { data } = envPaths("Eden", { suffix: "" });
    return nodepath.join(data);
  } else {
    const { data } = envPaths("eden", { suffix: "" });
    return nodepath.join(data);
  }
};

const copyKeyFiles = (keyFiles: DetectedRequiredFile[]) => {
  keyFiles.forEach((keyFile) => {
    copy(
      keyFile.filePath,
      nodepath.join(getDataBasePath(), "keys", keyFile.type),
    );
  });
};

const requiredFileTypes = {
  devKeys: "dev.keys",
  prodKeys: "prod.keys",
  titleKeys: "title.keys",
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    const { config } = envPaths("Eden", { suffix: "" });
    return nodepath.join(config);
  } else {
    const { config } = envPaths("eden", { suffix: "" });
    return nodepath.join(config);
  }
};

export const eden: Application = {
  id: applicationId,
  name: "Eden",
  fileExtensions: [".xci", ".nsp"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
    otherRequiredFiles,
  }) => {
    const switchRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(switchRomsPath);
    copyKeyFiles(otherRequiredFiles!);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-f");
    }

    optionParams.push("-g");

    return optionParams;
  },
  excludeFiles,
  findEntryName,
  bundledPath,
  otherRequiredFiles: [
    {
      type: requiredFileTypes.prodKeys,
      requiredFiles: [{ filename: requiredFileTypes.prodKeys }],
    },
    {
      type: requiredFileTypes.devKeys,
      requiredFiles: [{ filename: requiredFileTypes.devKeys }],
    },
    {
      type: requiredFileTypes.titleKeys,
      requiredFiles: [{ filename: requiredFileTypes.titleKeys }],
    },
  ],
};

export const isEdenForSwitch = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.edenSwitch.id) ||
    process.env.EMUZE_EDEN_SWITCH === "true"
  );
};
