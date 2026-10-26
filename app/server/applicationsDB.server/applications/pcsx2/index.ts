import type { Application, DetectedRequiredFile } from "../../types.js";
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
import multitapGames from "../../../../../fetchMetaData/multitapGames/sonyplaystation2.json" with { type: "json" };
import { normalizeString } from "../../../igdb.server.js";

const applicationId: ApplicationId = "pcsx2";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "pcsx2-qt.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);
const configFileName = "PCSX2.ini";
const configFilePathRelative = nodepath.join("inis", configFileName);

export const replaceGamepadConfig = (
  isMultitapGame: boolean,
): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads(isMultitapGame);

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

export const replaceFoldersConfig =
  (biosFiles: DetectedRequiredFile[]): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[Folders]", [
      { keyValue: `Bios = ${nodepath.dirname(biosFiles.at(0)!.filePath)}` },
    ]);

export const replaceFilenamesConfig =
  (biosFiles: DetectedRequiredFile[]): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[Filenames]", [
      { keyValue: `BIOS = ${nodepath.basename(biosFiles.at(0)!.filePath)}` },
    ]);

const checkIsMultitapGame = (gameName: string) => {
  const multitapGamesSet = new Set(multitapGames);
  return multitapGamesSet.has(normalizeString(gameName));
};

export const replacePadConfig =
  (isMultitapGame: boolean): SectionReplacement =>
  (sections) => {
    const multitapMode = isMultitapGame ? "true" : "false";

    return replaceSection(sections, "[Pad]", [
      { keyValue: `MultitapPort1 = ${multitapMode}` },
      { keyValue: `MultitapPort2 = false` },
    ]);
  };

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

export const replaceConfigSections = (
  ps2RomsPath: string,
  gameName: string,
  biosFiles: DetectedRequiredFile[],
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const isMultitapGame = checkIsMultitapGame(gameName);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig,
    replaceFoldersConfig(biosFiles),
    replaceFilenamesConfig(biosFiles),
    replaceInputSourcesConfig,
    replacePadConfig(isMultitapGame),
    replaceHotkeyConfig,
    replaceGamepadConfig(isMultitapGame),
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
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        /** US */
        {
          filename: "scph39001.bin",
          hash: "f4c948e61a291d4b3f92a141e550cf8357204287a31ff784caccbedaef910c9d",
        },
        /** Europe */
        {
          filename: "SCPH-70004_BIOS_V12_PAL_200.bin",
          hash: "d6653f4e93be2f6f9e9d690a934f26cf0f6ad4e348b69f41ef736732c3a6685b",
        },
        /** Japan */
        {
          filename: "scph10000.bin",
          hash: "c4dad3b5c6ad58bce70a47fc332602880f041c0338ac6be89061c928f6919ab1",
        },
        /** Europe */
        {
          filename: "PS2 Bios 30004R V6 Pal.bin",
          hash: "ee7ae4cc152588b7da1dab17494a321ceafafaf799769baea4e8a28afa5044b1",
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
    const ps2RomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(ps2RomsPath, entryData.name, biosFiles!);

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
