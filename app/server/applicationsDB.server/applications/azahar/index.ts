import type { Application } from "../../types.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import { EOL } from "node:os";
import { getKeyboardDebugMapping, keyboardConfig } from "./keyboardConfig.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import fs from "node:fs";
import { defaultSettings } from "./defaultSettings.js";
import { importElectron } from "../../../importElectron.server.js";
import { commandLineOptions } from "../../../commandLine.server.js";
import { envPaths } from "../../../envPaths.server.js";
import { isWindows } from "../../../operationsystem.server.js";
import { isSteamDeckController } from "../../../../types/gamepad.js";
import { disableSetting, getSetting } from "./getSettings.js";
import type { AzaharButtonId } from "./types.js";

const flatpakId = "io.github.lime3ds.Lime3DS";
const applicationId: ApplicationId = "azahar";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "azahar.exe");

const configFileName = "qt-config.ini";

const azaharButtonIds = {
  button_a: 1,
  button_b: 0,
  button_x: 3,
  button_y: 2,
  button_l: 4,
  button_r: 5,
  button_select: 6,
  button_start: 7,
} satisfies Partial<Record<AzaharButtonId, number>>;

const getGamepadButtonMapping = (
  azaharButtonId: AzaharButtonId,
  button: number,
  guid: string,
): ParamToReplace[] =>
  getSetting(
    `profiles\\1\\${azaharButtonId}`,
    `button:${button},engine:sdl,guid:${guid},port:0`,
  );

const getGamepadDpadButtonMapping = (
  direction: "up" | "down" | "left" | "right",
  guid: string,
): ParamToReplace[] =>
  getSetting(
    `profiles\\1\\button_${direction}`,
    `direction:${direction},engine:sdl,guid:${guid},hat:0,port:0`,
  );

const getGamepadButtonMappings = (guid: string): ParamToReplace[] =>
  Object.entries(azaharButtonIds).flatMap(([azaharButtonId, button]) =>
    getGamepadButtonMapping(azaharButtonId as AzaharButtonId, button, guid),
  );

export const getVirtualGamepad = (
  sdlDevice: Sdl.Joystick.Device,
): ParamToReplace[] => {
  log("debug", "gamepad", { sdlDevice });

  const guid = sdlDevice.guid!;

  return [
    ...getSetting("profile", 0),
    ...getGamepadButtonMappings(guid),
    ...getGamepadDpadButtonMapping("up", guid),
    ...getGamepadDpadButtonMapping("down", guid),
    ...getGamepadDpadButtonMapping("left", guid),
    ...getGamepadDpadButtonMapping("right", guid),
    ...getSetting(
      "profiles\\1\\button_zl",
      `axis:2,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\button_zr",
      `axis:5,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\circle_pad",
      `axis_x:0,axis_y:1,deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\c_stick",
      `axis_x:3,axis_y:4,deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getKeyboardDebugMapping(),
  ];
};

const getGamepad = () => {
  const gamepads = sdl.joystick.devices;

  if (gamepads.length === 1) {
    return gamepads[0];
  }

  if (gamepads.length > 1) {
    if (isSteamDeckController(gamepads[0])) {
      return gamepads[1];
    } else {
      return gamepads[0];
    }
  }
  return null;
};

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  const gamepad = getGamepad();
  const virtualGamepad = gamepad ? getVirtualGamepad(gamepad) : keyboardConfig;

  return replaceSection(sections, "[Controls]", virtualGamepad);
};

export const replaceMiscellaneousConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Miscellaneous]", [
    ...getSetting("check_for_update_on_start", false),
  ]);

// TODO: implement `disable param with same value` with setting the default value
export const replaceUiConfig =
  (n3dsRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[UI]", [
      ...getSetting("confirmClose", false),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Fullscreen\\KeySeq",
        "F2",
        false,
      ),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Quick%20Save\\KeySeq",
        "F1",
        false,
      ),
      ...getSetting(
        "Shortcuts\\Main%20Window\\Quick%20Load\\KeySeq",
        "F3",
        false,
      ),
      ...disableSetting("Shortcuts\\Main%20Window\\Load%20Amiibo\\KeySeq"),
      ...disableSetting("Shortcuts\\Main%20Window\\Remove%20Amiibo\\KeySeq"),
      ...getSetting("firstStart", false),
      ...getSetting("saveStateWarning", false),
      { keyValue: `Paths\\romsPath=${n3dsRomsPath}` },
      { keyValue: "fullscreen\\default=true" },
    ]);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "azahar",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const getConfigFilePath = (configFileName: string) => {
  if (isWindows()) {
    const { config } = envPaths("Azahar", { suffix: "" });
    return nodepath.join(config, configFileName);
  } else {
    const { config } = envPaths("azahar", { suffix: "emu" });
    return nodepath.join(config, configFileName);
  }
};

export const replaceConfigSections = (n3dsRomsPath: string) => {
  const filePath = getConfigFilePath(configFileName);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig(n3dsRomsPath),
    replaceGamepadConfig,
    replaceMiscellaneousConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const azahar: Application = {
  id: applicationId,
  name: "Azahar",
  fileExtensions: [".cci"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const n3dsRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(n3dsRomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};

export const isLime3dsFor3ds = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.lime3ds.id) ||
    process.env.EMUZE_LIME3DS === "true"
  );
};
