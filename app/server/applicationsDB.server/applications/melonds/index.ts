import nodepath from "node:path";
import fs from "node:fs";
import type { Sdl } from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
import { EOL, homedir } from "node:os";
import { log } from "../../../debug.server.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import { defaultSettings } from "./defaultSettings.js";

const flatpakId = "net.kuribo64.melonDS";
const applicationId: ApplicationId = "melonds";
const bundledPathLinux = nodepath.join(
  applicationId,
  `melonDS-x86_64.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "melonDS.exe");

const { config } = envPaths("melonDS", { suffix: "" });

const configFileName = "melonDS.toml";
export const getConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      homedir(),
      "AppData",
      "Roaming",
      "melonDS",
      configFileName,
    );
  } else {
    return nodepath.join(config, configFileName);
  }
};

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "melonDS",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const scancodes = {
  F2: 16777265,
  T: 84,
  G: 71,
  F: 70,
  H: 72,
  BACKSPACE: -2130706400,
  RETURN: 16777220,
  J: 75,
  K: 74,
  U: 73,
  I: 85,
  L: 76,
  O: 79,
  "8": 56,
  "9": 57,
  X: 58,
  Y: 89,
  P: 80,
  E: 69,
  V: 86,
  RSHIFT: -2130706400,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  UP: 16777235,
  DOWN: 16777237,
  LEFT: 16777234,
  RIGHT: 16777236,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

const melonDsButtonIds = {
  dpadUp: "Up",
  dpadLeft: "Left",
  dpadDown: "Down",
  dpadRight: "Right",
  a: "B",
  b: "A",
  x: "Y",
  y: "X",
  back: "Select",
  start: "Start",
  leftShoulder: "L",
  rightShoulder: "R",
} satisfies Partial<Record<EmuzeButtonId, string>>;

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(melonDsButtonIds).map(([sdlButtonId, melonDsButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];
    const sdlScancode = scancodes[sdlScancodeName] as number;

    return {
      keyValue: `${melonDsButtonId} = ${sdlScancode}`,
    };
  });

const replaceKeyboardConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Instance0.Keyboard]", [
    ...getKeyboardButtonMappings(),
    { keyValue: `HK_FullscreenToggle = ${scancodes.F2}` },
  ]);

const replaceConfigFile = () => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceKeyboardConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const melonds: Application = {
  id: applicationId,
  name: "MelonDS",
  fileExtensions: [".nds"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
