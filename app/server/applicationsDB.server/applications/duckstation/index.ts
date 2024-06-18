import type { Application } from "../../types";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import { log } from "../../../debug.server";
import fs from "fs";
import { EOL } from "os";
import { isWindows } from "../../../operationsystem.server";
import {
  getFlatpakConfigPath,
  getWindowsConfigFilePath,
} from "../../getConfigFilePath";
import * as path from "node:path";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, sdlDevice });

  return [
    `[Pad${index + 1}]`,
    `Type = AnalogController`,
    `Up = SDL-${index}/DPadUp`,
    `Right = SDL-${index}/DPadRight`,
    `Down = SDL-${index}/DPadDown`,
    `Left = SDL-${index}/DPadLeft`,
    `Triangle = SDL-${index}/Y`,
    `Circle = SDL-${index}/B`,
    `Cross = SDL-${index}/A`,
    `Square = SDL-${index}/X`,
    `Select = SDL-${index}/Back`,
    `Start = SDL-${index}/Start`,
    `L1 = SDL-${index}/LeftShoulder`,
    `R1 = SDL-${index}/RightShoulder`,
    `L2 = SDL-${index}/+LeftTrigger`,
    `R2 = SDL-${index}/+RightTrigger`,
    `L3 = SDL-${index}/LeftStick`,
    `R3 = SDL-${index}/RightStick`,
    `LLeft = SDL-${index}/-LeftX`,
    `LRight = SDL-${index}/+LeftX`,
    `LDown = SDL-${index}/+LeftY`,
    `LUp = SDL-${index}/-LeftY`,
    `RLeft = SDL-${index}/-RightX`,
    `RRight = SDL-${index}/+RightX`,
    `RDown = SDL-${index}/+RightY`,
    `RUp = SDL-${index}/-RightY`,
    `Analog = SDL-${index}/Guide`,
    `SmallMotor = SDL-${index}/SmallMotor`,
    `LargeMotor = SDL-${index}/LargeMotor`,
    "",
  ];
};

const getVirtualGamepadReset = (gamepadIndex: number) => [
  `[Pad${gamepadIndex + 1}]`,
  "Type = None",
  "",
];

export const getVirtualGamepads = () => {
  const gamepads = sdl.controller.devices;

  const virtualGamepads = gamepads.flatMap(getVirtualGamepad);

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(8, gamepads.length, getVirtualGamepadReset),
  ];
};

export const replaceGamepadConfig = (sections: string[]) => {
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(getVirtualGamepads().join(EOL));
      } else if (!section.startsWith("[Pad")) {
        accumulator.push(section);
      }

      return accumulator;
    }, []);
  } else {
    return [...sections, getVirtualGamepads().join(EOL)];
  }
};

const replaceHotkeys = (hotkeys: string[], hotkeysToReplace: string[]) => [
  ...hotkeys.reduce<string[]>((accumulator, hotkey) => {
    if (
      !hotkeysToReplace.find((hotkeyToReplace) =>
        hotkeyToReplace.startsWith(hotkey.split("=")[0].trim()),
      )
    ) {
      accumulator.push(hotkey);
    }

    return accumulator;
  }, []),
  ...hotkeysToReplace,
  "",
];

export const replaceHotkeyConfig = (sections: string[]) => {
  // TODO: check if keyboard key is already used and remove it
  const hotkeysToSet = [
    "OpenPauseMenu = Keyboard/F2",
    "ToggleFullscreen = Keyboard/F11",
    "SaveSelectedSaveState = Keyboard/F1",
    "LoadSelectedSaveState = Keyboard/F3",
  ];

  const hotkeysIndex = sections.findIndex((section) =>
    section.startsWith("[Hotkeys]"),
  );

  if (hotkeysIndex !== -1) {
    const hotkeys = sections[hotkeysIndex].split(EOL);
    sections.splice(
      hotkeysIndex,
      1,
      replaceHotkeys(hotkeys, hotkeysToSet).join(EOL),
    );
    return sections;
  }

  return [...sections, "[Hotkeys]", ...hotkeysToSet];
};

const flatpakId = "org.duckstation.DuckStation";
const configFileName = "settings.ini";

export const getConfigFilePath = (
  flatpakId: string,
  configFileName: string,
) => {
  if (isWindows()) {
    return getWindowsConfigFilePath(configFileName);
  } else {
    return path.join(
      getFlatpakConfigPath(flatpakId),
      "duckstation",
      configFileName,
    );
  }
};

export const replaceConfigSections = () => {
  const filePath = getConfigFilePath(flatpakId, configFileName);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // split by new line characters that are followed by a section header (e.g. [Pad1])
  const sections = fileContent.split(new RegExp(`${EOL}(?=\\[[^]+])`));

  // TODO: set sdl and multitap config
  const fileContentNew = replaceHotkeyConfig(
    replaceGamepadConfig(sections),
  ).join(EOL);

  // TODO: create file if not exists

  fs.writeFileSync(filePath, fileContentNew, "utf8");
};

export const duckstation: Application = {
  id: "duckstation",
  name: "DuckStation",
  fileExtensions: [".chd", ".cue"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceConfigSections();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};
