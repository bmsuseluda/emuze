import nodepath from "node:path";
import fs from "node:fs";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL, homedir } from "node:os";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import {
  getPlayerIndexArray,
  keyboardMapping,
  removeVendorFromGuid,
} from "../../../../types/gamepad.js";
import { isWindows } from "../../../operationsystem.server.js";

const flatpakId = "app.xemu.xemu";
const applicationId: ApplicationId = "xemu";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "xemu.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const { data } = envPaths("xemu", { suffix: "" });

const configFileName = "xemu.toml";
export const getConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      homedir(),
      "AppData",
      "Roaming",
      "xemu",
      "xemu",
      configFileName,
    );
  } else {
    return nodepath.join(data, "xemu", configFileName);
  }
};

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "xemu",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return ``;
  }
};

const keyboardConfig: ParamToReplace[] = [
  { keyValue: "port1_driver = 'usb-xbox-gamepad'" },
  { keyValue: "port1 = 'keyboard'" },
];

const replaceGeneralConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general]", [{ keyValue: "show_welcome = false" }]);

const replaceGeneralUpdatesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general.updates]", [
    { keyValue: "check = false" },
  ]);

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number): ParamToReplace[] => {
    log("debug", "gamepad", { sdlIndex, sdlDevice });

    return [
      {
        keyValue: `port${playerIndexArray[sdlIndex] + 1}_driver = 'usb-xbox-gamepad'`,
      },
      {
        keyValue: `port${playerIndexArray[sdlIndex] + 1} = '${removeVendorFromGuid(sdlDevice.guid!)}'`,
      },
    ];
  };

const replaceInputBindingsConfig: SectionReplacement = (sections) => {
  const gamepads = sdl.joystick.devices;
  const playerIndexArray = getPlayerIndexArray(gamepads);
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.flatMap(getVirtualGamepad(playerIndexArray))
      : keyboardConfig;

  return replaceSection(
    sections,
    "[input.bindings]",
    [...virtualGamepads, { keyValue: `guide = ${sdl.keyboard.SCANCODE.F2}` }],
    true,
  );
};

const xemuButtonIds = {
  dpadUp: "dpad_up",
  dpadLeft: "dpad_left",
  dpadDown: "dpad_down",
  dpadRight: "dpad_right",
  a: "a",
  b: "b",
  x: "x",
  y: "y",
  back: "back",
  start: "start",
  leftShoulder: "black",
  rightShoulder: "white",
  leftStick: "lstick_btn",
  rightStick: "rstick_btn",
  leftStickUp: "lstick_up",
  leftStickDown: "lstick_down",
  leftStickLeft: "lstick_left",
  leftStickRight: "lstick_right",
  leftTrigger: "ltrigger",
  rightStickUp: "rstick_up",
  rightStickDown: "rstick_down",
  rightStickLeft: "rstick_left",
  rightStickRight: "rstick_right",
  rightTrigger: "rtrigger",
} satisfies Partial<Record<EmuzeButtonId, string>>;

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(xemuButtonIds).map(([sdlButtonId, xemuButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];
    const sdlScancode = sdl.keyboard.SCANCODE[sdlScancodeName];

    return {
      keyValue: `${xemuButtonId} = ${sdlScancode}`,
    };
  });

const replaceKeyboardControllerConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[input.keyboard_controller_scancode_map]", [
    ...getKeyboardButtonMappings(),
  ]);

const replaceConfigFile = () => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig,
    replaceGeneralUpdatesConfig,
    replaceInputBindingsConfig,
    replaceKeyboardControllerConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const xemu: Application = {
  id: applicationId,
  name: "xemu",
  fileExtensions: [".iso", ".xiso"],
  flatpakId,
  omitAbsoluteEntryPathAsLastParam: true,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
  }) => {
    replaceConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-full-screen");
    }
    optionParams.push(...["-dvd_path", absoluteEntryPath]);
    return optionParams;
  },
  bundledPath,
};
