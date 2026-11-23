import type { Application, DetectedRequiredFile } from "../../types.js";
import { log } from "../../../debug.server.js";
import fs from "node:fs";
import { EOL, homedir } from "node:os";
import { handleOperatingSystem } from "../../../operationsystem.server.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
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
import multitapGames from "../../../../../fetchMetaData/multitapGames/sonyplaystation.json" with { type: "json" };
import { normalizeString } from "../../../igdb.server.js";
import { AdvancedSettings } from "../../../../types/jsonFiles/settings/advanced.js";
import {
  ApplicationHotkeys,
  Hotkey,
  hotkeysDefinition,
} from "../../../../types/hotkeys.js";

const applicationId: ApplicationId = "duckstation";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "duckstation-qt-x64-ReleaseLTCG.exe"),
  mac: nodepath.join(applicationId, "DuckStation.app"),
  linux: nodepath.join(applicationId, `${applicationId}.AppImage`),
});

const configFileName = "settings.ini";

export const replaceGamepadConfig = (gameName: string): SectionReplacement => {
  const virtualGamepads = getVirtualGamepads(gameName);

  return replaceGamepadConfigSection(
    virtualGamepads,
    "[Pad1]",
    (section: string) => !section.startsWith("[Pad"),
  );
};

const hotkeys: ApplicationHotkeys = {
  Rewind: "Rewind",
  "Fast Forward": "ToggleFastForward",
  "Load State": "LoadSelectedSaveState",
  "Save State": "SaveSelectedSaveState",
  Fullscreen: "ToggleFullscreen",
  "Emulator Menu": "OpenPauseMenu",
};

const getHotkeyParams = () =>
  Object.entries(hotkeys).flatMap<ParamToReplace>(([key, value]) => [
    {
      keyValue: `${value} = Keyboard/${hotkeysDefinition[key as Hotkey].keyboard}`,
      disableParamWithSameValue: true,
    },
  ]);

export const replaceHotkeyConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", getHotkeyParams());

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", [
    { keyValue: "CheckAtStartup = false" },
  ]);

export const replaceMainConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Main]", [
    { keyValue: "ConfirmPowerOff = false" },
    { keyValue: "SetupWizardIncomplete = false" },
    { keyValue: "RewindEnable = true" },
    { keyValue: "FastForwardSpeed = 3" },
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

// TODO: Remove when igdb is updated
const multitapGamesFallback = [
  "Bishi Bashi Special",
  "Capcom Generations: Blazing Guns",
  "Captain Commando",
  "Rampage Through Time",
  "Rampage 2: Universal Tour",
  "2002 FIFA World Cup",
  "Actua Soccer 3",
  "All Star Soccer",
  "Chris Kamara's Street Soccer",
  "Dare Devil Derby 3D",
  "FIFA 2000: Major League Soccer",
  "FIFA 2001",
  "FIFA Soccer 2002",
  "FIFA Soccer 2003",
  "FIFA Soccer 2004",
  "FIFA Soccer 2005",
  "FIFA Soccer 96",
  "FIFA Soccer 97",
  "FoxKids.com Micro Maniacs Racing",
  "Fox Sports Soccer '99",
  "Inspector Gadget: Gadget's Crazy Maze",
  "Jimmy Johnson's VR Football '98",
  "Madden NFL 2000",
  "Madden NFL 2001",
  "Madden NFL 2002",
  "Madden NFL 2003",
  "Madden NFL 2004",
  "Madden NFL 2005",
  "Madden NFL 97",
  "Madden NFL 98",
  "Madden NFL 99",
  "March Madness '98",
  "Micro Maniacs",
  "Monopoly",
  "Monster Rancher Battle Card Episode II",
  "NBA Action 98",
  "NBA Basketball 2000",
  "NBA in the Zone",
  "NBA in the Zone 2",
  "NBA in the Zone 2000",
  "NBA in the Zone '98",
  "NBA in the Zone '99",
  "NBA Live 2000",
  "NBA Live 2001",
  "NBA Live 2002",
  "NBA Live 2003",
  "NBA Live 96",
  "NBA Live 97",
  "NBA Live 98",
  "NBA Live 99",
  "NBA ShootOut",
  "NBA ShootOut 2000",
  "NBA ShootOut 2001",
  "NBA ShootOut 2002",
  "NBA ShootOut 2004",
  "NCAA Basketball: Final Four 97",
  "NCAA Final Four 2000",
  "NCAA Final Four 2001",
  "NCAA Final Four 99",
  "NCAA Football 2000",
  "NCAA Football 2001",
  "NCAA Football 98",
  "NCAA Football 99",
  "NCAA Gamebreaker",
  "NCAA GameBreaker 2000",
  "NCAA GameBreaker 2001",
  "NCAA GameBreaker 98",
  "NCAA GameBreaker 99",
  "NCAA March Madness 2000",
  "NCAA March Madness 2001",
  "NCAA March Madness 99",
  "NFL GameDay 2000",
  "NFL GameDay 2001",
  "NFL GameDay 2002",
  "NFL GameDay 2003",
  "NFL GameDay 2004",
  "NFL GameDay 2005",
  "NFL GameDay '97",
  "NFL GameDay 98",
  "NFL GameDay 99",
  "NFL Quarterback Club 97",
  "NFL Xtreme 2",
  "NHL 2000",
  "NHL 2001",
  "NHL 97",
  "NHL 98",
  "NHL 99",
  "NHL Blades of Steel 2000",
  "NHL Breakaway 98",
  "NHL Championship 2000",
  "NHL FaceOff 2000",
  "NHL FaceOff 2001",
  "NHL FaceOff '97",
  "NHL FaceOff '98",
  "NHL FaceOff 99",
  "NHL Powerplay 98",
  "Olympic Summer Games",
  "Pro 18 World Tour Golf",
  "Professional Underground League of Pain",
  "Puma Street Soccer",
  "Rival Schools",
  "ShaoLin",
  "Shiritsu Justice Gakuen: Nekketsu Seishun Nikki 2",
  "Street Racer",
  "Super Match Soccer",
  "Sydney 2000",
  "This Is Football",
  "This Is Football 2",
  "Triple Play 97",
  "Triple Play 98",
  "Triple Play 99",
  "UEFA Champions League Season 1999/2000",
  "UEFA Champions League Season 2000/2001",
  "UEFA Euro 2000",
  "World Cup 98",
  "Brunswick Circuit Pro Bowling",
  "The Game of Life",
  "NBA Hoopz",
  "Space Jam",
  "Ten Pin Alley",
  "Top Shop",
  "Aquarian Age: Tokyo Wars",
  "Bomberman Party Edition",
  "Bomberman World",
  "Devil Dice",
  "Overboard!",
  "Shipwreckers!",
  "Actua Golf 3",
  "Actua Ice Hockey",
  "Actua Ice Hockey 2",
  "Actua Soccer 2",
  "Actua Tennis",
  "Adidas Power Soccer",
  "Adidas Power Soccer 2",
  "Adidas Power Soccer 98",
  "Adidas Power Soccer International 97",
  "All Star Tennis 2000",
  "All Star Tennis '99",
  "All Star Watersports",
  "Anna Kournikova's Smash Court Tennis",
  "Anokodokonoko",
  "Arcade's Greatest Hits: The Atari Collection 2",
  "Art Camion Sugorokuden",
  "Atari Anniversary Edition Redux",
  "Backyard Soccer",
  "Battle Hunter",
  "Blast Chamber",
  "Blaze and Blade Busters",
  "Bleach Blade Battlers 2nd",
  "Blood Lines",
  "Bomberman Land",
  "Breakout",
  "Break Point",
  "Brian Lara Cricket",
  "Buttsubushi",
  "Caesars Palace 2000",
  "Caesars Palace II",
  "California Surfing",
  "Card Shark",
  "Catan: Die Erste Insel",
  "Chessmaster II",
  "Chocobo Collection",
  "Circuit Breakers",
  "College Slam",
  "Cubix - Robots for Everyone: Race 'N Robots",
  "CyberTiger",
  "David Beckham Soccer",
  "Davis Cup Complete Tennis",
  "Dinomaster Party",
  "Dioramos",
  "Disney's Pooh's Party Game: In Search of the Treasure",
  "Dragon Money",
  "Dynamite Soccer 98",
  "ECW Anarchy Rulz",
  "ECW Hardcore Revolution",
  "ESPN MLS GameNight",
  "European Super League",
  "Family Games Compendium",
  "Fantastic Four",
  "The F.A. Premier League Stars",
  "The F.A. Premier League Stars 2001",
  "Fire Pro Wrestling G",
  "Fox Sports Golf '99",
  "Frogger",
  "Frogger 2: Swampy's Revenge",
  "Galaxian 3",
  "Gekido",
  "Gritz: The Pyramid Adventure",
  "High School! Kimengumi: The Table Hockey",
  "Hi Hou Ou: Mou Omae Tobakuchi Kikan!!",
  "Hogs of War",
  "Hot Shots Golf",
  "Hot Shots Golf 2",
  "Hot Wheels Extreme Racing",
  "Hyper Tennis: Final Match",
  "International Superstar Soccer 2000",
  "International Superstar Soccer Deluxe",
  "International Track & Field",
  "International Track & Field 2000",
  "ISS Pro Evolution",
  "ISS Pro Evolution 2",
  "Itadaki Street: Gorgeous King",
  "Jarrett & Labonte Stock Car Racing",
  "Jetracer",
  "Jigsaw Island: Japan Graffiti",
  "Jigsaw Madness",
  "Jonah Lomu Rugby",
  "Jun Classic C.C. & Rope Club",
  "Karei Naru Casino Club: Double Draw",
  "Kero Kero King",
  "Kick Off World",
  "Klonoa Beach Volleyball",
  "Kurt Warner's Arena Football Unleashed",
  "Love Game's WaiWai Tennis Plus",
  "Meru Purana",
  "Michael Owen's World League Soccer '99",
  "Missland 2",
  "Monster Racer",
  "Monte Carlo Games Compendium",
  "Motor Mash",
  "Motto Trump Shiyouyo!: i-mode no Grand Prix",
  "Ms. Pac-Man Maze Madness",
  "Music 2000",
  "Nagano Winter Olympics '98",
  "NBA Hangtime",
  "NBA Jam Extreme",
  "NBA Jam Tournament Edition",
  "NBA Showtime: NBA on NBC",
  "Need for Speed: Porsche Unleashed",
  "Need for Speed: Porsche 2000",
  "Need for Speed: V-Rally 2",
  "NFL Blitz 2000",
  "NFL Blitz 2001",
  "NHL Open Ice: 2 On 2 Challenge",
  "NOON: New Type Action Game",
  "Olympic Soccer",
  "Pangaea",
  "Panzer Bandit",
  "Paro Wars",
  "Peter Jacobsen's Golden Tee Golf",
  "Pete Sampras Tennis 97",
  "Pitball",
  "Polaris SnoCross",
  "Power Play Sports Trivia",
  "Power Spike: Pro Beach Volleyball",
  "Poy Poy",
  "Poy Poy 2",
  "Premier Manager 2000",
  "Premier Manager: Ninety Nine",
  "Pro Evolution Soccer",
  "Pro Evolution Soccer 2",
  "Pro Wrestling Sengokuden: Hyper Tag Match",
  "Putter Golf",
  "Puyo Puyo Box",
  "Quake II",
  "Rageball",
  "Rakugaki Showtime",
  "Rally Cross",
  "Rat Attack!",
  "Risk: The Game of Global Domination",
  "Road Rash: Jailbreak",
  "Running Wild",
  "S.C.A.R.S.",
  "Scrabble",
  "Shinobi no Roku",
  "Simple 1500 Series: Vol.55 - The Darts",
  "Simple 1500 Series: Vol.60 - The Table Hockey",
  "Simple 1500 Series: Vol.65 - The Golf",
  "Simple 1500 Series: Vol.72 - The Beach Volleyball",
  "Sky Sports Football Quiz",
  "Sky Sports Football Quiz Season 02",
  "Slam 'N Jam '96 featuring Magic & Kareem",
  "Sled Storm",
  "Smash Court",
  "Soccer '97",
  "South Park: Chef's Luv Shack",
  "Speed Punks",
  "Striker '96",
  "Striker Pro 2000",
  "Suchie-Pai Adventure: Doki Doki Nightmare",
  "Super Football Champ",
  "SuperLite 1500 Series: Anokodokonoko Endless Season",
  "Syndicate Wars",
  "Tales of Destiny II",
  "Tales of Eternia",
  "Team Buddies",
  "Tennis",
  "Tennis Arena",
  "Tiger Woods 99 PGA Tour Golf",
  "Tiger Woods PGA Tour 2000",
  "Tiger Woods PGA Tour 2001",
  "TOCA World Touring Cars",
  "Trash It",
  "Trump Shiyouyo! Fukkoku-ban",
  "Twisted Metal 3",
  "Twisted Metal 4",
  "Uchū Gōshōden: Bakuretsu Akindo",
  "UEFA Challenge",
  "UEFA Champions League Season 1998/99",
  "Vegas Casino",
  "Vegas Games 2000",
  "Viva Soccer",
  "VR Golf '97",
  "Waku Waku Derby",
  "WCW Mayhem",
  "Westlife Fan-O-Mania",
  "Who Wants to Be a Millionaire",
  "Who Wants to Be a Millionaire: 2nd Edition",
  "World League Soccer '98",
  "World Soccer: Winning Eleven 6 International",
  "Wu-Tang: Shaolin Style",
  "WWF Attitude",
  "WWF in Your House",
  "WWF Smackdown!",
  "WWF War Zone",
  "Yeh Yeh Tennis",
  "ZigZagBall",
  "Zipangujima: Unmei wa Saikoro ga Kimeru!?",
].map(normalizeString);

export const replaceControllerPortsConfig =
  (gameName: string): SectionReplacement =>
  (sections) => {
    const multitapGamesSet = new Set([
      ...multitapGames,
      ...multitapGamesFallback,
    ]);
    const isMultitapGame = multitapGamesSet.has(normalizeString(gameName));
    const multitapMode = isMultitapGame ? "Port1Only" : "Disabled";

    return replaceSection(sections, "[ControllerPorts]", [
      { keyValue: `MultitapMode = ${multitapMode}` },
    ]);
  };

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

export const replaceGpuConfig =
  (advancedSettings?: AdvancedSettings): SectionReplacement =>
  (sections) => {
    const resolution = advancedSettings?.resolution || defaultResolution;
    const perspectiveCorrection =
      advancedSettings?.perspectiveCorrection || defaultPerspectiveCorrection;
    const ntscTimings = advancedSettings?.ntscTimings || defaultNtscTimings;

    return replaceSection(sections, "[GPU]", [
      {
        keyValue: `ResolutionScale = ${resolution}`,
      },
      {
        keyValue: `ForceNTSCTimings = ${ntscTimings}`,
      },
      {
        keyValue: `PGXPEnable = ${perspectiveCorrection}`,
      },
      { keyValue: "PGXPCulling = true" },
      { keyValue: "PGXPTextureCorrection = true" },
      { keyValue: "PGXPColorCorrection = true" },
      { keyValue: "PGXPPreserveProjFP = true" },
    ]);
  };

export const replacePostProcessingConfig =
  (shader: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[PostProcessing]", [
      {
        keyValue: `Enabled = ${shader !== defaultShader}`,
      },
      { keyValue: "StageCount = 1" },
    ]);

export const replacePostProcessingStage1Config =
  (shader: string): SectionReplacement =>
  (sections) =>
    replaceSection(
      sections,
      "[PostProcessing/Stage1]",
      shader !== defaultShader
        ? [
            {
              keyValue: `ShaderName = ${shader}`,
            },
          ]
        : [],
    );

export const replaceConfigSections = (
  psxRomsPath: string,
  gameName: string,
  biosFiles: DetectedRequiredFile[],
  advancedSettings?: AdvancedSettings,
) => {
  const shader = advancedSettings?.shader || defaultShader;

  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInputSourcesConfig,
    replaceControllerPortsConfig(gameName),
    replaceMainConfig,
    replaceGpuConfig(advancedSettings),
    replaceBiosConfig(biosFiles),
    replaceGamepadConfig(gameName),
    replaceHotkeyConfig,
    replaceAutoUpdaterConfig,
    replaceGameListConfig(psxRomsPath),
    replaceUiConfig,
    replacePostProcessingConfig(shader),
    replacePostProcessingStage1Config(shader),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = handleOperatingSystem({
  windows: () => nodepath.join(homedir(), "Documents", "DuckStation"),
  linux: () => {
    const { data } = envPaths("duckstation", { suffix: "" });
    return nodepath.join(data);
  },
});

const defaultResolution = "1";
const defaultPerspectiveCorrection = "false";
const defaultNtscTimings = "false";
const defaultShader = "false";

export const duckstation: Application = {
  id: applicationId,
  name: "DuckStation (Legacy)",
  fileExtensions: [".chd", ".cue"],
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
        {
          filename: "openbios.bin",
          hash: "8a8925807952965c4a116239a21903476c5c585387a1d4778a90b9b9c01804ee",
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
    emulatorSettings,
  }) => {
    const psxRomsPath = nodepath.join(categoriesPath, categoryData.name);

    replaceConfigSections(
      psxRomsPath,
      entryData.name,
      biosFiles!,
      emulatorSettings,
    );

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
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x (1280x896)", value: "2" },
        { name: "3x (1920x1344)", value: "3" },
        { name: "4x (2560x1792)", value: "4" },
        { name: "5x (3200x2240)", value: "5" },
        { name: "6x (3840x2688)", value: "6" },
        { name: "7x (4480x3136)", value: "7" },
        { name: "8x (5120x3584)", value: "8" },
        { name: "9x (5760x4032)", value: "9" },
      ],
    },
    {
      id: "perspectiveCorrection",
      label: "PGXP Perspective Correction",
      options: [
        { name: "Off", value: defaultPerspectiveCorrection },
        { name: "On", value: "true" },
      ],
    },
    {
      id: "ntscTimings",
      label: "Force NTSC Timings",
      options: [
        { name: "Off", value: defaultNtscTimings },
        { name: "On", value: "true" },
      ],
    },
    {
      id: "shader",
      label: "Shader",
      options: [
        { name: "Off", value: defaultShader },
        { name: "CRT Lottes 2", value: "CRTLottes2" },
        { name: "CRT Hyllian", value: "dolphinfx/crt/CRT-HYLLIAN" },
        { name: "CRT New Pixie", value: "CRT-NewPixie" },
      ],
    },
  ],
  hotkeys,
};
