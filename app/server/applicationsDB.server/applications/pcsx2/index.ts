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

// TODO: Remove when igdb is updated
const multitapGamesFallback = [
  "ATV Offroad Fury",
  "ATV Offroad Fury 2",
  "ATV Offroad Fury 3",
  "ATV Offroad Fury 4",
  "Crash Nitro Kart",
  "Champions of Norrath",
  "Champions: Return to Arms",
  "Dead or Alive 2",
  "Def Jam Vendetta",
  "Def Jam: Fight for NY",
  "Digimon Rumble Arena 2",
  "Digimon World 4",
  "F1 Championship Season 2000",
  "Gauntlet Dark Legacy",
  "Kung Fu Panda",
  "Looney Tunes: Space Race",
  "Marvel Super Hero Squad",
  "Marvel: Ultimate Alliance",
  "Mashed: Drive to Survive",
  "Mashed: Fully Loaded",
  "Monopoly Party",
  "Nicktoons Unite!",
  "Ratchet & Clank: Up Your Arsenal",
  "Ratchet: Deadlocked",
  "Rayman M",
  "Rayman Raving Rabbids",
  "Sega Classics Collection",
  "Sega Superstars Tennis",
  "The Simpsons: Hit & Run",
  "Samurai Warriors 2",
  "Shrek 2",
  "Shrek SuperSlam",
  "Sonic Riders",
  "Sonic Riders: Zero Gravity",
  "SpongeBob SquarePants: Lights, Camera, Pants!",
  "The Grim Adventures of Billy & Mandy",
  "Tekken Tag Tournament",
  "TimeSplitters",
  "TimeSplitters 2",
  "TimeSplitters: Future Perfect",
  "Twisted Metal: Black",
  "Bombastic",
  "Risk: Global Domination",
  "WWE SmackDown! Shut Your Mouth",
  "WWE SmackDown! Here Comes the Pain",
  "WWE SmackDown! vs. RAW",
  "WWE SmackDown! vs. RAW 2006",
  "WWE SmackDown vs. RAW 2007",
  "WWE SmackDown vs. Raw 2008",
  "WWE SmackDown vs. Raw 2009",
  "WWE SmackDown vs. Raw 2010",
  "WWE SmackDown vs. Raw 2011",
  "FIFA Football 2005",
  "WWF SmackDown! Just Bring It",
].map(normalizeString);

const checkIsMultitapGame = (gameName: string) => {
  const multitapGamesSet = new Set([
    ...multitapGames,
    ...multitapGamesFallback,
  ]);
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
        {
          filename: "OpenPS2BIOS-0.5.bin",
          hash: "e6d3b308ba10a8603bad929f59e50f8c023acc2c297aaa82ec0bd155e99b98fc",
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
  bundledBiosOpenSource: true,
  bundledPath,
};
